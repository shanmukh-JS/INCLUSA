import { contentUnderstandingAgent } from '../lib/agents/content-understanding';
import { accessibilityAuditAgent } from '../lib/agents/accessibility-audit';
import { userNeedsAgent } from '../lib/agents/user-needs';
import { transformationAgent } from '../lib/agents/transformation-engine';
import { verificationAgent } from '../lib/agents/verification-engine';
import { explanationAgent } from '../lib/agents/explanation-agent';
import { aiService } from '../lib/ai/ai-service';
import { AccessibilityProfile } from '../types';

/**
 * INCLUSA FINAL REAL-CONTENT ACCEPTANCE TEST
 * Tests a brand new, previously unseen document through all 6 autonomous agents.
 */
async function runAcceptanceTest() {
  console.log('========================================================================');
  console.log('       INCLUSA MULTIMODAL ACCESSIBILITY — REAL CONTENT ACCEPTANCE TEST   ');
  console.log('========================================================================\n');

  // BRAND NEW UNSEEN DOCUMENT: National Clean Energy Transition Grant 2026
  const newDocumentText = `# National Clean Energy Transition Grant 2026 — Program Guidelines

## 1. Executive Summary & Purpose
The Department of Sustainable Energy Infrastructure announces the availability of $45,000,000 in competitive federal grant funding under the Clean Transition Act of 2026. This initiative supports municipal governments, regional utilities, and research consortia in deploying commercial-scale solar, wind, and battery energy storage solutions.

## 2. Program Timeline & Important Deadlines
* **Application Portal Opens**: March 15, 2026 at 09:00 EST.
* **Informational Webinar & Q&A**: April 10, 2026.
* **Final Application Deadline**: June 30, 2026 at 17:00 EST (Strict deadline; late submissions automatically disqualified).
* **Technical Review & Scoring Period**: July 1 to July 31, 2026.
* **Award Announcements & Fund Disbursement**: August 15, 2026.

## 3. Funding Tiers & Matching Requirements
Applicants may apply under one of three distinct grant tiers based on project scope and grid capacity impact:

| Funding Tier | Minimum Grant | Maximum Grant | Required Cost Share | Maximum Project Duration |
| Tier 1: Community Microgrid | $250,000 | $750,000 | 20% Non-Federal | 18 Months |
| Tier 2: Regional Utility Storage | $1,000,000 | $3,500,000 | 35% Non-Federal | 36 Months |
| Tier 3: Industrial Decarbonization | $5,000,000 | $12,000,000 | 50% Non-Federal | 48 Months |

## 4. Renewable Energy Generation Capacity Diagram
The project evaluation framework references the 2026 Regional Energy Transition Diagram:
* **Solar Photovoltaic**: Accounts for 42% of target new grid capacity (highest allocation).
* **Offshore & Terrestrial Wind**: Generates 35% of total nameplate output.
* **Pumped Hydro & Battery Storage**: Represents 18% of flexible peaking reserves.
* **Biomass & Geothermal Peakers**: Provides the remaining 5% of baseload stabilization.

## 5. Mandatory Eligibility Criteria
1. Applicant must be a registered municipal entity, public utility district, or 501(c)(3) environmental consortium.
2. Must demonstrate minimum 20% verified matching funds in escrow by May 30, 2026.
3. Facility must interconnect with an ISO-certified electrical distribution network.
4. Quarterly environmental impact and carbon abatement metrics must be reported through the federal portal.

## 6. Submission Instructions & Next Steps
* Step 1: Register organization on the EnergyGrants.gov portal and obtain a Unique Entity Identifier (UEI).
* Step 2: Complete Form DE-401 (Technical Scope & Engineering Schematics).
* Step 3: Attach audited financial statements for fiscal years 2024 and 2025.
* Step 4: Submit complete digital application package prior to June 30, 2026 deadline.`;

  // -------------------------------------------------------------------------
  // STEP 1: AGENT 1 (Content Understanding)
  // -------------------------------------------------------------------------
  console.log('🤖 STEP 1: Running Agent 1 (Content Understanding)...');
  const structuredContent = await contentUnderstandingAgent.analyze({
    inputType: 'pdf',
    title: 'National Clean Energy Transition Grant 2026',
    fileName: 'National_Clean_Energy_Grant_2026.pdf',
    rawText: newDocumentText,
  });

  console.log(`   ✓ Title Identified: "${structuredContent.title}"`);
  console.log(`   ✓ Total Blocks Extracted: ${structuredContent.blocks.length}`);
  console.log(`   ✓ Tables Detected: ${structuredContent.tables.length}`);
  if (structuredContent.tables.length > 0) {
    console.log(`     - Table 1 Headers: [${structuredContent.tables[0].headers.join(', ')}]`);
    console.log(`     - Table 1 Rows Count: ${structuredContent.tables[0].rows.length}`);
  }
  console.log(`   ✓ Images / Visuals Detected: ${structuredContent.images.length}`);
  console.log(`   ✓ Reading Grade Level: Grade ${structuredContent.metadata?.readingComplexityFleschKincaid}`);
  console.log(`   ✓ Word Count: ${structuredContent.metadata?.wordCount} words\n`);

  // -------------------------------------------------------------------------
  // STEP 2: AGENT 2 (Accessibility Audit)
  // -------------------------------------------------------------------------
  console.log('🔍 STEP 2: Running Agent 2 (Accessibility Audit)...');
  const detectedIssues = accessibilityAuditAgent.audit(structuredContent);
  console.log(`   ✓ Detected ${detectedIssues.length} Accessibility Barriers:`);
  detectedIssues.forEach((iss, idx) => {
    console.log(`     [Barrier ${idx + 1}] (${iss.category.toUpperCase()} - ${iss.severity.toUpperCase()}): ${iss.title}`);
    console.log(`       - Location: ${iss.location}`);
    console.log(`       - Why it matters: ${iss.whyItMatters}`);
  });
  console.log('');

  // -------------------------------------------------------------------------
  // STEP 3: AGENT 3 (User Needs & Personalization)
  // -------------------------------------------------------------------------
  console.log('👤 STEP 3: Running Agent 3 (User Needs Personalization)...');
  const testProfile: AccessibilityProfile = {
    id: 'prof_test_telugu_blind_adhd',
    name: 'Cognitive, Screen Reader & Telugu User Profile',
    isDefault: false,
    vision: {
      blind: true,
      screenReaderUser: true,
      lowVision: false,
      colorVisionDeficiency: 'none',
      highContrast: true,
      largeText: false,
    },
    hearing: {
      deaf: false,
      hardOfHearing: false,
      preferCaptions: true,
      preferTranscripts: true,
      preferVisualCues: true,
    },
    cognitive: {
      simplifiedLanguage: true,
      dyslexiaFriendly: false,
      readingDifficulty: true,
      shortSummaries: true,
      stepByStepExplanations: true,
      reduceClutter: true,
    },
    language: {
      primaryLanguage: 'te',
      autoTranslate: true,
      preserveTechnicalTerms: true,
    },
    output: {
      audioDescriptions: true,
      textSummaries: true,
      accessiblePdf: true,
      screenReaderOptimized: true,
      dyslexiaFormatted: false,
      includeCaptions: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const userEvaluation = userNeedsAgent.evaluate(testProfile, detectedIssues);
  console.log(`   ✓ User Profile Needs Evaluated: ${userEvaluation.requirements.length} requirements generated:`);
  userEvaluation.requirements.forEach((req) => console.log(`     • ${req}`));
  console.log(`   ✓ Prioritized Transformations: ${userEvaluation.recommendedTransformations.length} recommended actions\n`);

  // -------------------------------------------------------------------------
  // STEP 4: AGENT 4 (Transformation Engine)
  // -------------------------------------------------------------------------
  console.log('🛠️ STEP 4: Running Agent 4 (Transformation Execution)...');
  const transformedOutput = await transformationAgent.transform(
    structuredContent,
    userEvaluation.recommendedTransformations,
    testProfile
  );

  console.log('   ✓ Simplified Plain Language Generated:');
  console.log('     --- SIMPLIFIED SAMPLE (First 250 chars) ---');
  console.log(`     ${transformedOutput.simplifiedVersion.slice(0, 250).replace(/\n/g, '\n     ')}...`);
  console.log('   ✓ Action Steps (Step-by-step Guide):');
  (transformedOutput.stepByStepGuide || []).slice(0, 4).forEach((step, i) => {
    console.log(`     ${i + 1}. ${step}`);
  });

  console.log(`   ✓ Visual / Chart Descriptions Count: ${transformedOutput.imageDescriptions.length}`);
  transformedOutput.imageDescriptions.forEach((img, i) => {
    console.log(`     [Figure ${i + 1}] Alt: "${img.altText}"`);
    console.log(`     [Figure ${i + 1}] Meaning: "${img.detailed.slice(0, 150)}..."`);
  });

  console.log(`   ✓ Telugu Translation Available: ${!!transformedOutput.translations['te']}`);
  if (transformedOutput.translations['te']) {
    console.log('     --- TELUGU SAMPLE (First 250 chars) ---');
    console.log(`     ${transformedOutput.translations['te'].content.slice(0, 250).replace(/\n/g, '\n     ')}...`);
  }

  console.log(`   ✓ Screen Reader Semantic HTML Generated: ${transformedOutput.screenReaderHtml.length} characters`);
  console.log(`   ✓ Linearized Tables Count: ${transformedOutput.tableRepresentations.length}`);
  if (transformedOutput.tableRepresentations.length > 0) {
    console.log(`     - Table 1 Meaning: "${transformedOutput.tableRepresentations[0].plainExplanation}"`);
  }
  console.log('');

  // -------------------------------------------------------------------------
  // STEP 5: AGENT 5 (Verification Engine)
  // -------------------------------------------------------------------------
  console.log('✅ STEP 5: Running Agent 5 (Verification Engine)...');
  const verificationResult = verificationAgent.verify(
    structuredContent.id,
    detectedIssues,
    userEvaluation.recommendedTransformations,
    transformedOutput
  );

  console.log(`   ✓ Before Score: ${verificationResult.beforeScore.overallScore}/100 (${verificationResult.beforeScore.status})`);
  console.log(`   ✓ After Score: ${verificationResult.afterScore.overallScore}/100 (${verificationResult.afterScore.status})`);
  console.log(`   ✓ Verified Improvement: +${verificationResult.scoreImprovement} points gain`);
  console.log(`   ✓ Total Barriers Resolved: ${verificationResult.issuesResolved} of ${verificationResult.totalIssuesDetected}`);
  console.log(`   ✓ Critical Barriers Remaining: ${verificationResult.afterScore.criticalIssues}\n`);

  // -------------------------------------------------------------------------
  // STEP 6: AGENT 6 (Explanation Agent)
  // -------------------------------------------------------------------------
  console.log('💡 STEP 6: Running Agent 6 (Explanation Agent)...');
  const explanation = explanationAgent.explain({
    initialIssues: detectedIssues,
    transformations: userEvaluation.recommendedTransformations,
    verification: verificationResult,
    profile: testProfile,
  });

  console.log(`   ✓ Summary: ${explanation.summary}`);
  console.log('   ✓ Key Remediations:');
  explanation.keyRemediations.forEach((rem) => console.log(`     • ${rem}`));
  console.log('   ✓ Benefiting Groups:');
  explanation.benefitingUserGroups.forEach((grp) => console.log(`     • ${grp}`));
  console.log('');

  // -------------------------------------------------------------------------
  // STEP 7: Q&A GROUNDED ASSISTANT TEST
  // -------------------------------------------------------------------------
  console.log('💬 STEP 7: Testing Grounded Q&A Assistant with Real Questions...');

  const questions = [
    'What is this document about and what are the key deadlines?',
    'Explain what the energy transition diagram and generation percentages show.',
    'What does the funding tiers table tell us about maximum grants and matching funds?',
    'ఈ పత్రం యొక్క ముఖ్యమైన వివరాలు తెలుగులో వివరించండి (Explain key details in Telugu)',
  ];

  for (const q of questions) {
    console.log(`\n   ❓ Question: "${q}"`);
    const answerRes = await aiService.answerDocumentQuestion({
      question: q,
      documentTitle: structuredContent.title,
      documentText: newDocumentText,
    });
    console.log(`   💡 Answer:\n${answerRes.answer.slice(0, 300)}...`);
  }

  // -------------------------------------------------------------------------
  // STEP 8: CRITICAL ACCEPTANCE CHECKS
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log('                     CRITICAL ACCEPTANCE CHECKS                         ');
  console.log('========================================================================');

  const fullGeneratedText = JSON.stringify({
    simplified: transformedOutput.simplifiedVersion,
    descriptions: transformedOutput.imageDescriptions,
    tables: transformedOutput.tableRepresentations,
    telugu: transformedOutput.translations['te']?.content,
  });

  const forbiddenPlaceholders = [
    'This image contains structured documentation',
    'informative sections and key reference items',
    'General Info',
    'Data Points',
    'Compliance',
    'chart showing data trends',
  ];

  let placeholderFailures = 0;
  for (const phrase of forbiddenPlaceholders) {
    if (fullGeneratedText.includes(phrase)) {
      console.error(`   ❌ FORBIDDEN PLACEHOLDER FOUND: "${phrase}"`);
      placeholderFailures++;
    } else {
      console.log(`   ✅ PASSED: No occurrence of "${phrase}"`);
    }
  }

  // Check preserved facts
  const expectedFacts = ['March 15, 2026', 'June 30, 2026', 'August 15, 2026', '$45,000,000', '42%', '35%', '18%'];
  let factsPreserved = 0;
  for (const fact of expectedFacts) {
    if (newDocumentText.includes(fact) && (transformedOutput.accessibleText.includes(fact) || fullGeneratedText.includes(fact) || transformedOutput.screenReaderHtml.includes(fact))) {
      console.log(`   ✅ PRESERVED FACT: "${fact}" retained across transformations`);
      factsPreserved++;
    }
  }

  console.log('\n========================================================================');
  if (placeholderFailures === 0 && factsPreserved >= 5) {
    console.log('  🎉 FINAL ACCEPTANCE TEST RESULT: COMPLETE PASS (100% GROUNDED AI)');
  } else {
    console.log('  ⚠️ FINAL ACCEPTANCE TEST RESULT: REQUIRES FURTHER REFINEMENT');
  }
  console.log('========================================================================\n');
}

runAcceptanceTest().catch((err) => {
  console.error('Acceptance test failed with error:', err);
  process.exit(1);
});
