import { getSupabaseClient, isSupabaseConfigured } from './client';
export { isSupabaseConfigured };
import {
  AccessibilityProfile,
  AccessibilityReport,
  ChatMessage,
  DocumentAnalysis,
} from '@/types';

export interface SupabaseConnectionStatus {
  configured: boolean;
  connected: boolean;
  url?: string;
  error?: string;
  tablesVerified?: boolean;
}

export async function testSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      error: 'Supabase URL or Anon Key is missing in environment variables.',
    };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { configured: true, connected: false, error: 'Could not create Supabase client' };
    }

    const { data, error } = await supabase
      .from('analyses')
      .select('id')
      .limit(1);

    if (error) {
      return {
        configured: true,
        connected: false,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        error: `Database connected, but query failed: ${error.message}. Please execute database/supabase-schema.sql in the Supabase SQL editor.`,
        tablesVerified: false,
      };
    }

    return {
      configured: true,
      connected: true,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      tablesVerified: true,
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      error: err.message || 'Unknown network error connecting to Supabase.',
    };
  }
}

export async function saveAnalysisToSupabase(analysis: DocumentAnalysis): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const originalFileName = analysis.fileName || analysis.structuredContent?.originalFileName || analysis.title;
    const fileSizeBytes = analysis.fileSizeBytes || analysis.structuredContent?.fileSizeBytes || 0;
    const detectedLanguage = analysis.structuredContent?.detectedLanguage || 'en';
    const wordCount = analysis.structuredContent?.metadata?.wordCount || 0;
    const scoreImprovement = analysis.verification?.scoreImprovement || 0;

    const { error: docError } = await supabase.from('documents').upsert({
      id: analysis.id,
      title: analysis.title,
      input_type: analysis.inputType,
      original_file_name: originalFileName,
      file_size_bytes: fileSizeBytes,
      storage_path: null,
      raw_text: analysis.structuredContent?.rawText || '',
      detected_language: detectedLanguage,
      page_count: analysis.structuredContent?.pageCount || 1,
      metadata: {
        wordCount,
        imagesCount: analysis.structuredContent?.images?.length || 0,
      },
      updated_at: new Date().toISOString(),
    });

    if (docError) console.error('Supabase document upsert error:', docError);

    const { error: analysisError } = await supabase.from('analyses').upsert({
      id: analysis.id,
      document_id: analysis.id,
      status: analysis.status,
      initial_score: analysis.initialScore?.overallScore || 0,
      final_score: analysis.finalScore?.overallScore || 0,
      score_improvement: scoreImprovement,
      categories: analysis.initialScore?.categories || {},
      structured_content: analysis.structuredContent || {},
      issues: analysis.issues || [],
      transformations: analysis.transformations || [],
      transformed_output: analysis.transformedOutput || null,
      verification_result: analysis.verification || null,
      created_at: analysis.createdAt,
    });

    if (analysisError) {
      console.error('Supabase analysis upsert error:', analysisError);
      return { success: false, error: analysisError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchAnalysesFromSupabase(userId?: string): Promise<DocumentAnalysis[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('analyses')
      .select('*, documents(*)')
      .order('created_at', { ascending: false });

    // Filter by user at the database level when userId is provided
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      title: row.documents?.title || row.structured_content?.rawText?.slice(0, 40) || 'Untitled Analysis',
      inputType: row.documents?.input_type || 'pdf',
      fileName: row.documents?.original_file_name,
      fileSizeBytes: row.documents?.file_size_bytes,
      status: row.status || 'completed',
      profileUsed: row.structured_content?.profileUsed || {
        id: 'profile_default',
        name: 'Vision & Telugu Regional Profile',
        isDefault: true,
        vision: { blind: false, lowVision: true, colorVisionDeficiency: 'none', highContrast: false, screenReaderUser: true, largeText: true },
        hearing: { deaf: false, hardOfHearing: false, preferCaptions: true, preferTranscripts: true, preferVisualCues: true },
        cognitive: { readingDifficulty: true, dyslexiaFriendly: false, simplifiedLanguage: true, shortSummaries: true, stepByStepExplanations: true, reduceClutter: true },
        language: { primaryLanguage: 'te', secondaryLanguage: 'hi', autoTranslate: true, preserveTechnicalTerms: true },
        output: { audioDescriptions: true, textSummaries: true, accessiblePdf: true, screenReaderOptimized: true, dyslexiaFormatted: false, includeCaptions: true },
        createdAt: row.created_at,
        updatedAt: row.created_at,
      },
      initialScore: {
        overallScore: row.initial_score,
        categories: row.categories || { vision: 80, hearing: 80, cognitive: 80, language: 80, structure: 80, screenReader: 80 },
        penalties: [],
        totalIssues: (row.issues || []).length,
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        lowIssues: 0,
        passedChecks: 20,
        calculatedAt: row.created_at,
        status: row.initial_score >= 90 ? 'Highly Accessible' : row.initial_score >= 70 ? 'Acceptable' : 'Needs Improvement',
      },
      finalScore: row.final_score ? {
        overallScore: row.final_score,
        categories: row.categories || { vision: 95, hearing: 95, cognitive: 95, language: 95, structure: 95, screenReader: 95 },
        penalties: [],
        totalIssues: 0,
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        lowIssues: 0,
        passedChecks: 24,
        calculatedAt: row.created_at,
        status: 'Highly Accessible',
      } : undefined,
      structuredContent: row.structured_content || {
        id: row.id,
        inputType: row.documents?.input_type || 'pdf',
        title: row.documents?.title || 'Document',
        rawText: '',
        blocks: [],
        images: [],
        tables: [],
        pageCount: 1,
        detectedLanguage: 'en',
        hasScannedPages: false,
        metadata: { wordCount: 0, charCount: 0 },
      },
      issues: row.issues || [],
      transformations: row.transformations || [],
      transformedOutput: row.transformed_output,
      verification: row.verification_result,
      createdAt: row.created_at,
      updatedAt: row.created_at,
    }));
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return [];
  }
}

export async function deleteAnalysisFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('analyses').delete().eq('id', id);
    await supabase.from('documents').delete().eq('id', id);
    return !error;
  } catch (err) {
    return false;
  }
}

export async function uploadDocumentToSupabaseStorage(
  filePath: string,
  fileBlob: Blob | File | Buffer,
  contentType: string = 'application/octet-stream'
): Promise<{ publicUrl?: string; storagePath?: string; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured' };

  try {
    const bucket = 'inclusa-documents';
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBlob, { contentType, upsert: true });

    if (error) return { error: error.message };

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return {
      publicUrl: urlData.publicUrl,
      storagePath: data.path,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function saveChatMessageToSupabase(
  documentId: string,
  message: ChatMessage
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('chat_messages').insert({
      id: message.id,
      document_id: documentId,
      sender: message.sender,
      content: message.content,
      citations: message.citations || [],
      created_at: message.timestamp,
    });
    return !error;
  } catch (err) {
    return false;
  }
}
