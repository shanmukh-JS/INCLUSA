import { inclusaOrchestrator } from '../lib/agents/orchestrator';
import type { AccessibilityProfile } from '../types';

async function runEarth2050PipelineTest() {
  console.log('====================================================');
  console.log('   INCLUSA 6-AGENT PIPELINE TEST: EARTH 2050');
  console.log('====================================================\n');

  const earth2050Raw = `# EARTH 2050 — TWO POSSIBLE FUTURES
## What This Content Is About
A graphic illustration comparing two possible climate futures for Earth in the year 2050. The left half depicts a sustainable, green planet with clean renewable solar and wind energy, restored ecosystems, and thriving biodiversity. The right half depicts a climate emergency disaster zone with heavy industrial smog, arid scorched land, and unlivable extreme pollution.

## Visible Text
* "EARTH 2050 — TWO POSSIBLE FUTURES"
* "SUSTAINABLE PATHWAY: RENEWABLE ENERGY & RESTORATION"
* "CLIMATE CRISIS PATHWAY: INDUSTRIAL COLLAPSE & POLLUTION"
* "CLIMATE EMERGENCY — ACT NOW"

## Visual Elements & Composition
* Split composition dividing the planet Earth down the center into two contrasting halves.
* Left side: Vibrant green landscapes, wind turbines, solar panels, clean blue rivers, and lush forests.
* Right side: Orange-red fiery skies, smokestacks emitting toxic black smog, dried cracked earth, and dead trees.

## What You Need to Know
* Demonstrates the stark contrast between active climate mitigation and unchecked ecological degradation by 2050.
* Highlights renewable energy transition as the primary driver for ecological preservation.

## Action Steps
1. Act now to reduce global carbon emissions and support clean renewable energy adoption.
2. Protect and restore natural ecosystems and biodiversity.`;

  const activeProfile: AccessibilityProfile = {
    id: 'prof_earth',
    name: 'Telugu Primary Reader',
    isDefault: true,
    vision: { blind: false, lowVision: true, colorVisionDeficiency: 'none', highContrast: false, screenReaderUser: true, largeText: true },
    hearing: { deaf: false, hardOfHearing: false, preferCaptions: true, preferTranscripts: true, preferVisualCues: true },
    cognitive: { readingDifficulty: true, dyslexiaFriendly: false, simplifiedLanguage: true, shortSummaries: true, stepByStepExplanations: true, reduceClutter: true },
    language: { primaryLanguage: 'te', secondaryLanguage: 'hi', autoTranslate: true, preserveTechnicalTerms: true },
    output: { audioDescriptions: true, textSummaries: true, accessiblePdf: true, screenReaderOptimized: true, dyslexiaFormatted: false, includeCaptions: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const pipelineResult = await inclusaOrchestrator.runPipeline(
    {
      inputType: 'image',
      title: 'EARTH 2050 — TWO POSSIBLE FUTURES',
      fileName: 'earth_2050_two_futures.png',
      rawText: earth2050Raw,
    },
    activeProfile,
    (currentStep) => {
      console.log(`[Step Update] ${currentStep.name} -> ${currentStep.status} (${currentStep.progressPercent}%)`);
    }
  );

  console.log('\n--- PIPELINE EXECUTION COMPLETED ---');
  console.log(`Document ID: ${pipelineResult.documentId}`);
  console.log(`Engine: ${pipelineResult.engineName}`);
  console.log(`Initial Score: ${pipelineResult.initialScore.overallScore}/100`);
  console.log(`Verified Score: ${pipelineResult.verification?.afterScore.overallScore}/100 (+${pipelineResult.verification?.scoreImprovement} points)`);
  console.log(`Summary: "${pipelineResult.transformedOutput?.summary}"`);
  console.log(`Alt Text: "${pipelineResult.transformedOutput?.imageDescriptions[0]?.altText}"`);
  console.log(`Action Steps:`, pipelineResult.transformedOutput?.stepByStepGuide);
  console.log(`Telugu Title: "${pipelineResult.transformedOutput?.translations['te']?.title}"`);
  console.log(`Telugu Snippet: "${pipelineResult.transformedOutput?.translations['te']?.content.slice(0, 150)}..."`);
  console.log(`Key Remediations:`, pipelineResult.explanation.keyRemediations);

  // Assertions:
  const fullText = (pipelineResult.transformedOutput?.summary || '') + (pipelineResult.transformedOutput?.accessibleText || '');
  if (!fullText.toLowerCase().includes('sustainable') && !fullText.toLowerCase().includes('future') && !fullText.toLowerCase().includes('climate')) {
    throw new Error('FAILED: Earth 2050 did not preserve climate / future / sustainable concepts.');
  }

  const forbidden = ['3 major operational phases', 'Initial Assessment', 'Submission & Execution', 'income ceiling', 'eligibility criteria and income'];
  for (const f of forbidden) {
    if (fullText.toLowerCase().includes(f.toLowerCase())) {
      throw new Error(`FAILED: Found hallucinated phrase "${f}"`);
    }
  }

  if (fullText.includes('This is an uploaded visual image named') || fullText.includes('Visual graphic / logo asset.')) {
    throw new Error('FAILED: Found generic filename fallback string.');
  }

  console.log('\n====================================================');
  console.log('✅ ALL 6 AGENTS END-TO-END PIPELINE PASSED PERFECTLY');
  console.log('====================================================');
}

runEarth2050PipelineTest();
