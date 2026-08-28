import {
  AccessibilityProfile,
  AgentPipelineResult,
  AgentStep,
  TransformationItem,
} from '@/types';
import { contentUnderstandingAgent, IngestionInput } from './content-understanding';
import { accessibilityAuditAgent } from './accessibility-audit';
import { userNeedsAgent } from './user-needs';
import { transformationAgent } from './transformation-engine';
import { verificationAgent } from './verification-engine';
import { explanationAgent } from './explanation-agent';
import { calculateInitialScore } from '../scoring/accessibility-scorer';
import { aiService } from '../ai/ai-service';

export type ProgressCallback = (step: AgentStep, allSteps: AgentStep[]) => void;

/**
 * INCLUSA Master Agent Orchestrator
 * Coordinates the full 6-agent pipeline:
 * Input -> Understand -> Audit -> Personalize -> Transform -> Verify -> Explain
 */
export class InclusaOrchestrator {
  public async runPipeline(
    input: IngestionInput,
    profile: AccessibilityProfile,
    onProgress?: ProgressCallback,
    customTransformations?: TransformationItem[]
  ): Promise<AgentPipelineResult> {
    const aiConfig = aiService.getConfig();

    const steps: AgentStep[] = [
      {
        agentType: 'content_understanding',
        name: 'Agent 1 — Content Understanding',
        status: 'pending',
        currentTask: 'Ingesting file, extracting text, detecting tables, images, and language structure',
        progressPercent: 0,
      },
      {
        agentType: 'accessibility_audit',
        name: 'Agent 2 — Accessibility Audit',
        status: 'pending',
        currentTask: 'Auditing WCAG 2.1 AA/AAA compliance across Vision, Cognitive, Hearing, Language, and Structure',
        progressPercent: 0,
      },
      {
        agentType: 'user_needs',
        name: 'Agent 3 — User Needs Engine',
        status: 'pending',
        currentTask: 'Mapping user disability profile and language preferences to remediation priorities',
        progressPercent: 0,
      },
      {
        agentType: 'transformation_engine',
        name: 'Agent 4 — Transformation Engine',
        status: 'pending',
        currentTask: 'Synthesizing plain language, alt text, regional translations, and screen-reader HTML',
        progressPercent: 0,
      },
      {
        agentType: 'verification_engine',
        name: 'Agent 5 — Verification Engine',
        status: 'pending',
        currentTask: 'Re-auditing transformed output, calculating Before/After scoring delta and resolved issues',
        progressPercent: 0,
      },
      {
        agentType: 'explanation_agent',
        name: 'Agent 6 — Explanation Agent',
        status: 'pending',
        currentTask: 'Compiling human-readable summary of remediations and user group impacts',
        progressPercent: 0,
      },
    ];

    const updateStep = (index: number, updates: Partial<AgentStep>) => {
      steps[index] = { ...steps[index], ...updates };
      if (onProgress) {
        onProgress(steps[index], [...steps]);
      }
    };

    // STEP 1: Content Understanding
    updateStep(0, { status: 'running', progressPercent: 30, startedAt: new Date().toISOString() });
    const t0 = Date.now();
    const structuredContent = await contentUnderstandingAgent.analyze(input);
    updateStep(0, {
      status: 'completed',
      progressPercent: 100,
      durationMs: Date.now() - t0,
      findings: `Extracted ${structuredContent.blocks.length} blocks, ${structuredContent.images.length} images, ${structuredContent.tables.length} tables. Reading grade: ${structuredContent.metadata.readingComplexityFleschKincaid}.`,
      completedAt: new Date().toISOString(),
    });

    // STEP 2: Accessibility Audit
    updateStep(1, { status: 'running', progressPercent: 40, startedAt: new Date().toISOString() });
    const t1 = Date.now();
    const initialIssues = accessibilityAuditAgent.audit(structuredContent);
    const initialScore = calculateInitialScore(initialIssues);
    updateStep(1, {
      status: 'completed',
      progressPercent: 100,
      durationMs: Date.now() - t1,
      findings: `Identified ${initialIssues.length} accessibility barriers (Baseline Score: ${initialScore.overallScore}/100 - ${initialScore.status}).`,
      completedAt: new Date().toISOString(),
    });

    // STEP 3: User Needs Personalization
    updateStep(2, { status: 'running', progressPercent: 50, startedAt: new Date().toISOString() });
    const t2 = Date.now();
    const userNeeds = userNeedsAgent.evaluate(profile, initialIssues);
    const transformationsToRun = customTransformations || userNeeds.recommendedTransformations;
    updateStep(2, {
      status: 'completed',
      progressPercent: 100,
      durationMs: Date.now() - t2,
      findings: `Generated ${userNeeds.requirements.length} personalized requirements for user profile "${profile.name}".`,
      completedAt: new Date().toISOString(),
    });

    // STEP 4: Transformation Execution
    updateStep(3, { status: 'running', progressPercent: 60, startedAt: new Date().toISOString() });
    const t3 = Date.now();
    const transformedOutput = await transformationAgent.transform(
      structuredContent,
      transformationsToRun,
      profile
    );
    updateStep(3, {
      status: 'completed',
      progressPercent: 100,
      durationMs: Date.now() - t3,
      findings: `Generated accessible text, simplified cognitive version, Telugu/regional translations, and ${transformedOutput.imageDescriptions.length} image narratives.`,
      completedAt: new Date().toISOString(),
    });

    // STEP 5: Accessibility Verification
    updateStep(4, { status: 'running', progressPercent: 70, startedAt: new Date().toISOString() });
    const t4 = Date.now();
    const verification = verificationAgent.verify(
      structuredContent.id,
      initialIssues,
      transformationsToRun,
      transformedOutput
    );
    updateStep(4, {
      status: 'completed',
      progressPercent: 100,
      durationMs: Date.now() - t4,
      findings: `Verified score improved from ${verification.beforeScore.overallScore}/100 to ${verification.afterScore.overallScore}/100 (+${verification.scoreImprovement} points). Resolved ${verification.issuesResolved} of ${verification.totalIssuesDetected} issues.`,
      completedAt: new Date().toISOString(),
    });

    // STEP 6: Explanation
    updateStep(5, { status: 'running', progressPercent: 85, startedAt: new Date().toISOString() });
    const t5 = Date.now();
    const explanation = explanationAgent.explain({
      initialIssues,
      transformations: transformationsToRun,
      verification,
      profile,
    });
    updateStep(5, {
      status: 'completed',
      progressPercent: 100,
      durationMs: Date.now() - t5,
      findings: explanation.summary,
      completedAt: new Date().toISOString(),
    });

    return {
      documentId: structuredContent.id,
      agentSteps: steps,
      structuredContent,
      initialIssues,
      initialScore,
      personalizedRequirements: userNeeds.requirements,
      transformations: transformationsToRun,
      transformedOutput,
      verification,
      explanation,
      isLiveAi: aiConfig.isLive,
      engineName: aiConfig.engineName,
    };
  }
}

export const inclusaOrchestrator = new InclusaOrchestrator();
