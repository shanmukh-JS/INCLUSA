import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Load .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  });
}

import { aiService } from '../lib/ai/ai-service';
import { contentUnderstandingAgent } from '../lib/agents/content-understanding';
import { accessibilityAuditAgent } from '../lib/agents/accessibility-audit';
import { userNeedsAgent } from '../lib/agents/user-needs';
import { transformationAgent } from '../lib/agents/transformation-engine';
import { verificationAgent } from '../lib/agents/verification-engine';
import { explanationAgent } from '../lib/agents/explanation-agent';
import { inclusaOrchestrator } from '../lib/agents/orchestrator';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '../lib/storage/document-store';

// Helper to generate a valid RGB PNG base64 in pure Node.js
function generateTestPng(width = 64, height = 64, type: 'earth2050' | 'logo' | 'chart' = 'earth2050'): string {
  const rawData: number[] = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      if (type === 'earth2050') {
        // Left side: green / blue (sustainable), Right side: orange / dark grey (polluted)
        if (x < width / 2) {
          rawData.push(30, 180, 80); // Vibrant green
        } else {
          rawData.push(180, 70, 30); // Smoggy orange-brown
        }
      } else if (type === 'logo') {
        // Centered green square icon on clean white background
        const inCenter = x > width * 0.3 && x < width * 0.7 && y > height * 0.3 && y < height * 0.7;
        if (inCenter) {
          rawData.push(5, 150, 105); // Emerald turf green
        } else {
          rawData.push(245, 245, 250); // Clean light background
        }
      } else {
        // Blue data bar chart
        if (y > height * 0.5 && x > width * 0.2 && x < width * 0.8) {
          rawData.push(37, 99, 235); // Blue bar
        } else {
          rawData.push(255, 255, 255); // White background
        }
      }
    }
  }

  const idatData = zlib.deflateSync(Buffer.from(rawData));

  function crc(buf: Buffer) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = c ^ buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(typeStr: string, data: Buffer) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(typeStr, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]).toString('base64');
}

