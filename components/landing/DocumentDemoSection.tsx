'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

export const DocumentDemoSection: React.FC = () => {
  const [isRemediated, setIsRemediated] = useState(true);

  return (
    <ScrollScene id="document-demo-scene" className="py-20 bg-white border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollLayer depth="content" scaleDepth={0.02}>
          <ScrollReveal direction="up" distance={20} duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-3 inline-block">
                MEASURABLE ACCESSIBILITY OUTCOME
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                Accessibility You Can Measure.
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-3 leading-relaxed">
                INCLUSA doesn&apos;t just detect barriers — it understands user needs, plans personalized remediations, transforms the content, and mathematically verifies score improvements.
              </p>
            </div>
          </ScrollReveal>
        </ScrollLayer>

        {/* 42 -> 94 Dominant Transformation Banner with Foreground Depth */}
        <ScrollLayer depth="accent" speed={0.08} maxOffset={40} className="mb-10">
          <ScrollReveal direction="up" distance={22} delay={60} duration={750}>
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border-3 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
                
                {/* Before Baseline Box */}
                <div className="p-5 rounded-2xl bg-white border-2 border-rose-300 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-rose-950 uppercase tracking-wider">
                      Initial Baseline Audit
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-black">
                      Critical Barriers
                    </span>
                  </div>
                  <div className="text-4xl font-black text-rose-600 font-mono">
                    42<span className="text-xl text-[var(--text-muted)] font-normal">/100</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">
                    Missing alt text, complex jargon (Grade 15), unscoped data tables, no audio.
                  </p>
                </div>

                {/* Center Transformation Indicator */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black text-xs shadow-sm">
                    <TrendingUp className="h-4 w-4 mr-1.5 text-[#059669]" />
                    <span>+52 POINTS GAINED</span>
                  </div>
                  <div className="text-xs font-black text-[var(--text-primary)]">
                    Autonomous 6-Agent Remediation
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                    Verified by independent Agent 5 re-audit
                  </p>
                </div>

                {/* After Verified Box */}
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      Verified Outcome
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black">
                      Highly Accessible
                    </span>
                  </div>
                  <div className="text-4xl font-black text-[#059669] font-mono">
                    94<span className="text-xl text-emerald-700 font-normal">/100</span>
                  </div>
                  <p className="text-xs text-emerald-900 mt-2 font-medium">
                    All critical visual & cognitive barriers resolved with mathematical proof.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </ScrollLayer>

        {/* Live Interactive Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Document & Transformation Detail */}
            <ScrollLayer depth="content" className="lg:col-span-7 space-y-4">
              <ScrollReveal direction="up" distance={25} delay={100} duration={800} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#059669]" />
                    <span className="text-sm font-black text-[var(--text-primary)]">
                      Enterprise Annual Financial & Growth Strategy 2025.pdf
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRemediated(!isRemediated)}
                    className={`text-xs font-black px-3.5 py-1.5 rounded-xl border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] transition-all flex items-center gap-1.5 ${
                      isRemediated
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                        : 'bg-[#059669] hover:bg-[#047857] text-white'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isRemediated ? 'Show Baseline (42/100)' : 'Show Remediated (94/100)'}</span>
                  </button>
                </div>

                {/* Active Persona Box */}
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs">
                  <span className="font-black text-amber-950 block mb-1 uppercase tracking-wider text-[11px]">
                    👤 Active Persona: Low Vision + Telugu Speaker + Cognitive Simplification
                  </span>
                  <p className="text-amber-900 font-medium leading-relaxed">
                    INCLUSA reads this profile and plans a tailored remediation: synthesizing detailed chart narratives, translating sections into natural Telugu, generating a Grade 7 plain-language summary, and enabling audio narration.
                  </p>
                </div>

                {/* Remediated Output Preview */}
                <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-sm space-y-3.5">
                  {isRemediated ? (
                    <div className="space-y-3 text-xs leading-relaxed text-[var(--text-primary)]">
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-300 text-emerald-950 shadow-sm">
                        <span className="font-black text-[11px] uppercase tracking-wide block mb-1 text-emerald-900">
                          ✨ 1. Plain Language Executive Summary (Grade 7):
                        </span>
                        Company revenue increased steadily across all quarters, rising from $100M in Q1 to $185M in Q4 (+85% annual growth). Operating margins improved from 18% to 26%.
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-sky-300 text-sky-950 shadow-sm">
                        <span className="font-black text-[11px] uppercase tracking-wide block mb-1 text-sky-900">
                          ✨ 2. Multi-Tier Image & Chart Descriptions (Figure 1):
                        </span>
                        Structured bar chart depicting quarterly revenue: Q1 at $100M, Q2 at $120M, Q3 at $150M, and Q4 at $185M. Clear upward trajectory highlighted for screen-reader users.
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-purple-300 text-purple-950 shadow-sm">
                        <span className="font-black text-[11px] uppercase tracking-wide block mb-1 text-purple-900">
                          ✨ 3. Telugu Translation (తెలుగు సారాంశం):
                        </span>
                        సంస్థ ఆదాయం ప్రతి త్రైమాసికంలో గణనీయంగా పెరిగి, Q1 లో $100 మిలియన్ల నుండి Q4 లో $185 మిలియన్లకు (85% వృద్ధి) చేరుకుంది.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950">
                        <span className="font-black text-[11px] block mb-1 text-rose-800">
                          ⚠️ Critical Barrier: Visual Figure 1 (Missing Alt Text & Data Table)
                        </span>
                        <div className="p-3 bg-white rounded-lg border border-dashed border-rose-400 font-mono text-[11px] text-center text-rose-800">
                          [Image: Quarterly_Revenue_Chart_2025.png - No alt narrative found]
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950">
                        <span className="font-black text-[11px] block mb-1 text-rose-800">
                          ⚠️ High Barrier: Dense Jargon (Flesch-Kincaid Grade 15.4)
                        </span>
                        <p className="italic text-rose-900">
                          “Notwithstanding macroeconomic headwinds and operational friction, enterprise capital optimization yielded accretive margin expansion...”
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </ScrollLayer>

            {/* Right: Personalization Plan & Remediations */}
            <ScrollLayer depth="foreground" speed={0.06} scaleDepth={0.03} className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-sm space-y-5">
              <ScrollReveal direction="up" distance={25} delay={150} duration={800} className="space-y-5">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#059669]">
                    AI-Powered Remediation Plan
                  </span>
                  <h3 className="text-base font-black text-[var(--text-primary)] mt-0.5">
                    Applied Multimodal Transformations
                  </h3>
                </div>

                {/* 5 Applied Remediations */}
                <div className="space-y-2.5 text-xs font-bold text-[var(--text-primary)]">
                  {[
                    { name: 'Image & Chart Descriptions', desc: 'Generated multi-tier alt narratives for Figure 1 & 2' },
                    { name: 'Telugu Regional Translation', desc: 'Translated complete report while preserving tables' },
                    { name: 'Simplified Plain Language', desc: 'Lowered reading complexity from Grade 15 to Grade 7' },
                    { name: 'Audio Narration & TTS', desc: 'Synthesized spoken audio with phrase tracking' },
                    { name: 'Screen Reader Semantic HTML', desc: 'Added WCAG compliant H1-H3 headings & ARIA landmarks' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-[var(--border-strong)] flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-[var(--text-primary)]">{item.name}</span>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href="/analyze?sample=demo-finance-report"
                    className="w-full py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Analyze This File Live</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </ScrollLayer>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
};
