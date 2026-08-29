'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  LogOut,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { user, isLoading, signUp, logout } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  // If already logged in, show clear authenticated state with instant redirect action
  if (!isLoading && user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:py-16 w-full flex-1 flex flex-col justify-center">
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
            <Link
              href="/dashboard"
              className="w-full py-3.5 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
            >
              <Layers className="h-4 w-4" />
              <span>Continue to Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={logout}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-black text-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out / Register New Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLengthValid = password.length >= 6;
  const isMatchValid = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!isLengthValid) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (!isMatchValid) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp({ email, password, fullName });
    setIsSubmitting(false);

    if (result.success) {
      if (result.message) {
        setSuccessMsg(result.message);
      } else {
        router.push('/dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16 w-full flex-1 flex flex-col justify-center">
      <div className="p-8 rounded-3xl border-3 border-[var(--border-strong)] bg-white shadow-[8px_8px_0_0_#192138] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <InclusaMascot pose="celebrating" size={60} />
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            Create Your Account
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Join INCLUSA to analyze, personalize, and verify accessible digital content.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold space-y-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <div className="pt-2 border-t border-emerald-200">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 underline hover:text-emerald-900"
              >
                Go to Sign In &rarr;
              </Link>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Shanmukh Kadali"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669] disabled:opacity-50"
              />
            </div>
          </div>

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
            <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                placeholder="•••••••• (Min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669] disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669] disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)] font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-[#059669] font-black hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
