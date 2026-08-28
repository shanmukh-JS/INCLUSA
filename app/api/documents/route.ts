import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { fetchAnalysesFromSupabase, saveAnalysisToSupabase, deleteAnalysisFromSupabase } from '@/lib/supabase/db';
import { documentStore } from '@/lib/storage/document-store';

/**
 * GET /api/documents
 * Retrieve all analyzed documents belonging to the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cloudDocs = await fetchAnalysesFromSupabase();
    if (cloudDocs && cloudDocs.length > 0) {
      const userDocs = cloudDocs.filter((d) => !d.userId || d.userId === authUser.id);
      return NextResponse.json({ success: true, source: 'supabase', count: userDocs.length, data: userDocs });
    }
    const localDocs = documentStore.getAllAnalyses(authUser.id);
    return NextResponse.json({ success: true, source: 'local', count: localDocs.length, data: localDocs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/documents
 * Persist an analyzed document associated with the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Missing document/analysis object with id' }, { status: 400 });
    }

    // Force user ownership from server session
    const userDoc = {
      ...body,
      userId: authUser.id,
    };

    const result = await saveAnalysisToSupabase(userDoc);
    documentStore.saveAnalysis(userDoc, authUser.id);
    return NextResponse.json({ success: true, savedToCloud: result.success });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/documents
 * Remove document and analysis with IDOR protection
 */
export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id query parameter' }, { status: 400 });
    }

    // Check ownership
    const existing = documentStore.getAnalysisById(id, authUser.id);
    if (!existing) {
      return NextResponse.json({ error: 'Document not found or unauthorized' }, { status: 404 });
    }

    await deleteAnalysisFromSupabase(id);
    documentStore.deleteAnalysis(id, authUser.id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
