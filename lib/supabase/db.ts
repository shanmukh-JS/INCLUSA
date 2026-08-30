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

export async function saveAnalysisToSupabase(
  analysis: DocumentAnalysis,
  userId?: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient(token);
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const resolvedUserId = userId || analysis.userId || analysis.profileUsed?.userId;
    const originalFileName = analysis.fileName || analysis.structuredContent?.originalFileName || analysis.title;
    const fileSizeBytes = analysis.fileSizeBytes || analysis.structuredContent?.fileSizeBytes || 0;
    const detectedLanguage = analysis.structuredContent?.detectedLanguage || 'en';
    const wordCount = analysis.structuredContent?.metadata?.wordCount || 0;
    const scoreImprovement = analysis.verification?.scoreImprovement || 0;

    const { error: docError } = await supabase.from('documents').upsert({
      id: analysis.id,
      user_id: resolvedUserId,
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
      user_id: resolvedUserId,
      document_id: analysis.id,
      status: analysis.status,
      initial_score: analysis.initialScore?.overallScore || 0,
      final_score: analysis.finalScore?.overallScore || 0,
      score_improvement: scoreImprovement,
      categories: analysis.initialScore?.categories || {},
      structured_content: analysis.structuredContent,
      issues: analysis.issues || [],
      transformations: analysis.transformations || [],
      transformed_output: analysis.transformedOutput || null,
      verification_result: analysis.verification || null,
    });

    if (analysisError) {
      console.error('Supabase analysis upsert error:', analysisError);
      return { success: false, error: analysisError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to persist analysis to Supabase:', err);
    return { success: false, error: err.message };
  }
}

export async function fetchAnalysesFromSupabase(
  userId: string,
  token?: string
): Promise<DocumentAnalysis[]> {
  const supabase = getSupabaseClient(token);
  if (!supabase || !userId) return [];

  try {
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !Array.isArray(analyses)) {
      console.warn('Supabase fetchAnalyses error:', error);
      return [];
    }

    return analyses.map((a: any) => ({
      id: a.id,
      userId: a.user_id,
      title: a.structured_content?.title || 'Document Analysis',
      fileName: a.structured_content?.originalFileName,
      fileSizeBytes: a.structured_content?.fileSizeBytes,
      inputType: a.structured_content?.inputType || 'document',
      status: a.status,
      createdAt: a.created_at || new Date().toISOString(),
      updatedAt: a.created_at || new Date().toISOString(),
      profileUsed: a.structured_content?.profileUsed || {
        id: 'profile_default',
        name: 'Default User Profile',
        isDefault: true,
        vision: { blind: false, lowVision: true, colorVisionDeficiency: 'none', highContrast: false, screenReaderUser: true, largeText: true },
        hearing: { deaf: false, hardOfHearing: false, preferCaptions: true, preferTranscripts: true, preferVisualCues: true },
        cognitive: { readingDifficulty: true, dyslexiaFriendly: false, simplifiedLanguage: true, shortSummaries: true, stepByStepExplanations: true, reduceClutter: true },
        language: { primaryLanguage: 'te', secondaryLanguage: 'hi', autoTranslate: true, preserveTechnicalTerms: true },
        output: { audioDescriptions: true, textSummaries: true, accessiblePdf: true, screenReaderOptimized: true, dyslexiaFormatted: false, includeCaptions: true },
      },
      initialScore: {
        overallScore: a.initial_score,
        status: a.initial_score >= 90 ? 'Highly Accessible' : a.initial_score >= 75 ? 'Acceptable' : a.initial_score >= 50 ? 'Needs Improvement' : 'Critical Barriers',
        categories: a.categories || {},
        totalIssues: (a.issues || []).length,
        criticalIssues: (a.issues || []).filter((i: any) => i.severity === 'critical').length,
        highIssues: (a.issues || []).filter((i: any) => i.severity === 'high').length,
        mediumIssues: (a.issues || []).filter((i: any) => i.severity === 'medium').length,
        lowIssues: (a.issues || []).filter((i: any) => i.severity === 'low').length,
        passedChecks: 24 - (a.issues || []).length,
        calculatedAt: a.created_at,
      },
      finalScore: a.final_score
        ? {
            overallScore: a.final_score,
            status: a.final_score >= 90 ? 'Highly Accessible' : a.final_score >= 75 ? 'Acceptable' : 'Needs Improvement',
            categories: a.verification_result?.afterScore?.categories || a.categories || {},
            totalIssues: (a.verification_result?.remainingIssues || []).length,
            criticalIssues: (a.verification_result?.remainingIssues || []).filter((i: any) => i.severity === 'critical').length,
            highIssues: (a.verification_result?.remainingIssues || []).filter((i: any) => i.severity === 'high').length,
            mediumIssues: (a.verification_result?.remainingIssues || []).filter((i: any) => i.severity === 'medium').length,
            lowIssues: (a.verification_result?.remainingIssues || []).filter((i: any) => i.severity === 'low').length,
            passedChecks: 24 - (a.verification_result?.remainingIssues || []).length,
            calculatedAt: a.created_at,
          }
        : undefined,
      structuredContent: a.structured_content,
      issues: a.issues,
      transformations: a.transformations,
      transformedOutput: a.transformed_output,
      verification: a.verification_result,
    }));
  } catch (err) {
    console.error('Supabase fetchAnalyses exception:', err);
    return [];
  }
}

export async function deleteAnalysisFromSupabase(
  id: string,
  userId?: string,
  token?: string
): Promise<{ success: boolean }> {
  const supabase = getSupabaseClient(token);
  if (!supabase) return { success: false };

  try {
    const { error } = await supabase.from('analyses').delete().eq('id', id);
    await supabase.from('documents').delete().eq('id', id);
    return { success: !error };
  } catch {
    return { success: false };
  }
}

export async function saveProfileToSupabase(
  profile: AccessibilityProfile,
  userId: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient(token);
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const { error } = await supabase.from('accessibility_profiles').upsert({
      id: profile.id,
      user_id: userId,
      name: profile.name,
      is_default: profile.isDefault,
      vision_prefs: profile.vision,
      hearing_prefs: profile.hearing,
      cognitive_prefs: profile.cognitive,
      language_prefs: profile.language,
      output_prefs: profile.output,
      updated_at: new Date().toISOString(),
    });

    return { success: !error, error: error?.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchProfileFromSupabase(
  userId: string,
  token?: string
): Promise<AccessibilityProfile | null> {
  const supabase = getSupabaseClient(token);
  if (!supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('accessibility_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) return null;
    const p = data[0];

    return {
      id: p.id,
      userId: p.user_id,
      name: p.name,
      isDefault: p.is_default,
      vision: p.vision_prefs,
      hearing: p.hearing_prefs,
      cognitive: p.cognitive_prefs,
      language: p.language_prefs,
      output: p.output_prefs,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
  } catch {
    return null;
  }
}

export async function saveReportToSupabase(
  report: AccessibilityReport,
  userId: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient(token);
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const { error } = await supabase.from('reports').upsert({
      id: report.id,
      user_id: userId,
      document_id: report.documentId,
      title: report.documentTitle,
      executive_summary: report.executiveSummary,
      initial_score: report.initialScore?.overallScore ?? 0,
      final_score: report.finalScore?.overallScore ?? 0,
      score_delta: report.scoreImprovement,
      report_payload: report,
      created_at: report.createdAt,
    });

    return { success: !error, error: error?.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
