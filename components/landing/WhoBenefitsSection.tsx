import React from 'react';
import { Eye, Headphones, Brain, Languages, BookOpen, Sparkles } from 'lucide-react';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { ScrollStaggerContainer, ScrollStaggerItem } from '@/components/animation/ScrollStagger';

export const WhoBenefitsSection: React.FC = () => {
  const personas = [
    {
      icon: Eye,
      title: 'Visual Accessibility',
      subtitle: 'Blind & Low Vision',
      barrier: 'Complex infographics, unscoped data tables, missing alt descriptions, and poor contrast.',
      howInclusaHelps: 'Synthesizes concise alt text, detailed numerical trends, table column scopes, and high-contrast views.',
      tag: 'Screen Reader & Braille',
      color: 'bg-sky-100 text-sky-950 border-sky-300',
    },
    {
      icon: Headphones,
      title: 'Hearing Accessibility',
      subtitle: 'Deaf & Hard of Hearing',
      barrier: 'Podcast recordings, webinars, and audio announcements without captions or speaker separation.',
      howInclusaHelps: 'Generates speaker-identified transcripts, interactive timestamp navigation, and WebVTT caption tracks.',
      tag: 'Synchronized Text',
      color: 'bg-purple-100 text-purple-950 border-purple-300',
    },
    {
      icon: Brain,
      title: 'Cognitive Accessibility',
      subtitle: 'Dyslexia, ADHD & Neurodivergence',
      barrier: 'Dense academic jargon, walls of text, and low readability layouts causing cognitive fatigue.',
      howInclusaHelps: 'Transforms text to 7th-grade plain language with bulleted key takeaways, dyslexia font, and focus reading mode.',
      tag: 'Plain Language (Flesch-Kincaid)',
      color: 'bg-amber-100 text-amber-950 border-amber-300',
    },
    {
      icon: Languages,
      title: 'Language & Regional Inclusion',
      subtitle: 'Multilingual & Non-Native Speakers',
      barrier: 'Public notices and medical information published exclusively in complex English.',
      howInclusaHelps: 'Provides accurate Telugu (తెలుగు) and Hindi (हिन्दी) translations while strictly preserving document structure.',
      tag: 'Regional Inclusion',
      color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    },
    {
      icon: BookOpen,
      title: 'Reading & Assistive Navigation',
      subtitle: 'Assistive Tech & Keyboard Users',
      barrier: 'Broken heading levels, trapped keyboard focus, ambiguous "click here" links, and missing landmarks.',
      howInclusaHelps: 'Rebuilds semantic HTML5 with proper H1-H3 trees, ARIA landmarks, and keyboard shortcuts.',
      tag: 'WCAG 2.1 AA / AAA',
      color: 'bg-rose-100 text-rose-950 border-rose-300',
    },
  ];

  return (
    <ScrollScene id="who-benefits-scene" className="py-20 bg-white border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollLayer depth="content" scaleDepth={0.02}>
          <ScrollReveal direction="up" distance={20} duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-950 text-xs font-black mb-3 inline-block">
                BUILT AROUND REAL ACCESS NEEDS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                Who Benefits from INCLUSA?
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
                Digital information should be an open door, not a barrier. See how INCLUSA tailors content for distinct human needs.
              </p>
            </div>
          </ScrollReveal>
        </ScrollLayer>

        {/* 5 Persona Cards with Layered Staggered Entrance */}
        <ScrollLayer depth="foreground" speed={0.05} maxOffset={35}>
          <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerMs={75}>
            {personas.map((p, i) => {
              const Icon = p.icon;
              return (
                <ScrollStaggerItem key={i} index={i}>
                  <div
                    className="p-7 rounded-3xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#192138] transition-all flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl border ${p.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white border border-[var(--border-strong)] text-[var(--text-primary)]">
                          {p.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-[var(--text-primary)]">{p.title}</h3>
                      <div className="text-xs font-bold text-[#059669] mb-4">{p.subtitle}</div>

                      <div className="mb-4">
                        <div className="text-[11px] font-black text-rose-700 uppercase tracking-wider mb-1">
                          Barrier:
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {p.barrier}
                        </p>
                      </div>

                      <div>
                        <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wider mb-1">
                          INCLUSA Solution:
                        </div>
                        <p className="text-xs text-emerald-950 font-semibold leading-relaxed bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                          {p.howInclusaHelps}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center gap-1.5 text-[11px] font-black text-[var(--text-primary)]">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Personalized via User Needs Agent</span>
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
