'use client';

import React, { useState } from 'react';
import {
  Eye,
  ShieldAlert,
  UserCheck,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export const InteractivePipelineVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2); // Default to PERSONALIZE for prominence

  const steps = [
    {
      id: 'understand',
      label: 'UNDERSTAND',
      agent: 'Agent 1: Content Understanding',
      icon: Eye,
      color: 'bg-sky-100 text-sky-900 border-sky-300',
      description: 'Ingests PDF, images, audio, video, website, and text to extract layout, waveforms, and data tables.',
    },
    {
      id: 'audit',
      label: 'AUDIT',
      agent: 'Agent 2: Accessibility Audit',
      icon: ShieldAlert,
      color: 'bg-rose-100 text-rose-900 border-rose-300',
      description: 'Audits 24+ WCAG 2.1 AA/AAA rules to uncover visual, cognitive, hearing, and structural barriers.',
    },
    {
      id: 'personalize',
      label: 'PERSONALIZE',
      agent: 'Agent 3: User Needs Personalization',
      icon: UserCheck,
      color: 'bg-amber-100 text-amber-950 border-amber-400 font-black ring-2 ring-amber-400',
      description: 'Reads individual preferences (Low Vision + Telugu + Simplified) to create a Personalized Transformation Plan.',
      highlight: true,
    },
    {
      id: 'transform',
      label: 'TRANSFORM',
      agent: 'Agent 4: AI-Powered Remediation Engine',
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-900 border-purple-300',
      description: 'Transforms inaccessible content into personalized accessible representations (Alt Text, Telugu, Plain Language).',
    },
    {
      id: 'verify',
      label: 'VERIFY',
      agent: 'Agent 5: Verification Engine',
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Re-audits the transformed output to mathematically prove Before vs. After score improvements.',
    },
    {
      id: 'explain',
      label: 'EXPLAIN',
      agent: 'Agent 6: Explanation Agent',
      icon: TrendingUp,
      color: 'bg-teal-100 text-teal-900 border-teal-300',
      description: 'Generates plain human-understandable summaries of all remediations and benefits for affected user groups.',
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black mb-4">
          <span>THE 6-STAGE AUTONOMOUS WORKFLOW</span>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCurrent = activeStep === idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  isCurrent
                    ? `${s.color} border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] translate-y-[-2px]`
                    : s.highlight
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                    : 'bg-white border-[var(--border-color)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-xl border border-current/20 ${isCurrent ? 'bg-white' : 'bg-[var(--bg-secondary)]'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-black opacity-60">0{idx + 1}</span>
                </div>
                <div className="text-xs font-black text-[var(--text-primary)]">{s.label}</div>
                {s.highlight && (
                  <span className="text-[8px] font-black uppercase text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded mt-1 inline-block">
                    User Profile Driven
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Card */}
        <div className="mt-4 p-6 w-full rounded-3xl bg-white border-2 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#059669] uppercase tracking-wider">
                {steps[activeStep].agent}
              </span>
              {steps[activeStep].highlight && (
                <span className="text-[10px] font-black bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300">
                  User Accessibility Profile → Personalized Transformation Plan
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              {steps[activeStep].description}
            </p>
          </div>
          <div className="shrink-0 text-xs font-black text-amber-950 bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-300">
            Stage {activeStep + 1} of 6
          </div>
        </div>
      </div>
    </div>
  );
};