async function runAcceptanceSuite() {
  console.log('========================================================================');
  console.log('   INCLUSA RIGOROUS MULTIMODAL ACCEPTANCE TEST SUITE                    ');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  // -------------------------------------------------------------------------
  // TEST A: EARTH 2050 IMAGE MULTIMODAL UNDERSTANDING
  // -------------------------------------------------------------------------
  console.log('--- [TEST A] Earth 2050 Multimodal Image Pipeline ---');
  try {
    const earthPngBase64 = generateTestPng(64, 64, 'earth2050');
    const input = {
      inputType: 'image' as const,
      fileName: 'earth_2050_futures.png',
      fileDataUrl: `data:image/png;base64,${earthPngBase64}`,
      rawText: '', // Purposely empty to force real image vision extraction
    };

    console.log('   -> Invoking 6-Agent Pipeline with Real Image Data URL...');
    const result = await inclusaOrchestrator.runPipeline(input, DEFAULT_ACCESSIBILITY_PROFILE);

    const fullResultStr = JSON.stringify(result).toLowerCase();

    console.log(`   ✓ Structured Title: "${result.structuredContent.title}"`);
    console.log(`   ✓ What This Is: "${result.transformedOutput.whatThisIs?.slice(0, 120)}..."`);
    console.log(`   ✓ Visual Meaning: "${result.transformedOutput.visualMeaning?.slice(0, 120)}..."`);
    console.log(`   ✓ Alt Text: "${result.transformedOutput.imageDescriptions[0]?.altText}"`);
    console.log(`   ✓ Detailed Desc: "${result.transformedOutput.imageDescriptions[0]?.detailed?.slice(0, 120)}..."`);
    console.log(`   ✓ Action Steps:`, result.transformedOutput.stepByStepGuide);
    console.log(`   ✓ Initial Score: ${result.initialScore.overallScore}/100 -> After Score: ${result.verification?.afterScore.overallScore}/100 (+${result.verification?.scoreImprovement} pts)`);

    // Verification Assertions:
    if (fullResultStr.includes('this is an uploaded visual image named')) {
      throw new Error('FAILED: Found banned boilerplate string "This is an uploaded visual image named..."');
    }
    if (fullResultStr.includes('visual graphic / logo asset.')) {
      throw new Error('FAILED: Found banned boilerplate string "Visual graphic / logo asset."');
    }
    if (!result.transformedOutput.whatThisIs || result.transformedOutput.whatThisIs.length < 15) {
      throw new Error('FAILED: "What This Is" is empty or insufficient.');
    }
    if (!result.transformedOutput.imageDescriptions[0]?.altText) {
      throw new Error('FAILED: Alt text was not generated.');
    }
    if (!result.transformedOutput.translations['te']?.content) {
      throw new Error('FAILED: Telugu translation was not produced.');
    }

    console.log('   ✅ TEST A PASSED: Real visual understanding flows through all 6 agents!\n');
    passed++;
  } catch (err: any) {
    console.error('   ❌ TEST A FAILED:', err.message, '\n');
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST B: TURF BOOKING LOGO (NO HALLUCINATED PROCEDURES)
  // -------------------------------------------------------------------------
  console.log('--- [TEST B] Turf Booking Logo (Zero Hallucinated Procedures) ---');
  try {
    const logoPngBase64 = generateTestPng(64, 64, 'logo');
    const input = {
      inputType: 'image' as const,
      fileName: 'turf_booking_logo.png',
      fileDataUrl: `data:image/png;base64,${logoPngBase64}`,
      rawText: '',
    };

    const result = await inclusaOrchestrator.runPipeline(input, DEFAULT_ACCESSIBILITY_PROFILE);
    const out = result.transformedOutput;
    const fullOutStr = JSON.stringify(out).toLowerCase();

    console.log(`   ✓ Logo Title: "${result.structuredContent.title}"`);
    console.log(`   ✓ Action Steps:`, out.stepByStepGuide);

    // Assertions: Must NOT invent eligibility, deadlines, paperwork, or 3 operational phases
    const forbiddenPhrases = [
      '3 major operational phases',
      'initial assessment',
      'submission & execution',
      'verification & completion',
      'eligibility criteria and income ceiling',
      'prepare all necessary paperwork',
      'application fee',
      'deadline for submission',
    ];

    for (const phrase of forbiddenPhrases) {
      if (fullOutStr.includes(phrase.toLowerCase())) {
        throw new Error(`FAILED: Found hallucinated phrase "${phrase}" in logo output.`);
      }
    }

    const steps = out.stepByStepGuide || [];
    const hasNoExplicitAction = steps.some((s) => s.toLowerCase().includes('no explicit action') || s.toLowerCase().includes('none'));
    if (!hasNoExplicitAction && steps.length > 0 && steps[0].toLowerCase().includes('submit')) {
      throw new Error('FAILED: Non-procedural logo should not invent submission action steps.');
    }

    console.log('   ✅ TEST B PASSED: Logo analyzed with zero hallucinated procedures.\n');
    passed++;
  } catch (err: any) {
    console.error('   ❌ TEST B FAILED:', err.message, '\n');
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST C: UNRELATED IMAGE (NO CROSS-CONTAMINATION)
  // -------------------------------------------------------------------------
  console.log('--- [TEST C] Unrelated Image (No Concept Leakage) ---');
  try {
    const chartPngBase64 = generateTestPng(64, 64, 'chart');
    const input = {
      inputType: 'image' as const,
      fileName: 'blue_bar_chart_data.png',
      fileDataUrl: `data:image/png;base64,${chartPngBase64}`,
      rawText: '',
    };

    const result = await inclusaOrchestrator.runPipeline(input, DEFAULT_ACCESSIBILITY_PROFILE);
    const meaning = result.transformedOutput.visualMeaning || result.transformedOutput.whatThisIs || '';

    console.log(`   ✓ Visual Meaning: "${meaning.slice(0, 100)}..."`);

    // Must NOT contain Earth 2050 concepts
    if (meaning.toLowerCase().includes('earth 2050') || meaning.toLowerCase().includes('two possible futures')) {
      throw new Error('FAILED: Unrelated image output leaked Earth 2050 content!');
    }

    console.log('   ✅ TEST C PASSED: Unrelated image processed cleanly without concept contamination.\n');
    passed++;
  } catch (err: any) {
    console.error('   ❌ TEST C FAILED:', err.message, '\n');
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST D: DOCUMENT WITH TABLES, DATES, AND REQUIREMENTS
  // -------------------------------------------------------------------------
  console.log('--- [TEST D] Document Factual Grounding (Preserves Exact Data) ---');
  try {
    const docMarkdown = `# Clean Energy Rebate Program 2026
## Application Deadlines & Funding
The final application deadline is October 15, 2026. A total grant allocation of $2,500,000 is available for residential solar panel installations.

| Tier Level | Capacity Range | Maximum Rebate Amount |
| --- | --- | --- |
| Tier 1 | 3kW - 5kW | $1,500 |
| Tier 2 | 6kW - 10kW | $3,200 |
| Tier 3 | 11kW+ | $5,000 |

## Explicit Action Steps
1. Complete online energy audit by September 1, 2026.
2. Submit contractor quotation and proof of residency.`;

    const input = {
      inputType: 'pdf' as const,
      fileName: 'clean_energy_rebate.pdf',
      rawText: docMarkdown,
    };

    const result = await inclusaOrchestrator.runPipeline(input, DEFAULT_ACCESSIBILITY_PROFILE);
    const out = result.transformedOutput;

    console.log(`   ✓ Tables Linearized: ${out.tableRepresentations.length}`);
    console.log(`   ✓ Action Steps Count: ${(out.stepByStepGuide || []).length}`);

    if (out.tableRepresentations.length === 0) {
      throw new Error('FAILED: Data table was not linearized.');
    }
    if (!out.accessibleText.includes('$2,500,000') || !out.accessibleText.includes('October 15, 2026')) {
      throw new Error('FAILED: Key financial amounts or dates were lost from accessible text.');
    }

    console.log('   ✅ TEST D PASSED: Document tables, financial metrics, and dates preserved with precision.\n');
    passed++;
  } catch (err: any) {
    console.error('   ❌ TEST D FAILED:', err.message, '\n');
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST E: TELUGU ACCESSIBILITY TRANSLATION
  // -------------------------------------------------------------------------
  console.log('--- [TEST E] Telugu Accessibility Translation Grounding ---');
  try {
    const sampleText = `# Sustainable Solar Transition
## What This Content Is About
This visual guides the community on adopting solar photovoltaic panels and energy storage systems to achieve carbon neutrality.`;

    const teluguResult = await aiService.translateContent(sampleText, 'te');
    console.log(`   ✓ Telugu Title: "${teluguResult.title}"`);
    console.log(`   ✓ Telugu Content Sample: "${teluguResult.content.slice(0, 120)}..."`);

    if (!teluguResult.content || teluguResult.content.length < 20) {
      throw new Error('FAILED: Telugu translation is empty or too short.');
    }
    if (teluguResult.content.includes('This is an uploaded visual image named')) {
      throw new Error('FAILED: Telugu translation translated filename placeholder instead of content.');
    }
    if (!teluguResult.content.includes('సారాంశం') && !teluguResult.content.includes('##')) {
      throw new Error('FAILED: Telugu translation missing structured headings.');
    }

    console.log('   ✅ TEST E PASSED: Telugu translation operates on verified semantic content.\n');
    passed++;
  } catch (err: any) {
    console.error('   ❌ TEST E FAILED:', err.message, '\n');
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST F: FINAL OVERVIEW & DATA-DRIVEN SCORING DELTA
  // -------------------------------------------------------------------------
  console.log('--- [TEST F] Final Overview Unified Semantic Object & Data-Driven Score ---');
  try {
    const input = {
      inputType: 'image' as const,
      fileName: 'infographic_overview_sample.png',
      fileDataUrl: `data:image/png;base64,${generateTestPng(64, 64, 'earth2050')}`,
      rawText: '',
    };

    const result = await inclusaOrchestrator.runPipeline(input, DEFAULT_ACCESSIBILITY_PROFILE);

    const initialScore = result.initialScore.overallScore;
    const finalScore = result.verification?.afterScore.overallScore || 0;
    const delta = result.verification?.scoreImprovement || 0;
    const resolvedCount = result.verification?.issuesResolved || 0;
    const totalDetected = result.verification?.totalIssuesDetected || 0;

    console.log(`   ✓ Initial Baseline Score: ${initialScore}/100`);
    console.log(`   ✓ Verified Final Score: ${finalScore}/100`);
    console.log(`   ✓ Mathematical Improvement: +${delta} points`);
    console.log(`   ✓ Resolved Issues: ${resolvedCount} of ${totalDetected}`);

    if (finalScore <= initialScore && totalDetected > 0 && resolvedCount > 0) {
      throw new Error('FAILED: Final score did not improve after resolving detected barriers.');
    }
    if (delta !== (finalScore - initialScore)) {
      throw new Error(`FAILED: Delta mismatch: recorded ${delta}, expected ${finalScore - initialScore}`);
    }

    // Verify all final overview fields are present from the same verified object
    if (!result.transformedOutput.whatThisIs || !result.transformedOutput.imageDescriptions[0]?.altText || !result.transformedOutput.screenReaderHtml) {
      throw new Error('FAILED: Missing required sections in unified TransformedOutput.');
    }

    console.log('   ✅ TEST F PASSED: Final overview strictly driven by verified 6-agent mathematical pipeline.\n');
    passed++;
  } catch (err: any) {
    console.error('   ❌ TEST F FAILED:', err.message, '\n');
    failed++;
  }

  console.log('========================================================================');
  console.log(`   FINAL SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceSuite();
