import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

export const SmartAssistantPromo: React.FC = () => {
  return (
    <ScrollScene id="smart-assistant-scene" className="py-20 bg-white border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Chatbot Mockup with Foreground Parallax Depth */}
          <ScrollLayer depth="foreground" speed={0.07} maxOffset={40} scaleDepth={0.03} className="lg:col-span-6 order-2 lg:order-1">
            <ScrollReveal direction="up" distance={25} delay={100} duration={800}>
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138] space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-teal-100 border border-teal-300 text-teal-900">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[var(--text-primary)] block">
                        INCLUSA Grounded Assistant
                      </span>
                      <span className="text-[10px] text-[#059669] font-bold">
                        Connected to active document
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-black border border-emerald-300">
                    Active
                  </span>
                </div>

                {/* Conversation */}
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-[var(--border-strong)] ml-6 shadow-sm text-[var(--text-primary)] font-medium">
                    &ldquo;Can you explain Figure 3 in simple words and tell me what the main conclusion is?&rdquo;
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 mr-6 shadow-sm text-emerald-950 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-[#059669]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>INCLUSA Assistant (Grounded Answer)</span>
                    </div>
                    <p className="leading-relaxed font-medium">
                      Figure 3 shows employee satisfaction over 4 years. The main takeaway is that satisfaction grew by <strong>34%</strong> after flexible work policies were introduced in 2023.
                    </p>
                    <div className="pt-2 border-t border-emerald-200 flex items-center gap-2 text-[10px] text-emerald-900 font-bold">
                      <span>Source: Page 4, Section 2.1</span>
                      <span>•</span>
                      <span>Audio playback ready</span>
                    </div>
                  </div>
                </div>

                {/* Input Simulation */}
                <div className="p-2.5 rounded-2xl bg-white border-2 border-[var(--border-strong)] flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
                  <span>Ask any question about this document...</span>
                  <span className="p-1.5 rounded-xl bg-[#059669] text-white">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </ScrollLayer>

          {/* Right: Copy & Highlights */}
          <ScrollLayer depth="content" scaleDepth={0.02} className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <ScrollReveal direction="up" distance={20} duration={700}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 border border-teal-300 text-teal-950 text-xs font-black">
                <Sparkles className="h-4 w-4 text-teal-700" />
                <span>RAG ACCESSIBILITY CHAT</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={22} delay={60} duration={700}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-[1.15]">
                Ask Questions. Get <span className="text-teal-700">Grounded Answers</span>.
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={18} delay={120} duration={700}>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
                Interact with your uploaded documents, images, and audio transcripts through a grounded conversational assistant. Every response includes page and paragraph citations with plain-language explanations.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={18} delay={180} duration={700}>
              <div className="space-y-2.5 text-xs font-bold text-[var(--text-primary)]">
                {[
                  'Context-aware citations linked directly to document source paragraphs',
                  'Instant simplification of complex clauses on demand',
                  'Bilingual responses in Telugu, Hindi, and English',
                  'Interactive read-aloud support for all assistant answers',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={14} delay={240} duration={700}>
              <div className="pt-2">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                >
                  <span>Try the Assistant</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </ScrollLayer>
        </div>
      </div>
    </ScrollScene>
  );
};
