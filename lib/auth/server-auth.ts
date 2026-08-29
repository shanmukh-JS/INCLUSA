import { NextRequest } from 'next/server';
import { getSupabaseClient, getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { User } from './auth-types';

/**
 * Server-side cryptographic authentication and session extraction.
 * Validates bearer tokens and session cookies strictly server-side using Supabase Auth.
 * Returns null for any unauthenticated, expired, or invalid session.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  const authCookie = req.cookies.get('inclusa_auth_token')?.value;

  const rawToken = authHeader?.replace(/^Bearer\s+/i, '').trim() || authCookie || '';
  const token = rawToken ? decodeURIComponent(rawToken) : '';

  if (!token) {
    return null;
  }

  // Cryptographic Supabase Token Verification
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient() || getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.getUser(token);
        if (data?.user && !error) {
          return {
            id: data.user.id,
            email: data.user.email || '',
            fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
            createdAt: data.user.created_at || new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('Supabase server token verification error:', err);
      }
    }
  }

  return null;
}

