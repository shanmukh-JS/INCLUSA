import React from 'react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export const AboutInclusaSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-primary)] border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Mascot */}
            <div className="lg:col-span-4 flex justify-center">
              <InclusaMascot
                pose="helping"
                size={160}
                speechText="Accessibility from the start, not as an afterthought!"
              />
            </div>

            {/* Right: Vision Prose */}
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black inline-block">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                Why We Built INCLUSA
              </h2>
              <blockquote className="text-base sm:text-lg font-bold text-[var(--text-primary)] border-l-4 border-[#059669] pl-4 italic">
                “Accessibility shouldn’t be something added after digital content is created. It should be part of how information is understood, transformed, and delivered from the beginning.”
              </blockquote>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                By combining multimodal vision, cognitive readability modeling, speech synthesis, and verifiable agent verification, INCLUSA transforms how organizations and individuals create universal digital equity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
