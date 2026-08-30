import React from 'react';
import Link from 'next/link';
import { Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';

export const WebsiteAnalyzerPromo: React.FC = () => {
  return (
    <ScrollScene id="website-analyzer-scene" className="py-20 bg-[var(--bg-secondary)]/40 border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Text & CTA */}
          <ScrollLayer depth="content" scaleDepth={0.02} className="lg:col-span-6 space-y-6">
            <ScrollReveal direction="up" distance={20} duration={700}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-950 text-xs font-black">
                <Globe className="h-4 w-4 text-sky-700" />
                <span>REAL-TIME URL AUDITOR</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={22} delay={60} duration={700}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-[1.15]">
                Audit Any Website in <span className="text-sky-700">Real Time</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={18} delay={120} duration={700}>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
                Paste any live URL and INCLUSA will analyze its DOM structure, color contrast ratios, heading hierarchy, image alt coverage, ARIA landmarks, and keyboard navigability against WCAG 2.1 AA guidelines.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={18} delay={180} duration={700}>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/website"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Website Auditor</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={14} delay={240} duration={700}>
              <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-secondary)] pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#059669]" />
                  <span>WCAG 2.1 AA/AAA</span>
                </div>
                <span>•</span>
                <span>Automated Fix Code</span>
                <span>•</span>
                <span>Instant Score (0-100)</span>
              </div>
            </ScrollReveal>
          </ScrollLayer>

          {/* Right: Interactive Browser Mockup with Foreground Parallax Depth */}
          <ScrollLayer depth="foreground" speed={0.07} maxOffset={40} scaleDepth={0.03} className="lg:col-span-6">
            <ScrollReveal direction="up" distance={25} delay={100} duration={800}>
              <div className="p-6 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138] space-y-4">
                {/* Browser Address Bar */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)]">
                  <div className="flex items-center gap-1 px-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 px-3 py-1 rounded-lg bg-white border border-[var(--border-strong)] text-[11px] font-mono font-bold text-[var(--text-primary)] truncate">
                    https://example-university.edu/admissions
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#059669] text-white text-[10px] font-black">
                    Audit
                  </span>
                </div>

                {/* Audit Result Simulation */}
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-amber-950 block">Accessibility Health Score</span>
                      <span className="text-[10px] text-amber-900 font-bold">14 WCAG issues detected</span>
                    </div>
                    <div className="text-3xl font-mono font-black text-amber-700">
                      58<span className="text-sm font-normal text-amber-900">/100</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-rose-200 text-rose-950 font-bold flex items-center justify-between">
                      <span>4 images missing descriptive alt text</span>
                      <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">Critical</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-amber-950 font-bold flex items-center justify-between">
                      <span>Low contrast on primary CTA button (2.8:1 vs 4.5:1)</span>
                      <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">Warning</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-sky-200 text-sky-950 font-bold flex items-center justify-between">
                      <span>Skipped heading level (H1 straight to H4)</span>
                      <span className="text-[10px] font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">Moderate</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-black text-[#059669] pt-1">
                  <span>✨ 1-Click Code Remediations Available</span>
                  <Link href="/website" className="hover:underline">Try Auditor ➔</Link>
                </div>
              </div>
            </ScrollReveal>
          </ScrollLayer>
        </div>
      </div>
    </ScrollScene>
  );
};
