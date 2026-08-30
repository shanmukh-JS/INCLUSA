import { aiService } from '../lib/ai/ai-service.js';
import { contentUnderstandingAgent } from '../lib/agents/content-understanding.js';
import { accessibilityAuditAgent } from '../lib/agents/accessibility-audit.js';
import { userNeedsAgent } from '../lib/agents/user-needs.js';
import { transformationAgent } from '../lib/agents/transformation-engine.js';
import { verificationAgent } from '../lib/agents/verification-engine.js';
import { explanationAgent } from '../lib/agents/explanation-agent.js';
import { calculateInitialScore } from '../lib/scoring/accessibility-scorer.js';

// Minimal 1x1 PNG for testing multimodal fallback / API
const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function runAcceptanceTests() {
  console.log('====================================================');
  console.log('   INCLUSA MULTIMODAL PIPELINE ACCEPTANCE TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // ----------------------------------------------------
  // TEST A: Grounded Multimodal Vision Structured Output
  // ----------------------------------------------------
  console.log('--- TEST 1: Agent 1 Structured Vision Understanding ---');
  try {
    const structured = await contentUnderstandingAgent.analyze({
      inputType: 'image',
      title: 'Earth 2050 — Two Possible Futures',
      fileName: 'earth_2050_futures.png',
      fileDataUrl: `data:image/png;base64,${samplePngBase64}`,
    });

    console.log(`Title: "${structured.title}"`);
    console.log(`Detected Language: ${structured.detectedLanguage}`);
    console.log(`Blocks Count: ${structured.blocks.length}`);
    console.log(`Images Count: ${structured.images.length}`);
    console.log(`Has Structured Image Analysis: ${Boolean(structured.imageAnalysis)}`);

    // Grounding assertion: Must NOT contain "This is an uploaded visual image named..."
    if (structured.rawText.includes('This is an uploaded visual image named')) {
      throw new Error('FAILED: Found banned boilerplate string "This is an uploaded visual image named..."');
    }
    if (structured.rawText.includes('Visual graphic / logo asset.')) {
      throw new Error('FAILED: Found banned boilerplate string "Visual graphic / logo asset."');
    }
    console.log('✅ TEST 1 PASSED: Agent 1 returns clean structured content without filename hallucination.\n');
    passed++;
  } catch (err) {
    console.error('❌ TEST 1 FAILED:', err.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 2: Agent 2 Image-Specific Accessibility Audit
  // ----------------------------------------------------
  console.log('--- TEST 2: Agent 2 Accessibility Audit for Images ---');
  try {
    const dummyContent = {
      id: 'doc_test_img',
      inputType: 'image',
      title: 'Earth 2050 — Two Possible Futures',
      rawText: '# Earth 2050\n## What This Content Is About\nA split visual comparison showing two contrasting futures for Earth: a sustainable renewable city and a polluted industrial wasteland.',
      blocks: [],
      images: [
        {
          id: 'img_1',
          hasExistingAlt: false,
          altText: '',
          isChartOrGraph: false,
        }
      ],
      tables: [],
      pageCount: 1,
      detectedLanguage: 'en',
      hasScannedPages: false,
      metadata: { wordCount: 30, charCount: 180 },
    };

    const issues = accessibilityAuditAgent.audit(dummyContent);
    const issueRuleIds = issues.map((i) => i.ruleId);

    console.log(`Detected Issues Count: ${issues.length}`);
    console.log(`Detected Rule IDs: ${issueRuleIds.join(', ')}`);

    if (!issueRuleIds.includes('VIS-001')) {
      throw new Error('FAILED: VIS-001 (Missing Alt Text) was not detected for image without alt text.');
    }
    if (issueRuleIds.includes('STR-003')) {
      throw new Error('FAILED: STR-003 (Table Headers) was flagged on an image with no tables.');
    }
    if (issueRuleIds.includes('HEA-001')) {
      throw new Error('FAILED: HEA-001 (Video Captions) was flagged on an image.');
    }

    console.log('✅ TEST 2 PASSED: Agent 2 detects real image barriers without false table/audio issues.\n');
    passed++;
  } catch (err) {
    console.error('❌ TEST 2 FAILED:', err.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 3: Agent 4 Transformation Grounding & No Fake Procedures
  // ----------------------------------------------------
  console.log('--- TEST 3: Agent 4 Grounded Plain Language & Visual Alt ---');
  try {
    const mockContent = {
      id: 'doc_turf',
      inputType: 'image',
      title: 'Turf Booking Brand Logo',
      rawText: `# Turf Booking Brand Logo
## What This Content Is About
A graphic logo mark representing an online turf booking platform featuring a geometric sports field symbol and modern green typography.

## Visual Elements
* Green geometric football/cricket pitch icon.
* Bold uppercase brand typography: "TURF BOOKING".

## Action Steps
There are no explicit action steps in this content.`,
      blocks: [],
      images: [
        {
          id: 'img_logo',
          hasExistingAlt: false,
          isChartOrGraph: false,
          altText: '',
          detailedDescription: '',
        }
      ],
      tables: [],
      pageCount: 1,
      detectedLanguage: 'en',
      hasScannedPages: false,
      imageAnalysis: {
        contentType: 'logo',
        title: 'Turf Booking Brand Logo',
        visibleText: ['TURF BOOKING'],
        visualElements: ['Green pitch icon', 'Brand typography'],
        layout: 'Centered icon above uppercase text',
        relationships: ['Logo mark positioned directly above brand name'],
        visualMeaning: 'Brand identity mark for a sports turf booking service.',
        keyFacts: ['Features geometric green turf icon', 'Displays brand name in bold font'],
        explicitActions: ['There are no explicit action steps in this content.'],
        uncertainties: ['Specific booking rates are not shown in this logo'],
        altText: 'Logo mark for Turf Booking featuring a green geometric pitch icon and bold uppercase text.',
        detailedDescription: 'A minimalist sports logo with a centered green football/cricket turf icon positioned directly above the bold uppercase brand name TURF BOOKING.',
      },
      metadata: { wordCount: 40, charCount: 250 },
    };

    const userProfile = {
      id: 'prof_test',
      name: 'Telugu User',
      isDefault: true,
      vision: { blind: false, lowVision: true, colorVisionDeficiency: 'none', highContrast: false, screenReaderUser: true, largeText: true },
      hearing: { deaf: false, hardOfHearing: false, preferCaptions: true, preferTranscripts: true, preferVisualCues: true },
      cognitive: { readingDifficulty: true, dyslexiaFriendly: false, simplifiedLanguage: true, shortSummaries: true, stepByStepExplanations: true, reduceClutter: true },
      language: { primaryLanguage: 'te', secondaryLanguage: 'hi', autoTranslate: true, preserveTechnicalTerms: true },
      output: { audioDescriptions: true, textSummaries: true, accessiblePdf: true, screenReaderOptimized: true, dyslexiaFormatted: false, includeCaptions: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userNeeds = userNeedsAgent.evaluate(userProfile, []);
    const transformed = await transformationAgent.transform(mockContent, userNeeds.recommendedTransformations, userProfile);

    console.log(`Alt Text: "${transformed.imageDescriptions[0]?.altText}"`);
    console.log(`Summary: "${transformed.summary}"`);
    console.log(`Action Steps:`, transformed.stepByStepGuide);

    // Grounding assertions
    const forbidden = ['3 major operational phases', 'Initial Assessment', 'Submission & Execution', 'income ceiling', 'eligibility criteria'];
    for (const phrase of forbidden) {
      if (transformed.simplifiedVersion.toLowerCase().includes(phrase.toLowerCase())) {
        throw new Error(`FAILED: Transformed output contained hallucinated phrase "${phrase}"`);
      }
    }

    if (!transformed.stepByStepGuide?.some((s) => s.toLowerCase().includes('no explicit action'))) {
      throw new Error('FAILED: Action steps for logo image should state "There are no explicit action steps in this content."');
    }

    console.log('✅ TEST 3 PASSED: Agent 4 transforms real logo semantics with zero hallucinated procedures.\n');
    passed++;
  } catch (err) {
    console.error('❌ TEST 3 FAILED:', err.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 4: Agent 5 Grounding & Mathematical Delta Verification
  // ----------------------------------------------------
  console.log('--- TEST 4: Agent 5 Verification & Compliance Delta ---');
  try {
    const initialIssues = [
      {
        id: 'iss_1',
        ruleId: 'VIS-001',
        category: 'vision',
        title: 'Missing Alt Text',
        severity: 'critical',
        location: 'Image 1',
        description: 'Missing alt text',
        whyItMatters: 'Screen readers cannot read image',
        whoIsAffected: 'Blind users',
        recommendation: 'Add alt text',
        confidenceScore: 99,
        isFixableWithAi: true,
      },
      {
        id: 'iss_2',
        ruleId: 'VIS-002',
        category: 'vision',
        title: 'Missing Visual Description',
        severity: 'high',
        location: 'Image 1',
        description: 'Missing detailed description',
        whyItMatters: 'Low vision users need context',
        whoIsAffected: 'Low vision users',
        recommendation: 'Add description',
        confidenceScore: 98,
        isFixableWithAi: true,
      },
      {
        id: 'iss_3',
        ruleId: 'LAN-002',
        category: 'language',
        title: 'Monolingual Content',
        severity: 'medium',
        location: 'Document',
        description: 'English only',
        whyItMatters: 'Regional speakers need translation',
        whoIsAffected: 'Telugu speakers',
        recommendation: 'Translate to Telugu',
        confidenceScore: 95,
        isFixableWithAi: true,
      },
    ];

    const appliedTransformations = [
      { id: 't1', type: 'image_descriptions', title: 'Image Descriptions', description: '', selected: true, isRecommended: true, priority: 'high' },
      { id: 't2', type: 'translate', title: 'Translate to Telugu', targetLanguage: 'te', description: '', selected: true, isRecommended: true, priority: 'high' },
      { id: 't3', type: 'screen_reader_structure', title: 'Screen Reader HTML', description: '', selected: true, isRecommended: true, priority: 'high' },
    ];

    const mockOutput = {
      id: 'out_test',
      documentId: 'doc_test',
      accessibleText: '# Earth 2050\nSplit comparison of two futures.',
      simplifiedVersion: '## What This Is\nSplit comparison of two futures.',
      stepByStepGuide: ['There are no explicit action steps in this content.'],
      summary: 'Split comparison of two futures.',
      translations: {
        te: { title: 'తెలుగు అనువాదం', content: '## సరళమైన సారాంశం\nరెండు భవిష్యత్తుల పోలిక.', languageName: 'Telugu' },
      },
      imageDescriptions: [
        {
          id: 'img_1',
          altText: 'Split comparison of Earth in 2050.',
          detailed: 'Visual comparison between a green sustainable future and a polluted damaged future.',
          simple: 'Contrasting two possible futures for our planet.',
          screenReader: 'Figure: Split comparison of Earth in 2050.',
        },
      ],
      screenReaderHtml: '<main><header><h1>Earth 2050</h1></header><article><p>Content</p></article></main>',
      tableRepresentations: [],
      remediatedAt: new Date().toISOString(),
    };

    const verification = verificationAgent.verify('doc_test', initialIssues, appliedTransformations, mockOutput);

    console.log(`Before Score: ${verification.beforeScore.overallScore}/100`);
    console.log(`After Score: ${verification.afterScore.overallScore}/100`);
    console.log(`Score Improvement: +${verification.scoreImprovement} points`);
    console.log(`Resolved Issues: ${verification.issuesResolved} / ${verification.totalIssuesDetected}`);

    if (verification.issuesResolved !== 3) {
      throw new Error(`FAILED: Expected 3 resolved issues, got ${verification.issuesResolved}`);
    }
    if (verification.scoreImprovement <= 0) {
      throw new Error(`FAILED: Score improvement should be positive, got ${verification.scoreImprovement}`);
    }

    console.log('✅ TEST 4 PASSED: Agent 5 correctly verifies resolved issues and calculates true delta.\n');
    passed++;
  } catch (err) {
    console.error('❌ TEST 4 FAILED:', err.message, '\n');
    failed++;
  }

  // ----------------------------------------------------
  // TEST 5: Telugu Translation Grounding
  // ----------------------------------------------------
  console.log('--- TEST 5: Telugu Translation Quality & Grounding ---');
  try {
    const textToTranslate = `# Earth 2050: Two Possible Futures
## What This Content Is About
A visual comparison contrasting a sustainable green city with renewable solar energy against a polluted industrial climate emergency wasteland.`;

    const teluguResult = await aiService.translateContent(textToTranslate, 'te');
    console.log(`Telugu Title: "${teluguResult.title}"`);
    console.log(`Telugu Snippet: "${teluguResult.content.slice(0, 160)}..."`);

    if (!teluguResult.content || teluguResult.content.length < 20) {
      throw new Error('FAILED: Telugu translation is empty or too short.');
    }
    if (teluguResult.content.includes('This is an uploaded visual image named')) {
      throw new Error('FAILED: Telugu translation translated filename placeholder instead of real content.');
    }

    console.log('✅ TEST 5 PASSED: Telugu translation operates on verified semantic content.\n');
    passed++;
  } catch (err) {
    console.error('❌ TEST 5 FAILED:', err.message, '\n');
    failed++;
  }

  console.log('====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTests();
