import { NextRequest, NextResponse } from 'next/server';
import { fetchAnalysesFromSupabase, saveAnalysisToSupabase, deleteAnalysisFromSupabase } from '@/lib/supabase/db';
import { documentStore } from '@/lib/storage/document-store';

/**
 * GET /api/documents
 * Retrieve all analyzed documents from Supabase (fallback to local store)
 */
export async function GET() {
  try {
    const cloudDocs = await fetchAnalysesFromSupabase();
    if (cloudDocs && cloudDocs.length > 0) {
      return NextResponse.json({ success: true, source: 'supabase', count: cloudDocs.length, data: cloudDocs });
    }
    const localDocs = documentStore.getAllAnalyses();
    return NextResponse.json({ success: true, source: 'local', count: localDocs.length, data: localDocs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/documents
 * Persist an analyzed document to the database
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Missing document/analysis object with id' }, { status: 400 });
    }
    const result = await saveAnalysisToSupabase(body);
    documentStore.saveAnalysis(body);
    return NextResponse.json({ success: true, savedToCloud: result.success });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/documents
 * Remove document and analysis from database
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id query parameter' }, { status: 400 });
    }
    await deleteAnalysisFromSupabase(id);
    documentStore.deleteAnalysis(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
