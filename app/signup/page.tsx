'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isDemoMode } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLengthValid = password.length >= 6;
  const isMatchValid = password.length > 0 && password === confirmPassword;

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      if (isDemoMode) {
        router.push('/dashboard');
      } else {
        setSuccessMsg('Account created successfully! If email confirmation is enabled in your Supabase project, please check your inbox to confirm your email before signing in.');
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
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold space-y-2">
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
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
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
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669]"
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
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669]"
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
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669]"
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
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669]"
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
