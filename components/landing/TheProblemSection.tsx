'use client';

import React from 'react';
import { EyeOff, FileQuestion, Languages, VolumeX, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const TheProblemSection: React.FC = () => {
  const scenarios = [
    {
      icon: EyeOff,
      title: 'Visual Barriers',
      description: 'Important information can be trapped inside images, charts, and untagged diagrams.',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      tag: 'Visual Barrier',
    },
    {
      icon: FileQuestion,
      title: 'Cognitive Barriers',
      description: 'Complex jargon, dense clauses, and convoluted sentence structures prevent clear understanding.',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      tag: 'Cognitive Barrier',
    },
    {
      icon: Languages,
      title: 'Language Barriers',
      description: 'Information may not be available in the user’s preferred regional language like Telugu or Hindi.',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      tag: 'Language Barrier',
    },
    {
      icon: VolumeX,
      title: 'Media Barriers',
      description: 'Videos and audio recordings may lack synchronized captions, transcripts, or audio descriptions.',
      color: 'bg-sky-50 border-sky-200 text-sky-900',
      tag: 'Media Barrier',
    },
  ];

  return (
    <section className="py-20 bg-[var(--bg-secondary)]/50 border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-950 text-xs font-black mb-3 inline-block">
            THE ACCESSIBILITY GAP
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Information Is Digital.{' '}
            <span className="text-rose-600 underline decoration-rose-300 decoration-wavy">
              Access Isn’t Always.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
            Millions of documents, charts, videos, and websites are published daily with invisible barriers that exclude people with disabilities or language preferences.
          </p>
        </div>

        {/* 4 Illustrated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {scenarios.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-3xl border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl border ${s.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                      {s.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[var(--text-primary)] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* INCLUSA Removes the Barrier Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black text-[#059669]">
              <Sparkles className="h-4 w-4" />
              <span>THE INCLUSA SOLUTION</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              INCLUSA removes the barrier.
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-xl">
              By understanding, auditing, personalizing, transforming, and verifying, our 6-agent system solves each of these barriers in seconds.
            </p>
          </div>

          <Link
            href="/analyze"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-2"
          >
            <span>See It In Action</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
