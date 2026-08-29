import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { verificationAgent } from '@/lib/agents/verification-engine';
import { explanationAgent } from '@/lib/agents/explanation-agent';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '@/lib/storage/document-store';
import { verifyRequestSchema } from '@/lib/validation/schemas';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError } from '@/lib/utils/api-response';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized('Valid authentication session required.');
    }

    const body = await req.json();
    const parsed = verifyRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiValidationError(parsed.error);
    }

    const { documentId, initialIssues, transformations, transformedOutput, profile } = parsed.data;
    const userProfile = (profile || DEFAULT_ACCESSIBILITY_PROFILE) as any;

    const verification = verificationAgent.verify(
      documentId,
      initialIssues as any,
      transformations as any,
      transformedOutput as any
    );

    const explanation = explanationAgent.explain({
      initialIssues: initialIssues as any,
      transformations: transformations as any,
      verification,
      profile: userProfile,
    });

    return apiSuccess({ verification, explanation });
  } catch (err: any) {
    console.error('API /api/verify error:', err);
    return apiError(err.message || 'Verification failed');
  }
}
