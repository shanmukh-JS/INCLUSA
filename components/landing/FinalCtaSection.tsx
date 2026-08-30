import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

export const FinalCtaSection: React.FC = () => {
  return (
    <ScrollScene id="final-cta-scene" className="py-20 bg-[var(--bg-primary)] border-t-2 border-[var(--border-strong)] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollLayer depth="foreground" speed={0.05} maxOffset={35} scaleDepth={0.02}>
          <ScrollReveal direction="up" distance={25} duration={800}>
            <div className="p-8 sm:p-14 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138] relative overflow-hidden text-center max-w-4xl mx-auto">
              
              {/* Mascot Floating with Accent Depth */}
              <ScrollLayer depth="accent" speed={0.12} maxOffset={25} className="flex justify-center mb-6">
                <InclusaMascot
                  pose="celebrating"
                  size={100}
                  speechText="Ready to make your content accessible?"
                />
              </ScrollLayer>

              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-4">
                <Sparkles className="h-4 w-4 text-[#059669]" />
                <span>START YOUR TRANSFORMATION TODAY</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-[1.15] max-w-2xl mx-auto">
                Transform Your Digital Content with{' '}
                <span className="hand-highlight text-[#059669]">INCLUSA</span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 max-w-xl mx-auto leading-relaxed">
                Upload any PDF, image, audio, video, or website. Experience autonomous 6-agent understanding, remediation, and verified mathematical proof in seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Link
                  href="/analyze"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#192138] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                >
                  <span>Analyze Your Content Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/website"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-amber-50 text-[var(--text-primary)] text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
                >
                  <span>Audit a Website URL</span>
                </Link>
              </div>

              {/* Footer Trust Markers */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-6 border-t-2 border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#059669]" />
                  <span>WCAG 2.1 AA / AAA Verified</span>
                </div>
                <span>•</span>
                <span>Autonomous 6-Agent Pipeline</span>
                <span>•</span>
                <span>English • Telugu • Hindi</span>
              </div>
            </div>
          </ScrollReveal>
        </ScrollLayer>
      </div>
    </ScrollScene>
  );
};
