import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { contentUnderstandingAgent } from '@/lib/agents/content-understanding';
import { accessibilityAuditAgent } from '@/lib/agents/accessibility-audit';
import { userNeedsAgent } from '@/lib/agents/user-needs';
import { calculateInitialScore } from '@/lib/scoring/accessibility-scorer';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '@/lib/storage/document-store';
import { analyzeRequestSchema } from '@/lib/validation/schemas';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError } from '@/lib/utils/api-response';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized('Valid authentication session required.');
    }

    const body = await req.json();
    const parsed = analyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiValidationError(parsed.error);
    }

    const { inputType, title, fileName, rawText, url, fileSizeBytes, profile } = parsed.data;

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
    const userProfile = (profile || DEFAULT_ACCESSIBILITY_PROFILE) as any;
    const userNeeds = userNeedsAgent.evaluate(userProfile, issues);

    return apiSuccess({
      structuredContent,
      issues,
      initialScore,
      personalizedRequirements: userNeeds.requirements,
      recommendedTransformations: userNeeds.recommendedTransformations,
    });
  } catch (err: any) {
    console.error('API /api/analyze error:', err);
    return apiError(err.message || 'Analysis failed');
  }
}
