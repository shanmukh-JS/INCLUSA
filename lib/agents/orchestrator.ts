/**
 * INCLUSA 6-Agent Autonomous Orchestrator
 * Coordinates:
 *   1. Content Understanding Agent (Multimodal Vision & Ingestion)
 *   2. Accessibility Audit Agent (24 WCAG 2.1 Rules Scanner)
 *   3. User Needs Agent (Profile Mapping & Priority Planning)
 *   4. Transformation Engine (Multi-Tier Remediations & Generation)
 *   5. Verification Engine (Independent Re-Audit & Grounding Delta)
 *   6. Explanation Agent (Transparent User-Facing Explanations)
 */

import type {
  AccessibilityProfile,
  AgentPipelineResult,
  AgentStep,
  TransformationItem,
} from '@/types';
import { contentUnderstandingAgent, type ContentUnderstandingInput } from './content-understanding';
import { accessibilityAuditAgent } from './accessibility-audit';
import { userNeedsAgent } from './user-needs';
import { transformationAgent } from './transformation-engine';
import { verificationAgent } from './verification-engine';
import { explanationAgent } from './explanation-agent';
import { calculateInitialScore } from '../scoring/accessibility-scorer';
import { aiService } from '../ai/ai-service';

export class InclusaOrchestrator {
  public async runPipeline(
    input: ContentUnderstandingInput,
    profile: AccessibilityProfile,
    onProgress?: (currentStep: AgentStep, allSteps: AgentStep[]) => void,
    customTransformations?: TransformationItem[]
  ): Promise<AgentPipelineResult> {
    const aiConfig = aiService.getConfig();

    const steps: AgentStep[] = [
      {
        agentType: 'content_understanding',
        name: 'Agent 1 — Content Understanding',
        status: 'pending',
        currentTask: 'Ingesting multimodal content and executing visual/structural analysis',
        progressPercent: 0,
      },
      {
        agentType: 'accessibility_audit',
        name: 'Agent 2 — Accessibility Audit',
        status: 'pending',
        currentTask: 'Auditing WCAG 2.1 compliance across Vision, Cognitive, Hearing, Language, and Structure',
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
        currentTask: 'Re-auditing transformed output, verifying grounding and calculating score delta',
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

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const updateStep = (index: number, updates: Partial<AgentStep>) => {
      steps[index] = { ...steps[index], ...updates };
      if (onProgress) {
        onProgress(steps[index], [...steps]);
      }
    };

    if (onProgress) {
      onProgress(steps[0], [...steps]);
    }

    // STEP 1: Content Understanding
    try {
      updateStep(0, { status: 'running', progressPercent: 20, startedAt: new Date().toISOString() });
      await delay(200);
      const t0 = Date.now();
      updateStep(0, { progressPercent: 65 });
      const structuredContent = await contentUnderstandingAgent.analyze(input);
      
      const firstParagraph = structuredContent.imageAnalysis?.visualMeaning ||
        structuredContent.blocks.find((b) => b.type === 'paragraph' && b.text)?.text || '';
      const snippet = firstParagraph.length > 100 ? firstParagraph.substring(0, 97) + '...' : firstParagraph;

      updateStep(0, {
        status: 'completed',
        progressPercent: 100,
        durationMs: Date.now() - t0,
        findings: `Read "${structuredContent.title}" (${structuredContent.detectedLanguage.toUpperCase()}). Extracted ${structuredContent.blocks.length} blocks, ${structuredContent.images.length} visual figures.${snippet ? ` Overview: "${snippet}"` : ''}`,
        completedAt: new Date().toISOString(),
      });

      // STEP 2: Accessibility Audit
      updateStep(1, { status: 'running', progressPercent: 25, startedAt: new Date().toISOString() });
      await delay(200);
      const t1 = Date.now();
      updateStep(1, { progressPercent: 70 });
      const initialIssues = accessibilityAuditAgent.audit(structuredContent);
      const initialScore = calculateInitialScore(initialIssues);

      const criticalCount = initialIssues.filter((i) => i.severity === 'critical').length;
      const highCount = initialIssues.filter((i) => i.severity === 'high').length;

      updateStep(1, {
        status: 'completed',
        progressPercent: 100,
        durationMs: Date.now() - t1,
        findings: `Audited WCAG rules: Identified ${initialIssues.length} barriers (${criticalCount} Critical, ${highCount} High). Baseline Score: ${initialScore.overallScore}/100 (${initialScore.status}).`,
        completedAt: new Date().toISOString(),
      });

      // STEP 3: User Needs Personalization
      updateStep(2, { status: 'running', progressPercent: 30, startedAt: new Date().toISOString() });
      await delay(200);
      const t2 = Date.now();
      const userNeeds = userNeedsAgent.evaluate(profile, initialIssues);
      const transformationsToRun = customTransformations || userNeeds.recommendedTransformations;
      updateStep(2, {
        status: 'completed',
        progressPercent: 100,
        durationMs: Date.now() - t2,
        findings: `Mapped ${userNeeds.requirements.length} personalized remediation requirements tailored for "${profile?.name || 'Active Profile'}" (${(profile?.language?.primaryLanguage || 'te').toUpperCase()}).`,
        completedAt: new Date().toISOString(),
      });

      // STEP 4: Transformation Execution
      updateStep(3, { status: 'running', progressPercent: 35, startedAt: new Date().toISOString() });
      await delay(200);
      const t3 = Date.now();
      updateStep(3, { progressPercent: 80 });
      const transformedOutput = await transformationAgent.transform(
        structuredContent,
        transformationsToRun,
        profile
      );
      updateStep(3, {
        status: 'completed',
        progressPercent: 100,
        durationMs: Date.now() - t3,
        findings: `Synthesized plain language summary, ${Object.keys(transformedOutput.translations).join(', ').toUpperCase()} regional translations, ${transformedOutput.imageDescriptions.length} visual descriptions, and screen-reader HTML.`,
        completedAt: new Date().toISOString(),
      });

      // STEP 5: Accessibility Verification
      updateStep(4, { status: 'running', progressPercent: 30, startedAt: new Date().toISOString() });
      await delay(200);
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
        findings: `Re-audited remediated content: verified score improved from ${verification.beforeScore.overallScore}/100 to ${verification.afterScore.overallScore}/100 (+${verification.scoreImprovement} points gain). Resolved ${verification.issuesResolved} of ${verification.totalIssuesDetected} barriers.`,
        completedAt: new Date().toISOString(),
      });

      // STEP 6: Explanation
      updateStep(5, { status: 'running', progressPercent: 40, startedAt: new Date().toISOString() });
      await delay(200);
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
    } catch (err: any) {
      const runningIdx = steps.findIndex((s) => s.status === 'running');
      if (runningIdx >= 0) {
        updateStep(runningIdx, {
          status: 'failed',
          findings: `Agent failure: ${err.message || 'Execution error encountered'}`,
          completedAt: new Date().toISOString(),
        });
        for (let j = runningIdx + 1; j < steps.length; j++) {
          updateStep(j, {
            status: 'failed',
            findings: `Pipeline halted due to upstream failure in ${steps[runningIdx].name}`,
          });
        }
      }
      throw err;
    }
  }
}

export const inclusaOrchestrator = new InclusaOrchestrator();
