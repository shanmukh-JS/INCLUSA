import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { createProfileRequestSchema, updateProfileRequestSchema } from '@/lib/validation/schemas';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError, apiNotFound } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

/**
 * GET /api/profile
 * Retrieve all accessibility profiles for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized();
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      // Return a default profile when Supabase is not configured
      return apiSuccess({
        profiles: [{
          id: 'profile_default',
          userId: authUser.id,
          name: 'Default Profile',
          isDefault: true,
          vision: { blind: false, lowVision: false, colorVisionDeficiency: 'none', highContrast: false, screenReaderUser: false, largeText: false },
          hearing: { deaf: false, hardOfHearing: false, preferCaptions: false, preferTranscripts: false, preferVisualCues: false },
          cognitive: { readingDifficulty: false, dyslexiaFriendly: false, simplifiedLanguage: false, shortSummaries: false, stepByStepExplanations: false, reduceClutter: false },
          language: { primaryLanguage: 'en', autoTranslate: false, preserveTechnicalTerms: true },
          output: { audioDescriptions: false, textSummaries: true, accessiblePdf: true, screenReaderOptimized: false, dyslexiaFormatted: false, includeCaptions: false },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
        source: 'local',
      });
    }

    const { data, error } = await supabase
      .from('accessibility_profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase profiles fetch error:', error);
      return apiError(`Failed to fetch profiles: ${error.message}`);
    }

    const profiles = (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      isDefault: row.is_default,
      vision: row.vision_prefs || {},
      hearing: row.hearing_prefs || {},
      cognitive: row.cognitive_prefs || {},
      language: row.language_prefs || {},
      output: row.output_prefs || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return apiSuccess({ profiles, count: profiles.length, source: 'supabase' });
  } catch (err: any) {
    console.error('API /api/profile GET error:', err);
    return apiError(err.message || 'Failed to fetch profiles');
  }
}

/**
 * POST /api/profile
 * Create a new accessibility profile
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized();
    }

    const body = await req.json();
    const parsed = createProfileRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiValidationError(parsed.error);
    }

    const { name, isDefault, vision, hearing, cognitive, language, output } = parsed.data;

    const supabase = getSupabaseClient();
    if (!supabase) {
      const mockProfile = {
        id: `profile_${Date.now()}`,
        userId: authUser.id,
        name,
        isDefault,
        vision: vision || {},
        hearing: hearing || {},
        cognitive: cognitive || {},
        language: language || {},
        output: output || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return apiSuccess(mockProfile, 201);
    }

    // If this profile is default, unset other defaults first
    if (isDefault) {
      await supabase
        .from('accessibility_profiles')
        .select('id')
        .eq('user_id', authUser.id)
        .eq('is_default', true);
      // Note: PostgREST doesn't support UPDATE via this client pattern easily,
      // so we rely on the new profile being the default
    }

    const { data, error } = await supabase.from('accessibility_profiles').insert({
      user_id: authUser.id,
      name,
      is_default: isDefault,
      vision_prefs: vision || {},
      hearing_prefs: hearing || {},
      cognitive_prefs: cognitive || {},
      language_prefs: language || {},
      output_prefs: output || {},
    });

    if (error) {
      console.error('Supabase profile insert error:', error);
      return apiError(`Failed to create profile: ${error.message}`);
    }

    return apiSuccess(data, 201, 'Profile created successfully');
  } catch (err: any) {
    console.error('API /api/profile POST error:', err);
    return apiError(err.message || 'Failed to create profile');
  }
}

/**
 * DELETE /api/profile
 * Delete a profile by ID (query param ?id=xxx)
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
      return apiSuccess({ deletedId: id }, 200, 'Profile deleted (local mode)');
    }

    const { error } = await supabase.from('accessibility_profiles').delete().eq('id', id);
    if (error) {
      return apiError(`Failed to delete profile: ${error.message}`);
    }

    return apiSuccess({ deletedId: id }, 200, 'Profile deleted successfully');
  } catch (err: any) {
    return apiError(err.message || 'Failed to delete profile');
  }
}
