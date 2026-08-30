'use client';

import React from 'react';
import { Eye, ShieldAlert, UserCheck, Sparkles, CheckCheck, MessageSquare } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { ScrollStaggerContainer, ScrollStaggerItem } from '@/components/animation/ScrollStagger';

export const SixAgentsSection: React.FC = () => {
  const agents = [
    {
      num: '01',
      title: 'Content Understanding',
      question: '“What is inside this digital content?”',
      description: 'Ingests PDF, images, audio, video, website, and text to extract layout, waveforms, and data tables.',
      icon: Eye,
      color: 'bg-sky-100 text-sky-900 border-sky-300',
    },
    {
      num: '02',
      title: 'Accessibility Audit',
      question: '“Where are the accessibility barriers?”',
      description: 'Audits 24+ WCAG 2.1 rules across Vision, Cognitive, Hearing, Language, Structure, and Screen Reader.',
      icon: ShieldAlert,
      color: 'bg-rose-100 text-rose-900 border-rose-300',
    },
    {
      num: '03',
      title: 'User Needs (Personalization)',
      question: '“What does this specific user need?”',
      description: 'Reads individual disability profiles (Low Vision + Telugu speaker + Simplified) to create a tailored plan.',
      icon: UserCheck,
      color: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      num: '04',
      title: 'Transformation Engine',
      question: '“How should we remediate the content?”',
      description: 'AI-powered remediation engine synthesizing plain language, chart alt text, Telugu translations, and audio.',
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-900 border-purple-300',
    },
    {
      num: '05',
      title: 'Verification Engine',
      question: '“Did accessibility actually improve?”',
      description: 'Re-audits transformed content to mathematically verify and prove Before vs. After score improvements.',
      icon: CheckCheck,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    {
      num: '06',
      title: 'Explanation Agent',
      question: '“What changed, why, and who benefits?”',
      description: 'Compiles human-readable summaries of all remediations and benefits for affected user groups.',
      icon: MessageSquare,
      color: 'bg-teal-100 text-teal-900 border-teal-300',
    },
  ];

  return (
    <ScrollScene id="six-agents-scene" className="py-20 bg-white border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollLayer depth="content" scaleDepth={0.02}>
          <ScrollReveal direction="up" distance={20} duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <ScrollLayer depth="accent" speed={0.14} maxOffset={30} className="flex justify-center mb-4">
                <InclusaMascot pose="magnifying" size={70} />
              </ScrollLayer>
              <span className="px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-950 text-xs font-black mb-3 inline-block">
                AUTONOMOUS ARCHITECTURE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                Six Agents. <span className="text-[#7C3AED]">One Mission.</span>
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
                Instead of a single superficial model, INCLUSA coordinates six specialized agents that collaborate to ensure verified accessibility improvements.
              </p>
            </div>
          </ScrollReveal>
        </ScrollLayer>

        {/* 6 Agent Cards Grid with Layered Depth */}
        <ScrollLayer depth="foreground" speed={0.05} maxOffset={35}>
          <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerMs={70}>
            {agents.map((a, idx) => {
              const Icon = a.icon;
              return (
                <ScrollStaggerItem key={a.num} index={idx}>
                  <div
                    className="p-7 rounded-3xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#192138] transition-all flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-[var(--text-muted)] opacity-50 font-mono">
                          {a.num}
                        </span>
                        <div className={`p-2.5 rounded-2xl border ${a.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-[var(--text-primary)] mb-1">
                        {a.title}
                      </h3>
                      <div className="text-xs font-extrabold text-[#7C3AED] mb-3 italic">
                        {a.question}
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                        {a.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-[var(--border-color)] text-[11px] font-black text-[var(--text-muted)] flex items-center justify-between">
                      <span>Agent {a.num}</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </ScrollStaggerItem>
              );
            })}
          </ScrollStaggerContainer>
        </ScrollLayer>
      </div>
    </ScrollScene>
  );
};
