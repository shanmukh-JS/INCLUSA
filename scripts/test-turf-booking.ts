import { contentUnderstandingAgent } from '../lib/agents/content-understanding';
import { accessibilityAuditAgent } from '../lib/agents/accessibility-audit';
import { userNeedsAgent } from '../lib/agents/user-needs';
import { transformationAgent } from '../lib/agents/transformation-engine';
import { verificationAgent } from '../lib/agents/verification-engine';
import { explanationAgent } from '../lib/agents/explanation-agent';
import { aiService } from '../lib/ai/ai-service';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '../lib/storage/document-store';

async function runTurfBookingTest() {
  console.log('========================================================================');
  console.log('     INCLUSA STRICT GROUNDING ACCEPTANCE TEST: TURF BOOKING LOGO        ');
  console.log('========================================================================\n');

  // Simulated Turf Booking logo input with green logo mark and text "TURF BOOKING"
  const input = {
    inputType: 'image' as const,
    fileName: 'turf_booking_logo.png',
    title: 'Turf Booking Logo',
    rawText: `# Turf Booking Logo
## Visible Text
TURF BOOKING

## Visual Description
A green brand mark featuring stylized sports turf grass blades accompanied by the bold uppercase text "TURF BOOKING".

## Content Details
* **Graphic Type**: Brand Logo & Visual Identifier
* **Administrative Details**: No application requirements, eligibility rules, deadlines, or fees are present in this visual graphic.

## Action Steps
There are no action steps in this content.`,
  };

  console.log('🤖 STEP 1: Running Agent 1 (Content Understanding)...');
  const structuredContent = await contentUnderstandingAgent.analyze(input);
  console.log('   ✓ Title:', structuredContent.title);
  console.log('   ✓ Blocks Count:', structuredContent.blocks.length);
  console.log('   ✓ Images Count:', structuredContent.images.length);
  console.log('   ✓ Tables Count:', structuredContent.tables.length);

  console.log('\n🔍 STEP 2: Running Agent 2 (Accessibility Audit)...');
  const issues = accessibilityAuditAgent.audit(structuredContent);
  console.log(`   ✓ Barriers Found: ${issues.length}`);
  issues.forEach((iss, i) => console.log(`     ${i + 1}. [${iss.category.toUpperCase()}] ${iss.title}`));

  console.log('\n👤 STEP 3: Running Agent 3 (User Needs)...');
  const profile = DEFAULT_ACCESSIBILITY_PROFILE;
  const userNeeds = userNeedsAgent.evaluate(structuredContent, issues, profile);
  console.log(`   ✓ Recommended Transformations: ${userNeeds.transformations.length}`);

  console.log('\n🛠️ STEP 4: Running Agent 4 (Transformation Execution)...');
  const transformedOutput = await transformationAgent.transform(structuredContent, userNeeds.transformations, profile);
  console.log('   ✓ Simplified What This Is:', transformedOutput.summary);
  console.log('   ✓ Action Steps:', transformedOutput.stepByStepGuide);
  console.log('   ✓ Alt Text Generated:', transformedOutput.imageDescriptions[0]?.altText);
  console.log('   ✓ Telugu Translation Available:', Boolean(transformedOutput.translations['te']));

  console.log('\n✅ STEP 5: Running Agent 5 (Verification Engine)...');
  const verification = verificationAgent.verify(
    structuredContent.id,
    issues,
    userNeeds.transformations,
    transformedOutput
  );
  console.log(`   ✓ Before Score: ${verification.beforeScore.overallScore}/100`);
  console.log(`   ✓ After Score: ${verification.afterScore.overallScore}/100 (+${verification.scoreImprovement} pts)`);
  console.log(`   ✓ Issues Resolved: ${verification.issuesResolved} of ${verification.totalIssuesDetected}`);

  console.log('\n💡 STEP 6: Running Agent 6 (Explanation Agent)...');
  const explanation = explanationAgent.explain({
    initialIssues: issues,
    transformations: userNeeds.transformations,
    verification,
    profile,
  });
  console.log('   ✓ Summary:', explanation.summary);

  console.log('\n💬 STEP 7: Testing Grounded Q&A Assistant on Turf Booking Logo...');
  const q1 = await aiService.answerDocumentQuestion({
    question: 'What is the application deadline and eligibility requirement?',
    documentTitle: structuredContent.title,
    documentText: structuredContent.rawText,
  });
  console.log('   ❓ Q: "What is the application deadline and eligibility requirement?"');
  console.log('   💡 A:', q1.answer);

  const q2 = await aiService.answerDocumentQuestion({
    question: 'What does this image show?',
    documentTitle: structuredContent.title,
    documentText: structuredContent.rawText,
  });
  console.log('\n   ❓ Q: "What does this image show?"');
  console.log('   💡 A:', q2.answer);

  console.log('\n========================================================================');
  console.log('                 CRITICAL ANTI-HALLUCINATION CHECKS                     ');
  console.log('========================================================================');

  const fullOutputText = JSON.stringify({
    simplified: transformedOutput.simplifiedVersion,
    summary: transformedOutput.summary,
    steps: transformedOutput.stepByStepGuide,
    images: transformedOutput.imageDescriptions,
    q1: q1.answer,
  });

  const forbiddenTerms = [
    '3 major operational phases',
    'citizens, applicants, and stakeholders',
    'eligibility criteria and income ceiling',
    'submit before the deadline',
    'prepare all necessary paperwork',
    'mandatory verification review',
    'Flesch-Kincaid Grade Level of 12',
  ];

  let allPassed = true;
  for (const term of forbiddenTerms) {
    if (fullOutputText.toLowerCase().includes(term.toLowerCase())) {
      console.log(`   ❌ FAILED: Found forbidden hallucination: "${term}"`);
      allPassed = false;
    } else {
      console.log(`   ✅ PASSED: No occurrence of "${term}"`);
    }
  }

  if (allPassed) {
    console.log('\n🎉 ALL GROUNDING CHECKS PASSED: ZERO PROCEDURAL HALLUCINATIONS!');
  } else {
    console.log('\n⚠️ SOME CHECKS FAILED: Review output above.');
  }
}

runTurfBookingTest();
