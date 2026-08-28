import { AccessibilityIssue, AccessibilityProfile, TransformationItem } from '@/types';

/**
 * Agent 3 — User Needs Agent
 * Responsibilities:
 * - Ingests the active AccessibilityProfile
 * - Combines detected barriers with explicit user disabilities & preferences
 * - Generates prioritized transformation recommendations
 */
export class UserNeedsAgent {
  public evaluate(profile: AccessibilityProfile, detectedIssues: AccessibilityIssue[]): {
    requirements: string[];
    recommendedTransformations: TransformationItem[];
  } {
    const requirements: string[] = [];
    const transformations: TransformationItem[] = [];

    // 1. VISION NEEDS
    if (profile.vision.blind || profile.vision.screenReaderUser) {
      requirements.push('Mandate detailed screen-reader descriptions for all charts and images.');
      requirements.push('Generate semantic HTML structure with ARIA landmarks.');
      transformations.push({
        id: 'tx_img',
        type: 'image_descriptions',
        title: 'Generate Image & Chart Descriptions',
        description: 'Generate multi-level alt text, detailed chart data narratives, and screen-reader descriptions.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
      transformations.push({
        id: 'tx_sr',
        type: 'screen_reader_structure',
        title: 'Create Screen-Reader-Friendly Structure',
        description: 'Generate semantic HTML5 landmarks, table headers, and accessible navigation hooks.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
    } else if (profile.vision.lowVision || profile.vision.largeText) {
      requirements.push('Provide high-contrast reflowable text with scalable typography.');
    }

    // 2. COGNITIVE & READING NEEDS
    if (profile.cognitive.simplifiedLanguage || profile.cognitive.readingDifficulty) {
      requirements.push('Simplify dense prose into clear 7th-grade language with bulleted takeaways.');
      transformations.push({
        id: 'tx_simp',
        type: 'simplify_language',
        title: 'Simplify Language & Reduce Complexity',
        description: 'Break long paragraphs, explain jargon, and generate step-by-step cognitive takeaways.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
      transformations.push({
        id: 'tx_sum',
        type: 'generate_summary',
        title: 'Generate Executive Summary & Key Points',
        description: 'Create an upfront plain-language summary for rapid orientation.',
        selected: true,
        isRecommended: true,
        priority: 'medium',
      });
    }

    if (profile.cognitive.dyslexiaFriendly) {
      requirements.push('Format content with dyslexia-optimized spacing, font sizing, and visual chunking.');
    }

    // 3. HEARING NEEDS
    if (profile.hearing.deaf || profile.hearing.hardOfHearing || profile.hearing.preferTranscripts || profile.hearing.preferCaptions) {
      requirements.push('Generate synchronized captions and full speaker-labelled transcripts for media.');
      transformations.push({
        id: 'tx_trans',
        type: 'audio_transcript',
        title: 'Generate Full Audio Transcript',
        description: 'Transcribe speech with speaker labels and timestamp navigation.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
      transformations.push({
        id: 'tx_cap',
        type: 'video_captions',
        title: 'Generate Synchronized WebVTT Captions',
        description: 'Create timed subtitle files for video playback.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
    }

    // 4. LANGUAGE NEEDS
    const primaryLang = profile.language.primaryLanguage || 'en';
    if (primaryLang !== 'en') {
      const langNames: Record<string, string> = {
        te: 'Telugu',
        hi: 'Hindi',
        ta: 'Tamil',
        kn: 'Kannada',
        ml: 'Malayalam',
        bn: 'Bengali',
        mr: 'Marathi',
        es: 'Spanish',
      };
      const langName = langNames[primaryLang] || primaryLang.toUpperCase();
      requirements.push(`Generate high-fidelity regional language translation in ${langName}.`);
      transformations.push({
        id: 'tx_lang',
        type: 'translate',
        title: `Translate to ${langName} (${primaryLang.toUpperCase()})`,
        description: `Produce full translation into ${langName} while preserving headings and technical context.`,
        targetLanguage: primaryLang,
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
    }

    // Also check detected issues to recommend additional fixes
    const hasImageIssues = detectedIssues.some((i) => i.category === 'vision' && i.severity === 'critical');
    if (hasImageIssues && !transformations.some((t) => t.type === 'image_descriptions')) {
      transformations.push({
        id: 'tx_img_auto',
        type: 'image_descriptions',
        title: 'Generate Image & Chart Descriptions',
        description: 'Auto-fix detected missing alt text and chart descriptions.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
    }

    const hasStructureIssues = detectedIssues.some((i) => i.category === 'structure');
    if (hasStructureIssues && !transformations.some((t) => t.type === 'screen_reader_structure')) {
      transformations.push({
        id: 'tx_sr_auto',
        type: 'screen_reader_structure',
        title: 'Remediate Structural Hierarchy & Tables',
        description: 'Reconstruct H1/H2/H3 headings and accessible table header scopes.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
    }

    return {
      requirements,
      recommendedTransformations: transformations,
    };
  }
}

export const userNeedsAgent = new UserNeedsAgent();
