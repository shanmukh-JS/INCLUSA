import { aiService } from '../lib/ai/ai-service';
import { contentUnderstandingAgent } from '../lib/agents/content-understanding';
import { accessibilityAuditAgent } from '../lib/agents/accessibility-audit';
import { userNeedsAgent } from '../lib/agents/user-needs';
import { transformationAgent } from '../lib/agents/transformation-engine';
import { verificationAgent } from '../lib/agents/verification-engine';
import type { AccessibilityProfile } from '../types';

async function runAcceptanceTests() {
  console.log('====================================================');
  console.log('   INCLUSA MULTIMODAL PIPELINE ACCEPTANCE TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // 1x1 solid green PNG base64 for test
  const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  // TEST 1: Agent 1 Multimodal Vision Extraction Schema
  console.log('--- TEST 1: Agent 1 Structured Vision Understanding ---');
  try {
    const input = {
      inputType: 'image' as const,
      fileName: 'earth_2050_split_futures.png',
      fileDataUrl: `data:image/png;base64,${samplePngBase64}`,
    };

    const structured = await contentUnderstandingAgent.analyze(input);

    console.log(`Title: "${structured.title}"`);
    console.log(`Detected Language: ${structured.detectedLanguage}`);
    console.log(`Blocks Count: ${structured.blocks.length}`);
    console.log(`Images Count: ${structured.images.length}`);
    console.log(`Has Structured Image Analysis: ${Boolean(structured.imageAnalysis)}`);

    if (structured.rawText.includes('This is an uploaded visual image named') || structured.rawText.includes('Visual graphic / logo asset.')) {
      throw new Error('Agent 1 produced generic filename fallback boilerplate instead of structured analysis.');
    }

    if (structured.blocks.length < 2) {
      throw new Error('Agent 1 failed to populate structured content blocks.');
    }

    console.log('✅ TEST 1 PASSED: Agent 1 returns clean structured content without filename hallucination.\n');
    passed++;
  } catch (err: any) {
    console.error('❌ TEST 1 FAILED:', err.message);
    failed++;
  }

  // TEST 2: Agent 2 WCAG Image Auditing (Zero false table/audio flags)
  console.log('--- TEST 2: Agent 2 Accessibility Audit for Images ---');
  try {
    const mockImageContent = {
      id: 'doc_img_test',
      inputType: 'image' as const,
      title: 'EARTH 2050 — TWO POSSIBLE FUTURES',
      originalFileName: 'earth_2050.png',
      rawText: `# EARTH 2050 — TWO POSSIBLE FUTURES
## What This Content Is About
Split comparison depicting sustainable renewable future on left vs climate emergency on right.

## Visible Text
* "EARTH 2050 — TWO POSSIBLE FUTURES"
* "CLIMATE EMERGENCY — ACT NOW"

## What You Need to Know
* Contrasts green clean energy with catastrophic pollution.`,
      blocks: [
        { id: 'b1', type: 'heading' as const, level: 1 as const, text: 'EARTH 2050 — TWO POSSIBLE FUTURES', pageNumber: 1, readingOrder: 1 },
        { id: 'b2', type: 'paragraph' as const, text: 'Split comparison depicting sustainable future vs crisis.', pageNumber: 1, readingOrder: 2 },
      ],
      images: [
        { id: 'img_1', pageNumber: 1, isChartOrGraph: false, hasExistingAlt: false },
      ],
      tables: [],
      pageCount: 1,
      hasScannedPages: false,
      detectedLanguage: 'en',
    };

    const issues = accessibilityAuditAgent.audit(mockImageContent);
    console.log(`Detected Issues Count: ${issues.length}`);
    console.log(`Detected Rule IDs: ${issues.map((i) => i.ruleId).join(', ')}`);

    const hasTableIssue = issues.some((i) => i.category === 'structure' && i.ruleId === 'STR-003');
    const hasAudioIssue = issues.some((i) => i.category === 'hearing');

    if (hasTableIssue) {
      throw new Error('Agent 2 falsely flagged Table Structure barrier (STR-003) on pure image upload.');
    }
    if (hasAudioIssue) {
      throw new Error('Agent 2 falsely flagged Audio/Video Captions barrier on pure image upload.');
    }

    const hasVisionAlt = issues.some((i) => i.ruleId === 'VIS-001');
    if (!hasVisionAlt) {
      throw new Error('Agent 2 failed to flag missing image alt text (VIS-001).');
    }

    console.log('✅ TEST 2 PASSED: Agent 2 detects real image barriers without false table/audio issues.\n');
    passed++;
  } catch (err: any) {
    console.error('❌ TEST 2 FAILED:', err.message);
    failed++;
  }

  // TEST 3: Agent 4 Logo Transformation (Zero hallucinated procedures)
  console.log('--- TEST 3: Agent 4 Grounded Plain Language & Visual Alt ---');
  try {
    const turfBookingContent = {
      id: 'doc_turf_logo',
      inputType: 'image' as const,
      title: 'Turf Booking Brand Logo',
      originalFileName: 'turf_booking_logo.png',
      rawText: `# Turf Booking Brand Logo
## What This Content Is About
Brand identity logo mark for "Turf Booking", showing a green geometric sports pitch icon with modern bold typography.

## Visible Text
* "TURF BOOKING"

## Visual Elements
* Green rectangular boundary representing a sports ground.
* Clean minimalist vector typography.

## What You Need to Know
* This is a brand identity asset for the sports turf reservation platform.

## Action Steps
There are no explicit action steps in this content.`,
      blocks: [
        { id: 'b1', type: 'heading' as const, level: 1 as const, text: 'Turf Booking Brand Logo', pageNumber: 1, readingOrder: 1 },
      ],
      images: [
        {
          id: 'img_turf',
          pageNumber: 1,
          isChartOrGraph: false,
          hasExistingAlt: false,
          altText: 'Logo mark for Turf Booking featuring a green geometric pitch icon and bold uppercase text.',
          detailedDescription: 'Vector brand logo with green pitch icon and bold sans-serif text.',
          simpleDescription: 'Turf Booking brand logo.',
        },
      ],
      tables: [],
      pageCount: 1,
      hasScannedPages: false,
      detectedLanguage: 'en',
      imageAnalysis: {
        contentType: 'image' as const,
        title: 'Turf Booking Brand Logo',
        visibleText: ['TURF BOOKING'],
        visualElements: ['Green rectangular turf icon', 'Clean vector typography'],
        layout: 'Horizontal brand lockup with icon on left and text on right',
        relationships: [],
        visualMeaning: 'Brand identity mark for a sports turf booking service.',
        keyFacts: ['Represents the Turf Booking online reservation platform.'],
        explicitActions: ['There are no explicit action steps in this content.'],
        uncertainties: [],
        colors: ['Green', 'Black', 'White'],
        altText: 'Logo mark for Turf Booking featuring a green geometric pitch icon and bold uppercase text.',
        detailedDescription: 'Vector brand logo with green pitch icon and bold sans-serif text.',
      },
    };

    const mockProfile: AccessibilityProfile = {
      id: 'prof_test',
      name: 'Screen Reader User',
      isDefault: true,
      vision: { blind: true, lowVision: false, colorVisionDeficiency: 'none', highContrast: false, screenReaderUser: true, largeText: false },
      hearing: { deaf: false, hardOfHearing: false, preferCaptions: false, preferTranscripts: false, preferVisualCues: false },
      cognitive: { readingDifficulty: false, dyslexiaFriendly: false, simplifiedLanguage: true, shortSummaries: true, stepByStepExplanations: true, reduceClutter: false },
      language: { primaryLanguage: 'en', autoTranslate: false, preserveTechnicalTerms: true },
      output: { audioDescriptions: false, textSummaries: true, accessiblePdf: true, screenReaderOptimized: true, dyslexiaFormatted: false, includeCaptions: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const transformations = [
      { id: 't1', type: 'image_descriptions' as const, title: 'Image Descriptions', description: 'Alt text', selected: true },
      { id: 't2', type: 'simplify_language' as const, title: 'Plain Language', description: 'Plain text', selected: true },
    ];

    const output = await transformationAgent.transform(turfBookingContent, transformations, mockProfile);

    console.log(`Alt Text: "${output.imageDescriptions[0]?.altText}"`);
    console.log(`Summary: "${output.summary}"`);
    console.log(`Action Steps:`, output.stepByStepGuide);

    const fullOutputStr = JSON.stringify(output);
    const forbiddenPhrases = [
      '3 major operational phases',
      'Initial Assessment',
      'Submission & Execution',
      'income ceiling',
      'eligibility criteria',
      'prepare all necessary paperwork',
    ];

    for (const phrase of forbiddenPhrases) {
      if (fullOutputStr.toLowerCase().includes(phrase.toLowerCase())) {
        throw new Error(`Agent 4 hallucinated administrative procedure: "${phrase}"`);
      }
    }

    if (output.stepByStepGuide && output.stepByStepGuide.length > 0) {
      const firstStep = output.stepByStepGuide[0].toLowerCase();
      if (!firstStep.includes('no explicit action') && !firstStep.includes('no action')) {
        throw new Error(`Logo should state no explicit action steps, got: "${output.stepByStepGuide[0]}"`);
      }
    }

    console.log('✅ TEST 3 PASSED: Agent 4 transforms real logo semantics with zero hallucinated procedures.\n');
    passed++;
  } catch (err: any) {
    console.error('❌ TEST 3 FAILED:', err.message);
    failed++;
  }

  // TEST 4: Agent 5 Verification & Score Delta
  console.log('--- TEST 4: Agent 5 Verification & Compliance Delta ---');
  try {
    const initialIssues = [
      {
        id: 'iss_1',
        ruleId: 'VIS-001',
        category: 'vision' as const,
        title: 'Missing Image Alt Text',
        severity: 'critical' as const,
        whyItMatters: '',
        whoIsAffected: '',
        recommendation: '',
        confidenceScore: 99,
        isFixableWithAi: true,
      },
      {
        id: 'iss_2',
        ruleId: 'COG-001',
        category: 'cognitive' as const,
        title: 'Complex Text',
        severity: 'high' as const,
        whyItMatters: '',
        whoIsAffected: '',
        recommendation: '',
        confidenceScore: 95,
        isFixableWithAi: true,
      },
      {
        id: 'iss_3',
        ruleId: 'SCR-001',
        category: 'screen_reader' as const,
        title: 'Missing Landmarks',
        severity: 'high' as const,
        whyItMatters: '',
        whoIsAffected: '',
        recommendation: '',
        confidenceScore: 96,
        isFixableWithAi: true,
      },
    ];

    const appliedTransformations = [
      { id: 't1', type: 'image_descriptions' as const, title: 'Image Descriptions', description: '', selected: true },
      { id: 't2', type: 'simplify_language' as const, title: 'Simplify', description: '', selected: true },
      { id: 't3', type: 'screen_reader_structure' as const, title: 'Structure', description: '', selected: true },
    ];

    const mockOutput = {
      id: 'out_1',
      documentId: 'doc_1',
      accessibleText: 'Clean text',
      simplifiedVersion: 'Clear plain summary.',
      stepByStepGuide: ['There are no explicit action steps in this content.'],
      summary: 'Accurate summary',
      translations: {},
      imageDescriptions: [
        { id: 'img_1', altText: 'Accurate descriptive alt text', detailed: 'Accurate detailed breakdown with full visual structure.', simple: 'Simple meaning', screenReader: 'Figure: description' },
      ],
      screenReaderHtml: '<main role="main"><header><h1>Title</h1></header><article><p>Content</p></article></main>',
      tableRepresentations: [],
      audioTranscript: '',
      remediatedAt: new Date().toISOString(),
    };

    const verification = verificationAgent.verify('doc_1', initialIssues, appliedTransformations, mockOutput);

    console.log(`Before Score: ${verification.beforeScore.overallScore}/100`);
    console.log(`After Score: ${verification.afterScore.overallScore}/100`);
    console.log(`Score Improvement: +${verification.scoreImprovement} points`);
    console.log(`Resolved Issues: ${verification.issuesResolved} / ${verification.totalIssuesDetected}`);

    if (verification.afterScore.overallScore <= verification.beforeScore.overallScore) {
      throw new Error('Verification afterScore did not improve over beforeScore.');
    }
    if (verification.issuesResolved !== 3) {
      throw new Error(`Expected 3 resolved issues, got ${verification.issuesResolved}`);
    }

    console.log('✅ TEST 4 PASSED: Agent 5 correctly verifies resolved issues and calculates true delta.\n');
    passed++;
  } catch (err: any) {
    console.error('❌ TEST 4 FAILED:', err.message);
    failed++;
  }

  // TEST 5: Telugu Translation Verification
  console.log('--- TEST 5: Telugu Translation Quality & Grounding ---');
  try {
    const sampleEnglish = `# EARTH 2050 — TWO POSSIBLE FUTURES
This document compares two possible climate futures for Earth in 2050. One side shows clean renewable solar energy. The other side shows climate crisis and pollution.`;

    const translationResult = await aiService.translateContent(sampleEnglish, 'te');

    console.log(`Telugu Title: "${translationResult.title}"`);
    console.log(`Telugu Snippet: "${translationResult.content.slice(0, 140)}..."`);

    if (!translationResult.content || translationResult.content.length < 20) {
      throw new Error('Telugu translation returned empty string.');
    }

    if (translationResult.content.includes('This is an uploaded visual image named')) {
      throw new Error('Telugu translation translated filename fallback string instead of real content.');
    }

    console.log('✅ TEST 5 PASSED: Telugu translation operates on verified semantic content.\n');
    passed++;
  } catch (err: any) {
    console.error('❌ TEST 5 FAILED:', err.message);
    failed++;
  }

  console.log('====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTests();
