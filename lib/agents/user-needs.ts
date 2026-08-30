/**
 * Agent 3 — User Needs Engine
 * Responsibilities:
 * - Maps explicit user accessibility preferences and detected barriers to prioritized remediation actions
 * - Ensures regional language preferences (Telugu / Hindi) trigger neural translation
 * - Ensures vision and cognitive needs trigger multi-tier image descriptions and simplified language
 * - Strictly personalizes without inferring medical diagnoses or fabricating facts
 */

import type { AccessibilityIssue, AccessibilityProfile, TransformationItem } from '@/types';

export class UserNeedsAgent {
  public evaluate(
    param1: AccessibilityProfile | any,
    param2?: AccessibilityIssue[] | any,
    param3?: AccessibilityProfile
  ): {
    requirements: string[];
    transformations: TransformationItem[];
    recommendedTransformations: TransformationItem[];
  } {
    let profile: AccessibilityProfile;
    let detectedIssues: AccessibilityIssue[] = [];

    if (param3 && typeof param3 === 'object' && ('vision' in param3 || 'hearing' in param3)) {
      profile = param3;
      detectedIssues = Array.isArray(param2) ? param2 : [];
    } else if (param1 && typeof param1 === 'object' && ('vision' in param1 || 'hearing' in param1)) {
      profile = param1;
      detectedIssues = Array.isArray(param2) ? param2 : [];
    } else {
      profile = {
        id: 'default_profile',
        name: 'Default Accessibility Profile',
        isDefault: true,
        vision: { blind: false, lowVision: true, colorVisionDeficiency: 'none', highContrast: false, screenReaderUser: true, largeText: true },
        hearing: { deaf: false, hardOfHearing: false, preferCaptions: true, preferTranscripts: true, preferVisualCues: true },
        cognitive: { readingDifficulty: true, dyslexiaFriendly: false, simplifiedLanguage: true, shortSummaries: true, stepByStepExplanations: true, reduceClutter: true },
        language: { primaryLanguage: 'te', secondaryLanguage: 'hi', autoTranslate: true, preserveTechnicalTerms: true },
        output: { audioDescriptions: true, textSummaries: true, accessiblePdf: true, screenReaderOptimized: true, dyslexiaFormatted: false, includeCaptions: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      detectedIssues = Array.isArray(param2) ? param2 : [];
    }

    const requirements: string[] = [];
    const transformations: TransformationItem[] = [];

    // 1. VISION NEEDS
    if (profile.vision?.blind || profile.vision?.screenReaderUser || profile.output?.screenReaderOptimized) {
      requirements.push('Mandate multi-tier screen-reader descriptions (Alt Text + Detailed Visual Meaning) for all images and diagrams.');
      requirements.push('Generate semantic HTML5 structure with ARIA landmarks and figure tags.');
      transformations.push({
        id: 'tx_img',
        type: 'image_descriptions',
        title: 'Generate Image & Chart Descriptions',
        description: 'Generate concise alt text, detailed visual breakdown, and plain-language meaning.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
      transformations.push({
        id: 'tx_sr',
        type: 'screen_reader_structure',
        title: 'Create Screen-Reader-Friendly Structure',
        description: 'Generate semantic HTML5 landmarks, table headers, and accessible figure navigation.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
    } else if (profile.vision?.lowVision || profile.vision?.largeText) {
      requirements.push('Provide high-contrast reflowable text with scalable typography.');
    }

    // 2. COGNITIVE & READING NEEDS
    if (profile.cognitive?.simplifiedLanguage || profile.cognitive?.readingDifficulty || profile.cognitive?.shortSummaries) {
      requirements.push('Provide upfront plain-language summary, key takeaways, and explicit action steps.');
      transformations.push({
        id: 'tx_simp',
        type: 'simplify_language',
        title: 'Simplify Language & Explain Visual Meaning',
        description: 'Synthesize clear 7th-grade plain language takeaways and explicit action steps.',
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
    }

    // 3. MULTILINGUAL TRANSLATION NEEDS
    if (profile.language?.primaryLanguage && profile.language.primaryLanguage !== 'en') {
      const langNames: Record<string, string> = { te: 'Telugu', hi: 'Hindi', ta: 'Tamil', kn: 'Kannada', es: 'Spanish' };
      const langName = langNames[profile.language.primaryLanguage] || profile.language.primaryLanguage;
      requirements.push(`Generate high-fidelity regional language translation and summary in ${langName}.`);
      transformations.push({
        id: 'tx_trans',
        type: 'translate',
        title: `Translate to ${langName}`,
        description: `Translate accessible content and visual descriptions into ${langName}.`,
        targetLanguage: profile.language.primaryLanguage,
        selected: true,
        isRecommended: true,
        priority: 'high',
      });
    }

    // 4. AUDIO / SPOKEN ACCESSIBILITY NEEDS
    if (profile.hearing?.preferTranscripts || profile.output?.audioDescriptions || profile.vision?.screenReaderUser) {
      requirements.push('Generate spoken audio narration script and synchronized WebVTT captions.');
      transformations.push({
        id: 'tx_audio',
        type: 'audio_transcript',
        title: 'Generate Spoken Audio Narration',
        description: 'Generate structured audio narration script and timestamped captions.',
        selected: true,
        isRecommended: true,
        priority: 'medium',
      });
    }

    return {
      requirements,
      transformations,
      recommendedTransformations: transformations,
    };
  }
}

export const userNeedsAgent = new UserNeedsAgent();
