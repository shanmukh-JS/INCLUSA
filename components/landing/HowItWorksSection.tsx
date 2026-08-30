import React from 'react';
import { UploadCloud, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { ScrollStaggerContainer, ScrollStaggerItem } from '@/components/animation/ScrollStagger';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Give INCLUSA Your Content',
      subtitle: 'Upload any format or URL',
      description: 'Drag & drop a PDF, image, audio file, DOCX, TXT, video, or paste a live website URL into the analyzer.',
      badge: 'PDF • Image • Audio • Video • Web',
      color: 'bg-amber-100 border-amber-300 text-amber-950',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'INCLUSA Understands',
      subtitle: 'Agents analyze & plan',
      description: 'Autonomous AI agents evaluate visual elements, heading hierarchies, language complexity, audio transcripts, and user needs.',
      badge: '6-Agent Autonomous Loop',
      color: 'bg-sky-100 border-sky-300 text-sky-950',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Get Accessible Content',
      subtitle: 'Verified & ready to use',
      description: 'Receive simplified plain text, Telugu/Hindi translations, multi-tier alt descriptions, screen-reader HTML, and verified score improvements.',
      badge: 'Verified WCAG 2.1 Remediations',
      color: 'bg-emerald-100 border-emerald-300 text-emerald-950',
      icon: Sparkles,
    },
  ];

  return (
    <ScrollScene id="how-it-works-scene" className="py-20 bg-[var(--bg-secondary)]/40 border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollLayer depth="content" scaleDepth={0.02}>
          <ScrollReveal direction="up" distance={20} duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-3 inline-block">
                SIMPLE 3-STEP PROCESS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                How INCLUSA Works
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
                From raw, inaccessible files to fully compliant, personalized content in seconds.
              </p>
            </div>
          </ScrollReveal>
        </ScrollLayer>

        {/* 3 Step Cards with Multi-Depth Layering */}
        <ScrollLayer depth="foreground" speed={0.06} maxOffset={35}>
          <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerMs={90}>
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <ScrollStaggerItem key={s.num} index={idx}>
                  <div
                    className="p-8 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138] flex flex-col justify-between relative h-full hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-4xl font-black text-[var(--text-primary)] font-mono">
                          {s.num}
                        </span>
                        <div className={`p-3 rounded-2xl border-2 border-[var(--border-strong)] ${s.color} shadow-[2px_2px_0_0_#192138]`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-[var(--text-primary)] mb-1">
                        {s.title}
                      </h3>
                      <div className="text-xs font-bold text-[#059669] mb-4">
                        {s.subtitle}
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed mb-6">
                        {s.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t-2 border-[var(--border-subtle)] text-[11px] font-black text-[var(--text-primary)]">
                      {s.badge}
                    </div>
                  </div>
                </ScrollStaggerItem>
              );
            })}
          </ScrollStaggerContainer>
        </ScrollLayer>

        {/* Bottom CTA */}
        <ScrollLayer depth="accent" speed={0.08} maxOffset={25} className="mt-12 text-center">
          <ScrollReveal direction="up" distance={18} delay={120} duration={700}>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#192138] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              <span>Start Analyzing Your Content</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </ScrollLayer>
      </div>
    </ScrollScene>
  );
};
