'use client';

import React from 'react';
import { Languages, Volume2, Sparkles } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

export const MultilingualSection: React.FC = () => {
  return (
    <ScrollScene id="multilingual-scene" className="py-20 bg-white border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollLayer depth="content" scaleDepth={0.02}>
          <ScrollReveal direction="up" distance={20} duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <ScrollLayer depth="accent" speed={0.14} maxOffset={30} className="flex justify-center mb-4">
                <InclusaMascot
                  pose="reading"
                  size={70}
                  speechText="నమస్కారం! Accessibility in your language!"
                />
              </ScrollLayer>
              <span className="px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black mb-3 inline-block">
                MULTILINGUAL & REGIONAL ACCESSIBILITY
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                Accessibility in Your Language
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
                Accessibility isn&apos;t just about screen readers — it&apos;s about language. INCLUSA provides first-class support for English, Telugu (తెలుగు), and Hindi (हिन्दी) with natural regional speech synthesis.
              </p>
            </div>
          </ScrollReveal>
        </ScrollLayer>

        {/* 3-Language Comparison Cards with 3-Card Depth */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: English (Speed -0.04) */}
          <ScrollLayer depth="midground" speed={-0.04} maxOffset={25}>
            <ScrollReveal direction="up" distance={25} delay={50} duration={750} className="h-full">
              <div className="p-7 rounded-3xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] flex flex-col justify-between h-full hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-[var(--text-primary)]">English</span>
                    <span className="px-2.5 py-1 rounded-full bg-white border border-[var(--border-strong)] text-[10px] font-black">
                      Primary Source
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mb-4">
                    Original and simplified plain English versions with structured headings and audio playback.
                  </p>
                  <div className="p-4 rounded-2xl bg-white border border-[var(--border-strong)] text-xs text-[var(--text-primary)] leading-relaxed italic">
                    &ldquo;Digital accessibility ensures all people, regardless of ability or disability, can perceive, understand, navigate, and interact with information.&rdquo;
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[#059669]">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="h-4 w-4" /> Spoken Audio
                  </span>
                  <span>Grade 7 Level</span>
                </div>
              </div>
            </ScrollReveal>
          </ScrollLayer>

          {/* Card 2: Telugu (Speed +0.02) */}
          <ScrollLayer depth="foreground" speed={0.02} maxOffset={30}>
            <ScrollReveal direction="up" distance={25} delay={100} duration={800} className="h-full">
              <div className="p-7 rounded-3xl bg-amber-50/60 border-3 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138] flex flex-col justify-between h-full relative hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-black text-amber-950">తెలుగు</span>
                      <span className="text-xs text-amber-800 font-bold block">Telugu</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-200 border border-[var(--border-strong)] text-[10px] font-black text-amber-950">
                      Regional Translation
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 font-medium mb-4">
                    Natural Telugu translation with culturally accurate terminology and regional speech narration.
                  </p>
                  <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 text-xs text-amber-950 leading-relaxed font-medium">
                    &ldquo;డిజిటల్ సమాచారం అందరికీ అందుబాటులో ఉండేలా చేయడం — ఎలాంటి వైకల్యం ఉన్నప్పటికీ సమాచారాన్ని సులభంగా అర్థం చేసుకునే అవకాశం.&rdquo;
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-200 flex items-center justify-between text-xs font-black text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="h-4 w-4 text-amber-700" /> తెలుగు ఆడియో
                  </span>
                  <span>పూర్తి అనువాదం</span>
                </div>
              </div>
            </ScrollReveal>
          </ScrollLayer>

          {/* Card 3: Hindi (Speed +0.06) */}
          <ScrollLayer depth="foreground" speed={0.06} maxOffset={35}>
            <ScrollReveal direction="up" distance={25} delay={150} duration={850} className="h-full">
              <div className="p-7 rounded-3xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] flex flex-col justify-between h-full hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-black text-[var(--text-primary)]">हिन्दी</span>
                      <span className="text-xs text-[var(--text-muted)] font-bold block">Hindi</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white border border-[var(--border-strong)] text-[10px] font-black">
                      National Language
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mb-4">
                    Clear Hindi translation preserving document structure, data tables, and bulleted takeaways.
                  </p>
                  <div className="p-4 rounded-2xl bg-white border border-[var(--border-strong)] text-xs text-[var(--text-primary)] leading-relaxed font-medium">
                    &ldquo;डिजिटल सुगमता यह सुनिश्चित करती है कि सभी लोग बिना किसी बाधा के जानकारी को समझ सकें और उसका उपयोग कर सकें।&rdquo;
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[#059669]">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="h-4 w-4" /> हिन्दी ऑडियो
                  </span>
                  <span>सरल भाषा</span>
                </div>
              </div>
            </ScrollReveal>
          </ScrollLayer>
        </div>

        {/* Feature Pills */}
        <ScrollLayer depth="content">
          <ScrollReveal direction="up" distance={18} delay={180} duration={700}>
            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-strong)] flex flex-wrap items-center justify-center gap-6 text-xs font-black text-[var(--text-primary)]">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-[#059669]" />
                <span>Format-Preserving Translation</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-purple-600" />
                <span>Regional Voice Synthesis (Telugu & Hindi)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Cultural Context Awareness</span>
              </div>
            </div>
          </ScrollReveal>
        </ScrollLayer>
      </div>
    </ScrollScene>
  );
};
