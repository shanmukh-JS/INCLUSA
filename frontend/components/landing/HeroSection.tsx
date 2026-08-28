'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Volume2,
  Video,
  Globe,
  CheckCircle2,
  Eye,
  Languages,
  Brain,
  Layers,
  ArrowDown,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { SAMPLE_DOCUMENTS } from '@/lib/mock/sample-documents';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20 cloud-bg">
      {/* Decorative Organic Blobs */}
      <div className="absolute top-12 left-1/4 w-72 h-72 bg-amber-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-32 right-10 w-80 h-80 bg-sky-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] text-xs font-black text-[var(--text-primary)]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AGENTIC MULTIMODAL AI</span>
            </div>

            {/* Main Headline with Playful Hand Highlight */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.12]">
              Make Digital Information Accessible to{' '}
              <span className="hand-highlight text-[#059669]">Everyone.</span>
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              INCLUSA understands digital content, detects accessibility barriers, personalizes the experience to individual needs, transforms content into accessible formats, and verifies the improvement.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/analyze"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
              >
                <span>Analyze Content</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#demo-section"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-[var(--text-primary)] text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Try Live Demo</span>
              </a>
            </div>

            {/* Supported Formats */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs font-black text-[var(--text-primary)] flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-white border-2 border-[var(--border-strong)] shadow-[1px_1px_0_0_#192138]">PDF</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-xl bg-white border-2 border-[var(--border-strong)] shadow-[1px_1px_0_0_#192138]">IMAGE</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-xl bg-white border-2 border-[var(--border-strong)] shadow-[1px_1px_0_0_#192138]">AUDIO</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-xl bg-white border-2 border-[var(--border-strong)] shadow-[1px_1px_0_0_#192138]">VIDEO</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-xl bg-white border-2 border-[var(--border-strong)] shadow-[1px_1px_0_0_#192138]">TEXT</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-xl bg-white border-2 border-[var(--border-strong)] shadow-[1px_1px_0_0_#192138]">WEBSITE</span>
            </div>
          </div>

          {/* Right Hero Illustration Scene */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Illustrated Paper Background Card */}
            <div className="w-full max-w-md p-8 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138] relative">
              {/* Cloud Badge */}
              <div className="absolute -top-4 -left-4 px-3 py-1 rounded-xl bg-amber-200 border-2 border-[var(--border-strong)] text-[10px] font-black text-amber-950 shadow-[2px_2px_0_0_#192138]">
                ✨ INCLUSA WORLD
              </div>

              {/* Central Mascot */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <InclusaMascot
                    pose="celebrating"
                    size={140}
                    speechText="AI that understands how people need to access content!"
                  />
                </div>
              </div>

              {/* Floating Capability Badges */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t-2 border-[var(--border-subtle)]">
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-sky-600 shrink-0" />
                  <span className="text-[11px] font-bold text-sky-950">Describe Visuals</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                  <Languages className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-950">Translate Telugu/Hindi</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-bold text-amber-950">Simplify Language</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="text-[11px] font-bold text-purple-950">Read Aloud & Audio</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Multimodal Visual: PDF + IMAGE + TEXT + AUDIO + VIDEO + WEBSITE -> INCLUSA MULTIMODAL AI -> Accessible Output */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138]">
          <div className="text-center mb-5">
            <span className="text-xs font-black uppercase tracking-wider text-[#059669]">
              Multimodal Ingestion & Universal Output
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            {/* Left Inputs */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-sm flex-1 w-full">
              <span className="text-[10px] font-black uppercase text-[var(--text-muted)] block mb-2">
                1. Any Digital Format
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-mono font-black text-[var(--text-primary)]">
                <span className="px-2.5 py-1 bg-white rounded-lg border border-[var(--border-strong)]">PDF</span>
                <span>+</span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-[var(--border-strong)]">IMAGE</span>
                <span>+</span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-[var(--border-strong)]">TEXT</span>
                <span>+</span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-[var(--border-strong)]">AUDIO</span>
                <span>+</span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-[var(--border-strong)]">VIDEO</span>
                <span>+</span>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-[var(--border-strong)]">WEBSITE</span>
              </div>
            </div>

            <div className="text-2xl font-black text-[#059669] shrink-0 rotate-90 md:rotate-0">
              →
            </div>

            {/* Center Engine */}
            <div className="p-4 rounded-2xl bg-amber-100 border-3 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] flex-1 w-full">
              <span className="text-[10px] font-black uppercase text-amber-950 block mb-1">
                2. Autonomous Pipeline
              </span>
              <div className="text-sm font-black text-[var(--text-primary)]">
                INCLUSA MULTIMODAL AI
              </div>
              <p className="text-[10px] text-amber-950 font-bold mt-1">
                Understand → Audit → Personalize → Transform → Verify
              </p>
            </div>

            <div className="text-2xl font-black text-[#059669] shrink-0 rotate-90 md:rotate-0">
              →
            </div>

            {/* Right Output */}
            <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 shadow-sm flex-1 w-full">
              <span className="text-[10px] font-black uppercase text-emerald-900 block mb-1">
                3. Verified Result
              </span>
              <div className="text-sm font-black text-emerald-950">
                Accessible Output
              </div>
              <p className="text-[10px] text-emerald-900 font-bold mt-1">
                Plain Text • Alt Narratives • Telugu • Audio
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Interactive Demo Launcher Bar */}
        <div id="demo-section" className="mt-12 pt-8 border-t-2 border-[var(--border-strong)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#059669]">
                1-Click Interactive Demonstration
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                Try INCLUSA on Real Multimodal Content
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-medium max-w-sm">
              Click any sample below to watch the 6-agent autonomous pipeline execute live in real time:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_DOCUMENTS.map((doc) => (
              <Link
                key={doc.id}
                href={`/analyze?sample=${doc.id}`}
                className="group p-5 rounded-2xl bg-white border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#192138] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                      {doc.tag}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                      {doc.inputType}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-[#059669] transition-colors line-clamp-2 mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-medium">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-black text-[#059669]">
                  <span>Launch Live Demo</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
