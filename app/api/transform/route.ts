import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { transformationAgent } from '@/lib/agents/transformation-engine';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '@/lib/storage/document-store';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Valid authentication session required.' }, { status: 401 });
    }

    const body = await req.json();
    const { structuredContent, transformations, profile } = body;

    if (!structuredContent || !transformations) {
      return NextResponse.json(
        { error: 'Missing required fields: structuredContent, transformations' },
        { status: 400 }
      );
    }

    const userProfile = profile || DEFAULT_ACCESSIBILITY_PROFILE;
    const output = await transformationAgent.transform(
      structuredContent,
      transformations,
      userProfile
    );

    return NextResponse.json({
      success: true,
      transformedOutput: output,
    });
  } catch (err: any) {
    console.error('API /api/transform error:', err);
    return NextResponse.json({ error: err.message || 'Transformation failed' }, { status: 500 });
  }
}
