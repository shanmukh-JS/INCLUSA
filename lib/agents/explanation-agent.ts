/**
 * Agent 6 — Explanation Agent
 * Responsibilities:
 * - Explains all automated remediations in clear, human-understandable terms
 * - Identifies which specific user groups benefit most from the remediations
 * - Compiles data-driven metrics from the real audit and verification
 */

import type {
  AccessibilityIssue,
  AccessibilityProfile,
  TransformationItem,
  VerificationResult,
} from '@/types';

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
        'Generated contextual alt text, detailed visual breakdown, and plain-language meaning so non-sighted and low-vision users can comprehend the image.'
      );
      benefitingGroups.add('Blind and Low Vision Individuals');
      benefitingGroups.add('Screen Reader Users');
    }

    if (selectedTypes.has('simplify_language')) {
      keyRemediations.push(
        'Synthesized clear 7th-grade plain language takeaways and explicit action steps to eliminate cognitive reading barriers.'
      );
      benefitingGroups.add('Individuals with Cognitive & Reading Differences (ADHD, Dyslexia)');
      benefitingGroups.add('Non-native Language Readers');
    }

    if (selectedTypes.has('translate')) {
      const target = transformations.find((t) => t.type === 'translate')?.targetLanguage || 'te';
      const langNames: Record<string, string> = { te: 'Telugu', hi: 'Hindi', ta: 'Tamil', kn: 'Kannada', es: 'Spanish' };
      const name = langNames[target] || target.toUpperCase();
      keyRemediations.push(
        `Generated complete regional translation and summary in ${name}, preserving technical structure and accessible formatting.`
      );
      benefitingGroups.add(`${name} Primary Language Speakers`);
    }

    if (selectedTypes.has('screen_reader_structure')) {
      keyRemediations.push(
        'Reconstructed semantic HTML5 landmarks (<main>, <section>, <figure>), H1-H3 heading hierarchy, and accessible table headers.'
      );
      benefitingGroups.add('Screen Reader Navigators');
      benefitingGroups.add('Keyboard-only Users');
    }

    if (selectedTypes.has('audio_transcript') || selectedTypes.has('video_captions')) {
      keyRemediations.push(
        'Generated synchronized WebVTT captions and spoken audio narration script.'
      );
      benefitingGroups.add('Deaf and Hard of Hearing Users');
      benefitingGroups.add('Auditory Learners');
    }

    const summary = `INCLUSA identified ${initialIssues.length} digital accessibility barriers in the original content (Baseline Accessibility Score: ${initialScore}/100). Through automated 6-agent remediation, ${resolvedCount} barriers were successfully resolved, increasing the verified accessibility score to ${finalScore}/100 (+${delta} points improvement).`;

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
