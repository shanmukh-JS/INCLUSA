'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Info,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Layers,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/dashboard';
  // Safe redirect validation: must start with / and not loop back to /login or /signup
  const redirectUrl =
    rawRedirect.startsWith('/') &&
    !rawRedirect.startsWith('//') &&
    rawRedirect !== '/login' &&
    rawRedirect !== '/signup'
      ? rawRedirect
      : '/dashboard';

  const { user, session, isLoading, login, loginAsDemo, logout, resendConfirmationEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleContinue = useCallback(() => {
    if (session?.token) {
      document.cookie = `inclusa_auth_token=${encodeURIComponent(session.token)}; path=/; max-age=604800; SameSite=Lax`;
    }
    window.location.href = redirectUrl;
  }, [session?.token, redirectUrl]);

  // Automatic redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      const timer = setTimeout(() => {
        handleContinue();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, handleContinue]);

  // If already logged in, show clear authenticated state with instant redirect action
  if (!isLoading && user) {
    return (
      <div className="p-8 rounded-3xl border-3 border-[var(--border-strong)] bg-white shadow-[8px_8px_0_0_#192138] space-y-6 text-center animate-fade-in">
        <div className="flex justify-center mb-2">
          <InclusaMascot pose="celebrating" size={80} />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Session Detected</span>
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            You Are Already Logged In!
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
            Signed in as <strong className="text-[var(--text-primary)]">{user.fullName || user.email}</strong> ({user.email}).
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Layers className="h-4 w-4" />
            <span>Continue to Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-black text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out / Switch Account</span>
          </button>
        </div>
      </div>
    );
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address to resend confirmation.');
      return;
    }
    setIsResending(true);
    const res = await resendConfirmationEmail(email);
    setIsResending(false);
    if (res.success) {
      setInfoMsg(res.message || 'Confirmation email sent! Please check your inbox.');
    } else {
      setErrorMsg(res.error || 'Failed to resend confirmation email.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.replace(redirectUrl);
    } else {
      setErrorMsg(result.error || 'Email or password is incorrect.');
    }
  };

  const isEmailNotConfirmed =
    errorMsg?.toLowerCase().includes('email not confirmed') ||
    errorMsg?.toLowerCase().includes('unconfirmed');

  return (
    <div className="p-8 rounded-3xl border-3 border-[var(--border-strong)] bg-white shadow-[8px_8px_0_0_#192138] space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <InclusaMascot pose="waving" size={60} />
        </div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">
          Welcome to INCLUSA
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-medium">
          Sign in to access your accessibility workspace, documents, and reports.
        </p>
      </div>

      {infoMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{infoMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>

          {isEmailNotConfirmed && (
            <div className="pt-2 border-t border-rose-200 text-[11px] font-normal space-y-2 text-rose-800">
              <p>
                <strong>Email verification required:</strong> Please check your email inbox (and spam folder) for the verification link from Supabase.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={isResending}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend Confirmation Email'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full py-2.5 pl-10 pr-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669] disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-black text-[var(--text-primary)]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-bold text-[#059669] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full py-2.5 pl-10 pr-10 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-black text-slate-400">or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={async () => {
            setIsSubmitting(true);
            await loginAsDemo();
            setIsSubmitting(false);
            router.replace(redirectUrl);
          }}
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-xs border-2 border-purple-300 shadow-[3px_3px_0_0_#7c3aed] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Layers className="h-4 w-4 text-purple-700" />
          <span>⚡ Instant Demo Access / Continue as Guest</span>
        </button>
      </form>

      <div className="pt-4 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)] font-medium">
        Don’t have an account?{' '}
        <Link href="/signup" className="text-[#059669] font-black hover:underline">
          Create an Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16 w-full flex-1 flex flex-col justify-center">
      <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-[var(--text-muted)]">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
