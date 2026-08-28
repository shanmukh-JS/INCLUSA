'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t-2 border-[var(--border-strong)] bg-white py-14">
      <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mascot */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <InclusaMascot pose="helping" size={48} />
              <div>
                <span className="text-xl font-black text-[var(--text-primary)]">INCLUSA</span>
                <p className="text-xs font-bold text-[var(--text-secondary)]">
                  Agentic Multimodal AI Accessibility Platform
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed font-medium">
              Making digital information accessible to everyone through autonomous multimodal understanding, personalized remediation planning, transformation, and verified improvement.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[11px] font-black text-emerald-950">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>WCAG 2.1 AA & AAA Verified Standards</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">Platform</h4>
            <ul className="space-y-2 text-xs font-bold text-[var(--text-secondary)]">
              <li>
                <Link href="/dashboard" className="hover:text-[var(--text-primary)] hover:underline flex items-center gap-1">
                  Accessibility Workspace <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-[var(--text-primary)] hover:underline flex items-center gap-1">
                  Analyze Content <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/website" className="hover:text-[var(--text-primary)] hover:underline flex items-center gap-1">
                  Live Website Auditor <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[var(--text-primary)] hover:underline flex items-center gap-1">
                  Accessibility History <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Accessibility Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">Accessibility</h4>
            <ul className="space-y-2 text-xs font-bold text-[var(--text-secondary)]">
              <li>
                <Link href="/profile" className="hover:text-[var(--text-primary)] hover:underline">
                  Personalize Profile
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const event = new CustomEvent('open-accessibility-toolbar');
                    window.dispatchEvent(event);
                  }}
                  className="hover:text-[var(--text-primary)] hover:underline text-left"
                >
                  Universal Toolbar (Alt + A)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const event = new CustomEvent('open-keyboard-shortcuts');
                    window.dispatchEvent(event);
                  }}
                  className="hover:text-[var(--text-primary)] hover:underline text-left"
                >
                  Keyboard Shortcuts (Alt + K)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} INCLUSA. Built with care for universal human access.
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>Designed for all humans</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
