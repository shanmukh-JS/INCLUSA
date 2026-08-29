'use client';

import React from 'react';
import { ShieldCheck, CheckCheck, TrendingUp, Sparkles, Scale } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export const VerificationSection: React.FC = () => {
  const weights = [
    { name: 'Vision', pct: '20%', color: 'bg-sky-100 text-sky-950 border-sky-300' },
    { name: 'Cognitive', pct: '20%', color: 'bg-amber-100 text-amber-950 border-amber-300' },
    { name: 'Hearing', pct: '15%', color: 'bg-purple-100 text-purple-950 border-purple-300' },
    { name: 'Language', pct: '15%', color: 'bg-rose-100 text-rose-950 border-rose-300' },
    { name: 'Structure', pct: '15%', color: 'bg-teal-100 text-teal-950 border-teal-300' },
    { name: 'Screen Reader', pct: '15%', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
  ];

  return (
    <section className="py-20 bg-[var(--bg-secondary)]/40 border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-teal-100 border border-teal-300 text-teal-950 text-xs font-black mb-3 inline-block">
            INDEPENDENT VERIFICATION ENGINE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            We Don&apos;t Just Fix It. <span className="text-[#059669]">We Check.</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
            Most AI tools guess when generating text. INCLUSA includes a dedicated Verification Agent (Agent 5) that independently re-audits every generated transformation against WCAG criteria.
          </p>
        </div>

        {/* 4-Step Verification Cycle Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138] mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] space-y-2">
              <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-300">
                1. Initial Audit
              </span>
              <h3 className="text-base font-black text-[var(--text-primary)]">Diagnose Baseline</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Initial document audit evaluates 24 WCAG rules and establishes baseline score (e.g. 42/100).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] space-y-2">
              <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300">
                2. Transformation
              </span>
              <h3 className="text-base font-black text-[var(--text-primary)]">AI-Powered Remediation</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Agent 4 generates plain language, alt text, regional translations, and screen-reader HTML.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] space-y-2">
              <span className="text-xs font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-300">
                3. Second Audit
              </span>
              <h3 className="text-base font-black text-[var(--text-primary)]">Re-Scan Output</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Agent 5 runs an independent audit pass on the newly created content to check for lingering barriers.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] space-y-2">
              <span className="text-xs font-black text-emerald-950 bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-400">
                4. Verified Delta
              </span>
              <h3 className="text-base font-black text-emerald-950">Proven +52 Gain</h3>
              <p className="text-xs text-emerald-900 leading-relaxed">
                System mathematically confirms score reached 94/100 and certifies all detected barriers were resolved.
              </p>
            </div>
          </div>
        </div>

        {/* Weighted Accessibility Score Methodology */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]">
                <Scale className="h-5 w-5 text-amber-800" />
              </div>
              <div>
                <h3 className="text-base font-black text-[var(--text-primary)]">
                  Weighted Accessibility Score
                </h3>
                <p className="text-xs font-medium text-[var(--text-secondary)]">
                  Six dimensions of accessibility, each independently evaluated
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
              Transparent Methodology
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {weights.map((w) => (
              <div
                key={w.name}
                className={`p-4 rounded-2xl border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] text-center ${w.color}`}
              >
                <div className="text-2xl font-mono font-black">{w.pct}</div>
                <div className="text-xs font-black mt-1">{w.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
