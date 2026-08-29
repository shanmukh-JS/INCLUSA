'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Wand2,
  FileSearch,
  UserCheck,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export const JudgeExplainerWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const stages = [
    {
      num: '1',
      icon: FileSearch,
      name: 'Understand',
      tagline: '“I read and parse your multimodal document.”',
      description: 'Extracts headings, paragraphs, images, data tables, and measures reading complexity.',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      num: '2',
      icon: ShieldAlert,
      name: 'Audit',
      tagline: '“I find accessibility barriers across 6 categories.”',
      description: 'Tests against WCAG 2.1 AA/AAA rules for Vision, Cognitive, Hearing, Language, and Structure.',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      num: '3',
      icon: UserCheck,
      name: 'Personalize',
      tagline: '“I tailor remediations to your preferences.”',
      description: 'Maps user selections (e.g. Telugu, Plain Language, Audio, Screen Reader) without diagnosing disabilities.',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      num: '4',
      icon: Wand2,
      name: 'Transform',
      tagline: '“I synthesize accessible multimodal formats.”',
      description: 'Generates plain language summaries, regional translations, alt-text descriptions, and semantic HTML.',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      num: '5',
      icon: CheckCircle2,
      name: 'Verify',
      tagline: '“I re-audit to measure verified improvement.”',
      description: 'Re-runs audit rules on the output to calculate real Before vs. After score deltas and resolved barrier counts.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      num: '6',
      icon: Award,
      name: 'Explain',
      tagline: '“I explain what changed and who benefits.”',
      description: 'Compiles human-readable summaries showing who benefits and remaining recommendations.',
      color: 'bg-teal-50 border-teal-200 text-teal-900',
      badgeColor: 'bg-teal-600 text-white',
    },
  ];

  return (
    <div className="rounded-3xl border-3 border-[var(--border-strong)] bg-white p-5 sm:p-6 shadow-[5px_5px_0_0_#192138] transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-900">
            <Sparkles className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                10-Second Guide for Judges
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-[var(--text-primary)] mt-0.5">
              What is INCLUSA Doing?
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[var(--border-strong)] bg-amber-50 hover:bg-amber-100 text-xs font-black text-[var(--text-primary)] shadow-[2px_2px_0_0_#192138] transition-all"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'Hide Guide' : 'Explain Pipeline'}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 pt-5 border-t-2 border-[var(--border-subtle)] space-y-4 animate-fade-in">
          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
            <strong className="text-[var(--text-primary)] font-black">Why this is Agentic AI: </strong>
            Instead of a single one-shot chatbot response, INCLUSA coordinates six specialized autonomous agents. Each agent receives verified outputs from the previous agent, transforms the content across multiple modalities, and independently verifies measurable compliance gains.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.num}
                  className={`p-4 rounded-2xl border-2 ${stage.color} flex flex-col justify-between shadow-sm`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${stage.badgeColor}`}>
                          {stage.num}
                        </span>
                        <span className="text-xs font-black text-[var(--text-primary)]">
                          Agent {stage.num} — {stage.name}
                        </span>
                      </div>
                      <Icon className="h-4 w-4 opacity-80" />
                    </div>
                    <p className="text-xs font-black italic text-[var(--text-primary)] mb-1">
                      {stage.tagline}
                    </p>
                    <p className="text-[11px] font-medium opacity-90 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
