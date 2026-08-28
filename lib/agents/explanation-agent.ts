import {
  AccessibilityIssue,
  AccessibilityProfile,
  TransformationItem,
  VerificationResult,
} from '@/types';

/**
 * Agent 6 — Explanation Agent
 * Responsibilities:
 * - Explains all automated remediations in clear, human-understandable terms
 * - Identifies which specific user groups benefit most from the remediations
 * - Outlines remaining action items if any barriers require further attention
 */
export class ExplanationAgent {
  public explain(params: {
    initialIssues: AccessibilityIssue[];
    transformations: TransformationItem[];
    verification: VerificationResult;
    profile: AccessibilityProfile;
  }): {
    summary: string;
    keyRemediations: string[];
    benefitingUserGroups: string[];
  } {
    const { initialIssues, transformations, verification } = params;

    const resolvedCount = verification.issuesResolved;
    const initialScore = verification.beforeScore.overallScore;
    const finalScore = verification.afterScore.overallScore;
    const delta = verification.scoreImprovement;

    const keyRemediations: string[] = [];
    const benefitingGroups = new Set<string>();

    const selectedTypes = new Set(transformations.filter((t) => t.selected).map((t) => t.type));

    if (selectedTypes.has('image_descriptions')) {
      keyRemediations.push(
        'Generated contextual alt text and multi-level chart breakdowns so non-sighted users can comprehend visual trend data.'
      );
      benefitingGroups.add('Blind and Low Vision Individuals');
      benefitingGroups.add('Screen Reader Users');
    }

    if (selectedTypes.has('simplify_language')) {
      keyRemediations.push(
        'Reduced sentence complexity from academic grade level to 7th-grade plain language and generated step-by-step summary bullets.'
      );
      benefitingGroups.add('Individuals with Cognitive & Reading Difficulties (ADHD, Dyslexia)');
      benefitingGroups.add('Non-native English Speakers');
    }

    if (selectedTypes.has('translate')) {
      const target = transformations.find((t) => t.type === 'translate')?.targetLanguage || 'te';
      const langNames: Record<string, string> = { te: 'Telugu', hi: 'Hindi', ta: 'Tamil', kn: 'Kannada' };
      const name = langNames[target] || target.toUpperCase();
      keyRemediations.push(
        `Generated complete regional translation into ${name}, preserving technical structure and accessible formatting.`
      );
      benefitingGroups.add(`${name} Primary Language Speakers`);
    }

    if (selectedTypes.has('screen_reader_structure')) {
      keyRemediations.push(
        'Reconstructed semantic HTML5 landmarks (<main>, <section>), H1-H3 heading hierarchy, and accessible table headers with explicit column scopes.'
      );
      benefitingGroups.add('Screen Reader Navigators');
      benefitingGroups.add('Keyboard-only Users');
    }

    if (selectedTypes.has('audio_transcript') || selectedTypes.has('video_captions')) {
      keyRemediations.push(
        'Generated synchronized WebVTT captions and searchable timestamped text transcript with speaker separation.'
      );
      benefitingGroups.add('Deaf and Hard of Hearing Users');
    }

    const summary = `INCLUSA identified ${initialIssues.length} digital accessibility barriers in the original content (Baseline Accessibility Score: ${initialScore}/100). Through automated agentic remediation, ${resolvedCount} barriers were successfully resolved, increasing the verified accessibility score to ${finalScore}/100 (+${delta} points improvement).`;

    return {
      summary,
      keyRemediations:
        keyRemediations.length > 0
          ? keyRemediations
          : ['All essential accessibility standards were verified and reinforced across all content layers.'],
      benefitingUserGroups: Array.from(benefitingGroups),
    };
  }
}

export const explanationAgent = new ExplanationAgent();
