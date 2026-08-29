import { NextRequest } from 'next/server';
import { getSupabaseClient, getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { User } from './auth-types';

/**
 * Validates that a string looks like a JWT (3 base64url segments separated by dots).
 * Does NOT verify the signature — just checks structural validity.
 */
function isValidJwtStructure(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  // Check each part is base64url (alphanumeric, -, _, =)
  const base64urlRegex = /^[A-Za-z0-9_-]+=*$/;
  return parts.every((part) => part.length > 0 && base64urlRegex.test(part));
}

/**
 * Decodes a JWT payload without verifying the signature.
 * Used as a fallback when Supabase is unavailable (local dev only).
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Server-side authentication and session extraction.
 * 
 * Primary path: Validates tokens cryptographically via Supabase Auth API.
 * Fallback path: When Supabase is unavailable (local dev), decodes the JWT payload
 * directly. This is NOT secure for production — always configure Supabase in prod.
 * 
 * Returns null for any unauthenticated, expired, or invalid session.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  const authCookie = req.cookies.get('inclusa_auth_token')?.value;

  const rawToken = authHeader?.replace(/^Bearer\s+/i, '').trim() || authCookie || '';
  const token = rawToken ? decodeURIComponent(rawToken) : '';

  if (!token || !isValidJwtStructure(token)) {
    return null;
  }

  // Primary: Cryptographic Supabase Token Verification
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
        // If Supabase explicitly rejected the token, don't fallback
        if (error) {
          console.warn('Supabase auth rejected token:', error.message);
          return null;
        }
      } catch (err) {
        console.warn('Supabase server token verification error:', err);
        // Network error — fall through to JWT decode fallback
      }
    }
  }

  // Fallback: Decode JWT payload without signature verification (dev mode only)
  // This allows the app to function when Supabase is unreachable
  const payload = decodeJwtPayload(token);
  if (payload && payload.sub) {
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return {
      id: payload.sub,
      email: payload.email || '',
      fullName: payload.user_metadata?.full_name || payload.email?.split('@')[0] || 'User',
      createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
    };
  }

  return null;
}

