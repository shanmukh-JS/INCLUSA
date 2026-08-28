'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword, isDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(result.error || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16 w-full flex-1 flex flex-col justify-center">
      <div className="p-8 rounded-3xl border-3 border-[var(--border-strong)] bg-white shadow-[8px_8px_0_0_#192138] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <InclusaMascot pose="thinking" size={60} />
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            Reset Your Password
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Enter your email and we’ll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-sm font-black text-emerald-950">
              Reset Link Dispatched
            </h3>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              If an account with <strong className="font-bold">{email}</strong> exists, you will receive an email shortly with a secure password reset link.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-black text-[#059669] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
                Account Email Address
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Sending instructions...' : 'Send Reset Link'}</span>
            </button>

            <div className="pt-3 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
