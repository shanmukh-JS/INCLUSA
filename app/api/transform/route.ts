import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { transformationAgent } from '@/lib/agents/transformation-engine';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '@/lib/storage/document-store';
import { transformRequestSchema } from '@/lib/validation/schemas';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError } from '@/lib/utils/api-response';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized('Valid authentication session required.');
    }

    const body = await req.json();
    const parsed = transformRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiValidationError(parsed.error);
    }

    const { structuredContent, transformations, profile } = parsed.data;
    const userProfile = (profile || DEFAULT_ACCESSIBILITY_PROFILE) as any;
    const output = await transformationAgent.transform(
      structuredContent as any,
      transformations as any,
      userProfile
    );

    return apiSuccess({ transformedOutput: output });
  } catch (err: any) {
    console.error('API /api/transform error:', err);
    return apiError(err.message || 'Transformation failed');
  }
}
