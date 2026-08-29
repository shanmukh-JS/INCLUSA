import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { createReportRequestSchema } from '@/lib/validation/schemas';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError, apiNotFound } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reports
 * Retrieve all accessibility reports for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized();
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      // Return empty array if Supabase is not configured
      return apiSuccess({ reports: [], source: 'none' });
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase reports fetch error:', error);
      return apiSuccess({ reports: [], source: 'supabase', error: error.message });
    }

    const reports = (data || []).map((row: any) => ({
      id: row.id,
      documentId: row.document_id,
      title: row.title,
      executiveSummary: row.executive_summary,
      initialScore: row.initial_score,
      finalScore: row.final_score,
      scoreDelta: row.score_delta,
      reportPayload: row.report_payload,
      createdAt: row.created_at,
    }));

    return apiSuccess({ reports, count: reports.length, source: 'supabase' });
  } catch (err: any) {
    console.error('API /api/reports GET error:', err);
    return apiError(err.message || 'Failed to fetch reports');
  }
}

/**
 * POST /api/reports
 * Create a new accessibility report
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized();
    }

    const body = await req.json();
    const parsed = createReportRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiValidationError(parsed.error);
    }

    const { documentId, title, executiveSummary, initialScore, finalScore, reportPayload } = parsed.data;
    const scoreDelta = finalScore - initialScore;

    const supabase = getSupabaseClient();
    if (!supabase) {
      // Return a mock report when Supabase is not configured
      const mockReport = {
        id: `report_${Date.now()}`,
        documentId,
        title: title || 'Accessibility Report',
        executiveSummary: executiveSummary || '',
        initialScore,
        finalScore,
        scoreDelta,
        reportPayload,
        createdAt: new Date().toISOString(),
      };
      return apiSuccess(mockReport, 201);
    }

    const { data, error } = await supabase.from('reports').insert({
      document_id: documentId,
      title: title || 'Accessibility Report',
      executive_summary: executiveSummary || '',
      initial_score: initialScore,
      final_score: finalScore,
      score_delta: scoreDelta,
      report_payload: reportPayload,
    });

    if (error) {
      console.error('Supabase report insert error:', error);
      return apiError(`Failed to save report: ${error.message}`);
    }

    return apiSuccess(data, 201, 'Report created successfully');
  } catch (err: any) {
    console.error('API /api/reports POST error:', err);
    return apiError(err.message || 'Failed to create report');
  }
}

/**
 * DELETE /api/reports
 * Delete a report by ID (query param ?id=xxx)
 */
export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized();
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return apiError('Missing id query parameter', 400);
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return apiSuccess({ deletedId: id }, 200, 'Report deleted (local mode)');
    }

    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) {
      return apiError(`Failed to delete report: ${error.message}`);
    }

    return apiSuccess({ deletedId: id }, 200, 'Report deleted successfully');
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete report');
  }
}
