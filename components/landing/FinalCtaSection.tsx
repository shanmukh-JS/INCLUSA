import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, PlusCircle } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-amber-50/70 border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[10px_10px_0_0_#192138] text-center max-w-4xl mx-auto space-y-6">
          
          <div className="flex justify-center">
            <InclusaMascot pose="celebrating" size={130} />
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black inline-block">
            READY TO TRANSFORM YOUR CONTENT?
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Make Information More Accessible Today.
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium max-w-xl mx-auto leading-relaxed">
            Give INCLUSA a document, image, audio file, video, text, or website. Let the six autonomous agents do the rest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/analyze"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#192138] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Analyze Content Now</span>
            </Link>

            <Link
              href="/analyze?sample=demo-finance-report"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-amber-50 text-[var(--text-primary)] text-sm font-black border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#192138] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Launch Interactive Demo</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
