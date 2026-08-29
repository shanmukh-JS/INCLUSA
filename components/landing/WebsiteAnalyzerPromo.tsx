import React from 'react';
import { Globe, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const WebsiteAnalyzerPromo: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--bg-secondary)]/40 border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-950 text-xs font-black inline-block">
                LIVE WEB CRAWLER & AUDITOR
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                What About Live Websites?
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
                Beyond static documents, INCLUSA crawls public web URLs to inspect DOM trees, verify missing alt attributes, detect broken heading sequences, validate form labels, and check language declarations.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs font-bold text-[var(--text-primary)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  <span>Images & Alt Attributes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  <span>H1-H3 Heading Tree Hierarchy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  <span>Unlabelled Buttons & Inputs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  <span>HTML Language & Landmarks</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/website"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                >
                  <span>Analyze a Public Website</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Mockup */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-color)]">
                <Globe className="h-4 w-4 text-sky-600" />
                <span className="text-xs font-mono text-[var(--text-muted)] truncate">
                  https://example.gov
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[var(--border-color)] flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">DOM Nodes Inspected</span>
                  <span className="font-mono font-black text-sky-700">142 Elements</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[var(--border-color)] flex items-center justify-between">
                  <span className="font-bold text-rose-700">Images Missing Alt</span>
                  <span className="font-mono font-black text-rose-700">3 Found</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[var(--border-color)] flex items-center justify-between">
                  <span className="font-bold text-amber-700">Heading Tree Skips</span>
                  <span className="font-mono font-black text-amber-700">1 (H1 → H3)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[var(--border-color)] flex items-center justify-between">
                  <span className="font-bold text-emerald-700">Language Declaration</span>
                  <span className="font-mono font-black text-emerald-700">lang=&quot;en&quot;</span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
