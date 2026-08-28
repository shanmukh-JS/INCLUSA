import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { contentUnderstandingAgent } from '@/lib/agents/content-understanding';
import { accessibilityAuditAgent } from '@/lib/agents/accessibility-audit';
import { userNeedsAgent } from '@/lib/agents/user-needs';
import { calculateInitialScore } from '@/lib/scoring/accessibility-scorer';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '@/lib/storage/document-store';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Valid authentication session required.' }, { status: 401 });
    }

    const body = await req.json();
    const { inputType, title, fileName, rawText, url, fileSizeBytes, profile } = body;

    if (!inputType) {
      return NextResponse.json({ error: 'Missing required field: inputType' }, { status: 400 });
    }

    const structuredContent = await contentUnderstandingAgent.analyze({
      inputType,
      title: title || fileName || 'Document',
      fileName,
      rawText,
      url,
      fileSizeBytes,
    });

    const issues = accessibilityAuditAgent.audit(structuredContent);
    const initialScore = calculateInitialScore(issues);
    const userProfile = profile || DEFAULT_ACCESSIBILITY_PROFILE;
    const userNeeds = userNeedsAgent.evaluate(userProfile, issues);

    return NextResponse.json({
      success: true,
      structuredContent,
      issues,
      initialScore,
      personalizedRequirements: userNeeds.requirements,
      recommendedTransformations: userNeeds.recommendedTransformations,
    });
  } catch (err: any) {
    console.error('API /api/analyze error:', err);
    return NextResponse.json({ error: err.message || 'Analysis failed' }, { status: 500 });
  }
}
