import { aiService } from '../lib/ai/ai-service';
import { contentUnderstandingAgent } from '../lib/agents/content-understanding';
import { accessibilityAuditAgent } from '../lib/agents/accessibility-audit';
import { userNeedsAgent } from '../lib/agents/user-needs';
import { transformationAgent } from '../lib/agents/transformation-engine';
import { verificationAgent } from '../lib/agents/verification-engine';
import { explanationAgent } from '../lib/agents/explanation-agent';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '../lib/storage/document-store';

async function testEarth2050Pipeline() {
  console.log('========================================================================');
  console.log('   INCLUSA REAL MULTIMODAL TEST: EARTH 2050 — TWO POSSIBLE FUTURES     ');
  console.log('========================================================================\n');

  // Simulated Earth 2050 split-comparison infographic
  const earth2050Content = `# EARTH 2050 — TWO POSSIBLE FUTURES
## Visible Text
EARTH 2050
TWO POSSIBLE FUTURES
SUSTAINABLE PATHWAY
CLIMATE CRISIS PATHWAY
CLIMATE EMERGENCY — ACT NOW

## Visual Description
The image is split vertically into two contrasting halves depicting two alternative futures for planet Earth in the year 2050.
* Left side (Sustainable Pathway): Lush green urban canopy, solar panels, clean waterways, high-speed electric trains, and wind turbines under a bright blue sky.
* Right side (Climate Crisis Pathway): Smog-filled reddish-orange sky, industrial smokestacks, desiccated cracked soil, flooded coastal buildings, and dried-up riverbeds.
* Center: A stylized split globe showing vibrant green continents on the left and arid brown landmasses on the right.

## Visual Meaning & Message
This visual compares the environmental consequences of global climate action versus unchecked industrial emissions, urging immediate ecological stewardship.

## Key Facts Directly Visible
* Contrasts sustainable renewable transition vs unmitigated pollution impact.
* Highlights renewable energy technologies: solar panels and wind turbines.
* Depicts extreme heat, drought, and industrial smog as consequences of climate inaction.

## Action Steps
1. Act now to reduce global carbon emissions.
2. Transition energy systems to solar, wind, and sustainable power.`;

  const input = {
    inputType: 'image' as const,
    title: 'Earth 2050 Two Possible Futures',
    fileName: 'earth_2050_infographic.png',
    rawText: earth2050Content,
  };

  console.log('🤖 AGENT 1 (Content Understanding): Analyzing Image Content...');
  const structuredContent = await contentUnderstandingAgent.analyze(input);
  console.log('   ✓ Title:', structuredContent.title);
  console.log('   ✓ Blocks:', structuredContent.blocks.length);
  console.log('   ✓ Images count:', structuredContent.images.length);

  console.log('\n🔍 AGENT 2 (Accessibility Audit): Auditing Image Barriers...');
  const issues = accessibilityAuditAgent.audit(structuredContent);
  console.log(`   ✓ Issues Detected: ${issues.length}`);
  issues.forEach((iss, i) => console.log(`     ${i + 1}. [${iss.category.toUpperCase()}] ${iss.title}`));

  console.log('\n👤 AGENT 3 (User Needs): Applying Accessibility Profile (Telugu + Vision)...');
  const profile = DEFAULT_ACCESSIBILITY_PROFILE;
  const userNeeds = userNeedsAgent.evaluate(profile, issues);
  console.log(`   ✓ Selected Transformations: ${userNeeds.transformations.length}`);

  console.log('\n🛠️ AGENT 4 (Transformation Engine): Synthesizing Multimodal Outputs...');
  const transformedOutput = await transformationAgent.transform(structuredContent, userNeeds.transformations, profile);
  console.log('   ✓ What This Is Summary:\n    ', transformedOutput.summary);
  console.log('\n   ✓ Concise Alt Text:\n    ', transformedOutput.imageDescriptions[0]?.altText);
  console.log('\n   ✓ Detailed Description:\n    ', transformedOutput.imageDescriptions[0]?.detailed);
  console.log('\n   ✓ Plain Visual Meaning:\n    ', transformedOutput.imageDescriptions[0]?.simple);
  console.log('\n   ✓ Action Steps:\n    ', transformedOutput.stepByStepGuide);

  console.log('\n✅ AGENT 5 (Verification Engine): Verifying Accuracy & Grounding...');
  const verification = verificationAgent.verify(
    structuredContent.id,
    issues,
    userNeeds.transformations,
    transformedOutput
  );
  console.log(`   ✓ Before Score: ${verification.beforeScore.overallScore}/100`);
  console.log(`   ✓ After Score: ${verification.afterScore.overallScore}/100 (+${verification.scoreImprovement} pts)`);
  console.log(`   ✓ Resolved: ${verification.issuesResolved} / ${verification.totalIssuesDetected}`);

  console.log('\n💡 AGENT 6 (Explanation Agent): Explaining Remediations...');
  const explanation = explanationAgent.explain({
    initialIssues: issues,
    transformations: userNeeds.transformations,
    verification,
    profile,
  });
  console.log('   ✓ Explanation:\n    ', explanation.summary);

  console.log('\n💬 Testing Grounded Q&A Assistant on Earth 2050...');
  const q1 = await aiService.answerDocumentQuestion({
    question: 'What does this image show and what are the two futures?',
    documentTitle: structuredContent.title,
    documentText: structuredContent.rawText,
  });
  console.log('   ❓ Q: "What does this image show and what are the two futures?"');
  console.log('   💡 A:', q1.answer);

  console.log('\n========================================================================');
  console.log('                     EARTH 2050 ACCEPTANCE CHECKS                       ');
  console.log('========================================================================');

  const fullText = JSON.stringify({
    summary: transformedOutput.summary,
    desc: transformedOutput.imageDescriptions,
    actions: transformedOutput.stepByStepGuide,
    q1: q1.answer,
  }).toLowerCase();

  const checks = [
    { name: 'Mentions contrasting/two futures or pathways', passed: fullText.includes('future') || fullText.includes('pathway') || fullText.includes('contrast') },
    { name: 'Mentions sustainable / green elements (solar/wind/green)', passed: fullText.includes('green') || fullText.includes('solar') || fullText.includes('sustainable') },
    { name: 'Mentions climate crisis / pollution / smog', passed: fullText.includes('climate') || fullText.includes('pollut') || fullText.includes('smog') },
    { name: 'Does NOT say "This is an uploaded visual image named"', passed: !fullText.includes('this is an uploaded visual image named') },
    { name: 'Does NOT invent GPA / application paperwork / 3 operational phases', passed: !fullText.includes('3 major operational phases') && !fullText.includes('paperwork') },
  ];

  let allOk = true;
  for (const c of checks) {
    if (c.passed) {
      console.log(`   ✅ PASSED: ${c.name}`);
    } else {
      console.log(`   ❌ FAILED: ${c.name}`);
      allOk = false;
    }
  }

  if (allOk) {
    console.log('\n🎉 EARTH 2050 PIPELINE AUDIT PASSED!');
  } else {
    console.log('\n⚠️ SOME CHECKS FAILED');
  }
}

testEarth2050Pipeline();
