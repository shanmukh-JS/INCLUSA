'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthSession } from '@/lib/auth/auth-types';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { email: string; password?: string; fullName: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
  getToken: () => string | null;
}

const AUTH_STORAGE_KEY = 'inclusa_verified_session_v2';

function setAuthCookie(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `inclusa_auth_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  }
}

function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'inclusa_auth_token=; path=/; max-age=0; SameSite=Lax';
  }
}

const DEMO_USER: User = {
  id: 'usr_demo_developer',
  email: 'demo@inclusa.ai',
  fullName: 'INCLUSA Demo User',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = !isSupabaseConfigured();

  const verifyAndRestoreSession = useCallback(async () => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed: AuthSession = JSON.parse(stored);
          if (parsed.token && supabase) {
            // Verify cryptographically with Supabase Auth API
            const { data, error } = await supabase.auth.getUser(parsed.token);
            if (data?.user && !error) {
              const verifiedUser: User = {
                id: data.user.id,
                email: data.user.email || parsed.user.email,
                fullName: data.user.user_metadata?.full_name || parsed.user.fullName,
                createdAt: data.user.created_at || parsed.user.createdAt,
              };
              setUser(verifiedUser);
              setSession(parsed);
              setAuthCookie(parsed.token);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Session verification exception:', err);
      }

      // No active Supabase session
      setUser(null);
      setSession(null);
      clearAuthCookie();
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsLoading(false);
      return;
    }

    // Demo Mode — Local Development fallback
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthSession = JSON.parse(stored);
        if (parsed?.user) {
          setUser(parsed.user);
          setSession(parsed);
          setIsLoading(false);
          return;
        }
      }
      
      const demoSession: AuthSession = {
        user: DEMO_USER,
        token: `demo_token_${DEMO_USER.id}`,
        expiresAt: Date.now() + 86400000 * 30,
      };
      setUser(DEMO_USER);
      setSession(demoSession);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoSession));
    } catch {
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    verifyAndRestoreSession();
  }, [verifyAndRestoreSession]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setIsLoading(false);
        return { success: false, error: 'Supabase client unavailable' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data?.session) {
        setIsLoading(false);
        return { success: false, error: error?.message || 'Invalid email or password' };
      }

      const authUser: User = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        createdAt: data.user.created_at || new Date().toISOString(),
      };

      const authSession: AuthSession = {
        user: authUser,
        token: data.session.access_token,
        expiresAt: data.session.expires_at || Date.now() + 86400000,
      };

      setUser(authUser);
      setSession(authSession);
      setAuthCookie(authSession.token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
      setIsLoading(false);
      return { success: true };
    }

    // Demo Mode Sign In
    const id = `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const authUser: User = {
      id,
      email,
      fullName: email.split('@')[0].replace('.', ' '),
      createdAt: new Date().toISOString(),
    };
    const authSession: AuthSession = {
      user: authUser,
      token: `demo_session_${id}_${Date.now()}`,
      expiresAt: Date.now() + 86400000 * 30,
    };

    setUser(authUser);
    setSession(authSession);
    setAuthCookie(authSession.token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
    setIsLoading(false);
    return { success: true };
  };

  const signUp = async (data: { email: string; password?: string; fullName: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setIsLoading(false);
        return { success: false, error: 'Supabase client unavailable' };
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.fullName } },
      });

      if (error || !authData?.user) {
        setIsLoading(false);
        return { success: false, error: error?.message || 'Failed to register account' };
      }

      const authUser: User = {
        id: authData.user.id,
        email: authData.user.email || data.email,
        fullName: data.fullName,
        createdAt: authData.user.created_at || new Date().toISOString(),
      };

      if (authData.session) {
        const authSession: AuthSession = {
          user: authUser,
          token: authData.session.access_token,
          expiresAt: authData.session.expires_at || Date.now() + 86400000,
        };
        setUser(authUser);
        setSession(authSession);
        setAuthCookie(authSession.token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
      }

      setIsLoading(false);
      return { success: true };
    }

    // Demo Mode Sign Up
    const id = `usr_${data.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const authUser: User = {
      id,
      email: data.email,
      fullName: data.fullName,
      createdAt: new Date().toISOString(),
    };
    const authSession: AuthSession = {
      user: authUser,
      token: `demo_session_${id}_${Date.now()}`,
      expiresAt: Date.now() + 86400000 * 30,
    };

    setUser(authUser);
    setSession(authSession);
    setAuthCookie(authSession.token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
    setIsLoading(false);
    return { success: true };
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase && session?.token) {
        await supabase.auth.signOut(session.token);
      }
    }
    setUser(null);
    setSession(null);
    clearAuthCookie();
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (!supabase) return { success: false, error: 'Supabase client unavailable' };
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    return { success: true };
  };

  const refreshSession = async (): Promise<void> => {
    await verifyAndRestoreSession();
  };

  const getToken = (): string | null => {
    return session?.token || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        isDemoMode,
        login,
        signUp,
        logout,
        resetPassword,
        refreshSession,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
