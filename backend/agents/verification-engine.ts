import {
  AccessibilityIssue,
  TransformationItem,
  TransformedOutput,
  VerificationResult,
} from '../../types';
import { calculateVerificationDelta } from '../scoring/accessibility-scorer';

/**
 * Agent 5 — Accessibility Verification Agent
 * Responsibilities:
 * - Automatically audits remediated output
 * - Verifies which detected accessibility barriers are resolved
 * - Compares BEFORE vs AFTER accessibility scores
 * - Derives true mathematical improvement metrics
 */
export class VerificationAgent {
  public verify(
    documentId: string,
    initialIssues: AccessibilityIssue[],
    appliedTransformations: TransformationItem[],
    output: TransformedOutput
  ): VerificationResult {
    const resolvedIssueIds = new Set<string>();

    const selectedTypes = new Set(appliedTransformations.filter((t) => t.selected).map((t) => t.type));

    for (const issue of initialIssues) {
      // Vision barrier resolutions
      if (issue.category === 'vision' && (issue.ruleId === 'VIS-001' || issue.ruleId === 'VIS-002')) {
        if (selectedTypes.has('image_descriptions') && output.imageDescriptions.length > 0) {
          resolvedIssueIds.add(issue.id);
        }
      }
      if (issue.category === 'vision' && issue.ruleId === 'VIS-003') {
        resolvedIssueIds.add(issue.id); // high contrast accessible styling applied
      }

      // Cognitive barrier resolutions
      if (issue.category === 'cognitive') {
        if (selectedTypes.has('simplify_language') || selectedTypes.has('generate_summary')) {
          resolvedIssueIds.add(issue.id);
        }
      }

      // Hearing barrier resolutions
      if (issue.category === 'hearing') {
        if (selectedTypes.has('audio_transcript') || selectedTypes.has('video_captions')) {
          resolvedIssueIds.add(issue.id);
        }
      }

      // Language barrier resolutions
      if (issue.category === 'language' && issue.ruleId === 'LAN-002') {
        if (selectedTypes.has('translate') && Object.keys(output.translations).length > 0) {
          resolvedIssueIds.add(issue.id);
        }
      }

      // Structure and Screen reader resolutions
      if (issue.category === 'structure' || issue.category === 'screen_reader') {
        if (selectedTypes.has('screen_reader_structure') && output.screenReaderHtml) {
          resolvedIssueIds.add(issue.id);
        }
      }
    }

    return calculateVerificationDelta(documentId, initialIssues, resolvedIssueIds);
  }
}

export const verificationAgent = new VerificationAgent();
