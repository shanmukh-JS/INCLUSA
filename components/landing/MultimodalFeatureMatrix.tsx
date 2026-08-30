'use client';

import React from 'react';
import {
  Eye,
  Volume2,
  Mic,
  Languages,
  Brain,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { ScrollStaggerContainer, ScrollStaggerItem } from '@/components/animation/ScrollStagger';

export const MultimodalFeatureMatrix: React.FC = () => {
  const cards = [
    {
      id: 'vision',
      title: 'Image Understanding',
      description: 'Generate accessible descriptions for images, charts and visual information.',
      icon: Eye,
      color: 'bg-sky-100 text-sky-950 border-sky-300',
      badge: 'Alt Text & Data Trends',
    },
    {
      id: 'tts',
      title: 'Read Aloud',
      description: 'Turn digital content into spoken information with synchronized speech playback.',
      icon: Volume2,
      color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      badge: 'Spoken Audio',
    },
    {
      id: 'stt',
      title: 'Speech to Text',
      description: 'Convert spoken information into readable content with synchronized subtitles.',
      icon: Mic,
      color: 'bg-purple-100 text-purple-950 border-purple-300',
      badge: 'Transcripts & Captions',
    },
    {
      id: 'multilingual',
      title: 'Multilingual Access',
      description: 'Translate information into Telugu, Hindi, and regional languages while preserving structure.',
      icon: Languages,
      color: 'bg-amber-100 text-amber-950 border-amber-300',
      badge: 'English ➔ Telugu ➔ Hindi',
    },
    {
      id: 'cognitive',
      title: 'Easy Read',
      description: 'Simplify difficult content into clear, accessible language with key takeaways.',
      icon: Brain,
      color: 'bg-rose-100 text-rose-950 border-rose-300',
      badge: 'Plain Language (Grade 7)',
    },
    {
      id: 'assistant',
      title: 'Accessibility Assistant',
      description: 'Ask questions about your content with context-grounded citations and plain explanations.',
      icon: MessageSquare,
      color: 'bg-teal-100 text-teal-950 border-teal-300',
      badge: 'Grounded Q&A',
    },
  ];

  return (
    <ScrollScene id="feature-matrix-scene" className="py-20 bg-white border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollLayer depth="content" scaleDepth={0.02}>
          <ScrollReveal direction="up" distance={20} duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-3 inline-block">
                UNIVERSAL MULTIMODAL SUITE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                One AI.{' '}
                <span className="hand-highlight text-[#059669]">Many Ways to Access.</span>
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
                People perceive and understand information differently. INCLUSA provides six specialized pathways so everyone participates equally.
              </p>
            </div>
          </ScrollReveal>
        </ScrollLayer>

        {/* 6 Illustrated Cards */}
        <ScrollLayer depth="foreground" speed={0.05} maxOffset={35}>
          <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerMs={75}>
            {cards.map((c, idx) => {
              const Icon = c.icon;
              return (
                <ScrollStaggerItem key={c.id} index={idx}>
                  <div
                    className="group p-7 rounded-3xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#192138] transition-all flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className={`p-3 rounded-2xl border-2 border-[var(--border-strong)] ${c.color} shadow-[2px_2px_0_0_#192138]`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white border border-[var(--border-strong)] text-[var(--text-primary)]">
                          {c.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-[var(--text-primary)] group-hover:text-[#059669] transition-colors mb-2">
                        {c.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-black text-[var(--text-primary)]">
                      <span>Available Across All Ingested Formats</span>
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
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
