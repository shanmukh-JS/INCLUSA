import {
  AccessibilityIssue,
  AccessibilityScoreResult,
  CategoryScores,
  RuleCategory,
  SeverityLevel,
  VerificationResult,
} from '../types';

// Category Weights (Sum = 1.0 / 100%)
export const CATEGORY_WEIGHTS: Record<RuleCategory, number> = {
  vision: 0.20,
  cognitive: 0.20,
  hearing: 0.15,
  language: 0.15,
  structure: 0.15,
  screen_reader: 0.15,
};

// Penalty Deductions by Severity per Issue
export const SEVERITY_PENALTIES: Record<SeverityLevel, number> = {
  critical: 28,
  high: 16,
  medium: 8,
  low: 3,
  passed: 0,
};

/**
 * Calculates category score (0..100) based on active issues within that category.
 */
export function calculateCategoryScore(category: RuleCategory, issues: AccessibilityIssue[]): number {
  const categoryIssues = issues.filter((iss) => iss.category === category && !iss.isResolved);
  
  if (categoryIssues.length === 0) {
    return 100;
  }

  let totalPenalty = 0;
  for (const issue of categoryIssues) {
    const penalty = SEVERITY_PENALTIES[issue.severity] || 0;
    // Scale penalty slightly by confidence
    const confidenceMultiplier = (issue.confidenceScore || 100) / 100;
    totalPenalty += penalty * confidenceMultiplier;
  }

  const rawScore = 100 - totalPenalty;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Calculates overall weighted accessibility score (0..100) across all 6 categories.
 */
export function calculateOverallScore(categoryScores: CategoryScores): number {
  const weighted =
    categoryScores.vision * CATEGORY_WEIGHTS.vision +
    categoryScores.cognitive * CATEGORY_WEIGHTS.cognitive +
    categoryScores.hearing * CATEGORY_WEIGHTS.hearing +
    categoryScores.language * CATEGORY_WEIGHTS.language +
    categoryScores.structure * CATEGORY_WEIGHTS.structure +
    categoryScores.screenReader * CATEGORY_WEIGHTS.screen_reader;

  return Math.max(0, Math.min(100, Math.round(weighted)));
}

/**
 * Derives qualitative status label from numeric score.
 */
export function getScoreStatus(score: number): 'Critical Barriers' | 'Needs Improvement' | 'Acceptable' | 'Highly Accessible' {
  if (score >= 90) return 'Highly Accessible';
  if (score >= 75) return 'Acceptable';
  if (score >= 50) return 'Needs Improvement';
  return 'Critical Barriers';
}

/**
 * Computes full initial score result from detected issues.
 */
export function calculateInitialScore(issues: AccessibilityIssue[]): AccessibilityScoreResult {
  const categories: CategoryScores = {
    vision: calculateCategoryScore('vision', issues),
    cognitive: calculateCategoryScore('cognitive', issues),
    hearing: calculateCategoryScore('hearing', issues),
    language: calculateCategoryScore('language', issues),
    structure: calculateCategoryScore('structure', issues),
    screenReader: calculateCategoryScore('screen_reader', issues),
  };

  const overallScore = calculateOverallScore(categories);
  const criticalIssues = issues.filter((i) => i.severity === 'critical' && !i.isResolved).length;
  const highIssues = issues.filter((i) => i.severity === 'high' && !i.isResolved).length;
  const mediumIssues = issues.filter((i) => i.severity === 'medium' && !i.isResolved).length;
  const lowIssues = issues.filter((i) => i.severity === 'low' && !i.isResolved).length;
  const totalIssues = criticalIssues + highIssues + mediumIssues + lowIssues;

  // Passed checks count (24 baseline WCAG rules - unresolved rules)
  const uniqueTriggeredRuleIds = new Set(issues.map((i) => i.ruleId)).size;
  const passedChecks = Math.max(0, 24 - uniqueTriggeredRuleIds);

  return {
    overallScore,
    status: getScoreStatus(overallScore),
    categories,
    totalIssues,
    criticalIssues,
    highIssues,
    mediumIssues,
    lowIssues,
    passedChecks,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Computes final score after transformations have resolved target issues.
 */
export function calculateFinalScore(
  initialIssues: AccessibilityIssue[],
  resolvedIssueIds: Set<string>
): { finalScore: AccessibilityScoreResult; updatedIssues: AccessibilityIssue[] } {
  const updatedIssues = initialIssues.map((issue) => {
    if (resolvedIssueIds.has(issue.id)) {
      return { ...issue, isResolved: true };
    }
    return issue;
  });

  const categories: CategoryScores = {
    vision: calculateCategoryScore('vision', updatedIssues),
    cognitive: calculateCategoryScore('cognitive', updatedIssues),
    hearing: calculateCategoryScore('hearing', updatedIssues),
    language: calculateCategoryScore('language', updatedIssues),
    structure: calculateCategoryScore('structure', updatedIssues),
    screenReader: calculateCategoryScore('screen_reader', updatedIssues),
  };

  const overallScore = calculateOverallScore(categories);
  const criticalIssues = updatedIssues.filter((i) => i.severity === 'critical' && !i.isResolved).length;
  const highIssues = updatedIssues.filter((i) => i.severity === 'high' && !i.isResolved).length;
  const mediumIssues = updatedIssues.filter((i) => i.severity === 'medium' && !i.isResolved).length;
  const lowIssues = updatedIssues.filter((i) => i.severity === 'low' && !i.isResolved).length;
  const totalIssues = criticalIssues + highIssues + mediumIssues + lowIssues;
  const passedChecks = 24 - totalIssues;

  const finalScore: AccessibilityScoreResult = {
    overallScore,
    status: getScoreStatus(overallScore),
    categories,
    totalIssues,
    criticalIssues,
    highIssues,
    mediumIssues,
    lowIssues,
    passedChecks: Math.max(0, passedChecks),
    calculatedAt: new Date().toISOString(),
  };

  return { finalScore, updatedIssues };
}

/**
 * Produces complete VerificationResult comparing Before and After states.
 */
export function calculateVerificationDelta(
  documentId: string,
  initialIssues: AccessibilityIssue[],
  resolvedIssueIds: Set<string>
): VerificationResult {
  const beforeScore = calculateInitialScore(initialIssues);
  const { finalScore, updatedIssues } = calculateFinalScore(initialIssues, resolvedIssueIds);

  const resolvedIssues = updatedIssues.filter((i) => i.isResolved);
  const remainingIssues = updatedIssues.filter((i) => !i.isResolved);
  const scoreImprovement = finalScore.overallScore - beforeScore.overallScore;

  return {
    documentId,
    beforeScore,
    afterScore: finalScore,
    scoreImprovement: Math.max(0, scoreImprovement),
    totalIssuesDetected: initialIssues.length,
    issuesResolved: resolvedIssues.length,
    issuesRemaining: remainingIssues.length,
    resolvedIssues,
    remainingIssues,
    verificationTimestamp: new Date().toISOString(),
  };
}
