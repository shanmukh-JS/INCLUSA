import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { fetchAnalysesFromSupabase } from '@/lib/supabase/db';
import { documentStore } from '@/lib/storage/document-store';
import { historyQuerySchema } from '@/lib/validation/schemas';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError, apiNotFound } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

/**
 * GET /api/history
 * Retrieve analysis history with pagination
 * Query params: ?page=1&limit=10 or ?id=xxx for single analysis
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized();
    }

    const { searchParams } = new URL(req.url);
    const queryObj = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      id: searchParams.get('id') || undefined,
    };

    const parsed = historyQuerySchema.safeParse(queryObj);
    if (!parsed.success) {
      return apiValidationError(parsed.error);
    }

    const { page, limit, id } = parsed.data;

    // Single analysis lookup by ID
    if (id) {
      const localDoc = documentStore.getAnalysisById(id, authUser.id);
      if (localDoc) {
        return apiSuccess(localDoc);
      }
      // Try Supabase
      const allDocs = await fetchAnalysesFromSupabase(authUser.id);
      const found = allDocs.find((d: any) => d.id === id);
      if (found) {
        return apiSuccess(found);
      }
      return apiNotFound('Analysis not found');
    }

    // Paginated list
    const cloudDocs = await fetchAnalysesFromSupabase(authUser.id);
    let allDocs: any[];

    if (cloudDocs && cloudDocs.length > 0) {
      allDocs = cloudDocs;
    } else {
      allDocs = documentStore.getAllAnalyses(authUser.id);
    }

    // Sort by creation date (newest first)
    allDocs.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    const total = allDocs.length;
    const totalPages = Math.ceil(total / limit);
    const startIdx = (page - 1) * limit;
    const paginated = allDocs.slice(startIdx, startIdx + limit);

    return apiSuccess({
      analyses: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err: any) {
    console.error('API /api/history GET error:', err);
    return apiError(err.message || 'Failed to fetch history');
  }
}
