'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthSession } from '@/lib/auth/auth-types';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { email: string; password?: string; fullName: string }) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  const verifyAndRestoreSession = useCallback(async () => {
    setIsLoading(true);

    if (!isConfigured) {
      setUser(null);
      setSession(null);
      clearAuthCookie();
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setUser(null);
      setSession(null);
      clearAuthCookie();
      setIsLoading(false);
      return;
    }

    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
      if (stored) {
        const parsed: AuthSession = JSON.parse(stored);
        if (parsed?.token) {
          // Cryptographic verification with Supabase Auth API
          const { data, error } = await supabase.auth.getUser(parsed.token);
          if (data?.user && !error) {
            const verifiedUser: User = {
              id: data.user.id,
              email: data.user.email || parsed.user?.email || '',
              fullName: data.user.user_metadata?.full_name || parsed.user?.fullName || data.user.email?.split('@')[0] || 'User',
              createdAt: data.user.created_at || parsed.user?.createdAt || new Date().toISOString(),
            };
            setUser(verifiedUser);
            setSession({
              ...parsed,
              user: verifiedUser,
            });
            setAuthCookie(parsed.token);
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Session verification exception:', err);
    }

    // No valid verified session found
    setUser(null);
    setSession(null);
    clearAuthCookie();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsLoading(false);
  }, [isConfigured]);

  useEffect(() => {
    verifyAndRestoreSession();

    // Multi-tab session synchronization listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY) {
        verifyAndRestoreSession();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [verifyAndRestoreSession]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!isConfigured) {
      setIsLoading(false);
      return { success: false, error: 'Supabase authentication service is not configured.' };
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsLoading(false);
      return { success: false, error: 'Supabase client unavailable' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session || !data.user) {
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
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
    }
    setIsLoading(false);
    return { success: true };
  };

  const signUp = async (data: {
    email: string;
    password?: string;
    fullName: string;
  }): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsLoading(true);

    if (!isConfigured) {
      setIsLoading(false);
      return { success: false, error: 'Supabase authentication service is not configured.' };
    }

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

    // If session is returned immediately (email confirmation turned off in Supabase)
    if (authData.session) {
      const authSession: AuthSession = {
        user: authUser,
        token: authData.session.access_token,
        expiresAt: authData.session.expires_at || Date.now() + 86400000,
      };
      setUser(authUser);
      setSession(authSession);
      setAuthCookie(authSession.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
      }
      setIsLoading(false);
      return { success: true };
    }

    // Email confirmation required by Supabase project
    setIsLoading(false);
    return {
      success: true,
      message: 'Account created! Please check your email to confirm your account or sign in.',
    };
  };

  const logout = async (): Promise<void> => {
    if (isConfigured) {
      const supabase = getSupabaseClient();
      if (supabase && session?.token) {
        try {
          await supabase.auth.signOut(session.token);
        } catch (e) {
          console.warn('SignOut error ignored:', e);
        }
      }
    }
    setUser(null);
    setSession(null);
    clearAuthCookie();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isConfigured) {
      return { success: false, error: 'Authentication service not configured' };
    }
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client unavailable' };
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const resendConfirmationEmail = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!isConfigured) {
      return { success: false, error: 'Authentication service not configured' };
    }
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client unavailable' };
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) return { success: false, error: error.message };
    return { success: true, message: 'Confirmation email sent! Please check your inbox.' };
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
        isConfigured,
        login,
        signUp,
        logout,
        resetPassword,
        resendConfirmationEmail,
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
