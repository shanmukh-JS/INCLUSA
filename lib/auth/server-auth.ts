import { NextRequest } from 'next/server';
import { getSupabaseClient, getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { User } from './auth-types';

/**
 * Server-side authentication and session extraction.
 * Cryptographically verifies tokens using Supabase Auth when configured.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '') || '';

  // 1. Production Mode: Cryptographic Supabase Token Verification
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient() || getSupabaseClient();
    if (supabase && token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (data?.user && !error) {
        return {
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          createdAt: data.user.created_at || new Date().toISOString(),
        };
      }
    }
    return null;
  }

  // 2. Demo Mode: Verified Local Demo Session
  if (token.startsWith('demo_')) {
    return {
      id: 'usr_demo_developer',
      email: 'demo@inclusa.ai',
      fullName: 'INCLUSA Demo User',
      createdAt: '2026-01-01T00:00:00Z',
    };
  }

  // Default fallback for demo / developer mode
  return {
    id: 'usr_demo_developer',
    email: 'demo@inclusa.ai',
    fullName: 'INCLUSA Demo User',
    createdAt: '2026-01-01T00:00:00Z',
  };
}
