import React from 'react';
import { Heart, Sparkles, Shield, Cpu } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

export const AboutInclusaSection: React.FC = () => {
  return (
    <ScrollScene id="about-inclusa-scene" className="py-20 bg-white border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header & Mascot */}
          <div className="text-center mb-12">
            <ScrollLayer depth="foreground" speed={0.08} maxOffset={30} className="flex justify-center mb-4">
              <InclusaMascot
                pose="celebrating"
                size={80}
                speechText="Together for an accessible web!"
              />
            </ScrollLayer>

            <ScrollLayer depth="content" scaleDepth={0.02}>
              <ScrollReveal direction="up" distance={20} duration={700}>
                <span className="px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-950 text-xs font-black mb-3 inline-block">
                  OUR PHILOSOPHY
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                  About INCLUSA
                </h2>
                <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
                  INCLUSA was created with a single, uncompromising belief: that digital information should be fundamentally accessible to every human being, regardless of their visual ability, hearing, neurodiversity, or native language.
                </p>
              </ScrollReveal>
            </ScrollLayer>
          </div>

          {/* 3 Core Pillars */}
          <ScrollLayer depth="foreground" speed={0.05} maxOffset={30}>
            <ScrollReveal direction="up" distance={25} delay={80} duration={800}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-rose-700">
                    <Heart className="h-4 w-4" />
                    <span>Empathy-First AI</span>
                  </div>
                  <h3 className="text-sm font-black text-[var(--text-primary)]">Personalized to Human Needs</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                    We adapt the interface and output to the exact disability profile of the person reading it.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#059669]">
                    <Shield className="h-4 w-4" />
                    <span>Mathematical Proof</span>
                  </div>
                  <h3 className="text-sm font-black text-[var(--text-primary)]">Independent Verification</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                    Every remediation is rigorously re-audited so organizations can trust the accessibility outcome.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#7C3AED]">
                    <Cpu className="h-4 w-4" />
                    <span>Agentic Architecture</span>
                  </div>
                  <h3 className="text-sm font-black text-[var(--text-primary)]">Collaborative Multi-Agent</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                    Six specialized agents coordinate across understanding, auditing, planning, transforming, and explaining.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </ScrollLayer>

          {/* Vision Quote Banner */}
          <ScrollLayer depth="accent" speed={0.07} maxOffset={30}>
            <ScrollReveal direction="up" distance={20} delay={120} duration={750}>
              <div className="p-8 rounded-3xl bg-amber-50 border-3 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138] text-center space-y-3">
                <Sparkles className="h-6 w-6 text-amber-600 mx-auto" />
                <blockquote className="text-base sm:text-lg font-black text-amber-950 italic leading-relaxed">
                  &ldquo;Accessibility is not a barrier to design. It is the highest expression of thoughtful design.&rdquo;
                </blockquote>
                <div className="text-xs font-black text-amber-800">
                  — The INCLUSA Mission
                </div>
              </div>
            </ScrollReveal>
          </ScrollLayer>
        </div>
      </div>
    </ScrollScene>
  );
};
