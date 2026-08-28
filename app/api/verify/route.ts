import { NextRequest, NextResponse } from 'next/server';
import { verificationAgent } from '@/lib/agents/verification-engine';
import { explanationAgent } from '@/lib/agents/explanation-agent';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '@/lib/storage/document-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentId, initialIssues, transformations, transformedOutput, profile } = body;

    if (!documentId || !initialIssues || !transformations || !transformedOutput) {
      return NextResponse.json(
        { error: 'Missing required fields for verification' },
        { status: 400 }
      );
    }

    const userProfile = profile || DEFAULT_ACCESSIBILITY_PROFILE;

    const verification = verificationAgent.verify(
      documentId,
      initialIssues,
      transformations,
      transformedOutput
    );

    const explanation = explanationAgent.explain({
      initialIssues,
      transformations,
      verification,
      profile: userProfile,
    });

    return NextResponse.json({
      success: true,
      verification,
      explanation,
    });
  } catch (err: any) {
    console.error('API /api/verify error:', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
