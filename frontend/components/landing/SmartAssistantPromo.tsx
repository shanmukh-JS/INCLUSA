import React from 'react';
import { MessageSquare, Sparkles, Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export const SmartAssistantPromo: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-3">
            <InclusaMascot pose="waving" size={60} />
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-teal-100 border border-teal-300 text-teal-950 text-xs font-black mb-3 inline-block">
            GROUNDED RAG CHATBOT
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Don’t Know Where to Start?{' '}
            <span className="hand-highlight text-[#0284C7]">Meet INCLUSA Assistant.</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
            Ask any question about your document, image, or report. The assistant answers with direct citations and grounded references.
          </p>
        </div>

        {/* Chat Dialogue Mockup */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138] space-y-4">
          
          {/* Message 1: User */}
          <div className="flex justify-end">
            <div className="p-4 rounded-2xl bg-white border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] text-xs font-bold text-[var(--text-primary)] max-w-md">
              “Explain this quarterly report in simple Telugu and summarize the main chart.”
            </div>
          </div>

          {/* Message 2: INCLUSA Assistant */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 p-2 rounded-xl bg-emerald-100 border border-emerald-300">
              <Bot className="h-5 w-5 text-[#059669]" />
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs font-medium text-emerald-950 max-w-lg space-y-2">
              <p className="font-bold">
                ఈ నివేదికలోని ముఖ్యాంశాలు (Executive Summary in Telugu):
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>మొదటి త్రైమాసికం నుండి నాల్గవ త్రైమాసికం వరకు మొత్తం ఆదాయం 85% పెరిగింది.</li>
                <li>క్లౌడ్ మరియు ఆటోమేషన్ రంగాలు అత్యధిక వృద్ధిని సాధించాయి.</li>
              </ul>
              <div className="pt-2 border-t border-emerald-200 text-[10px] font-bold text-emerald-800">
                📌 Citation: Section 2 (Page 2, Quarterly Growth Bar Chart)
              </div>
            </div>
          </div>

          {/* Message 3: User */}
          <div className="flex justify-end">
            <div className="p-4 rounded-2xl bg-white border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] text-xs font-bold text-[var(--text-primary)] max-w-md">
              “Which accessibility issues were detected and resolved?”
            </div>
          </div>

          {/* Message 4: INCLUSA Assistant */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 p-2 rounded-xl bg-emerald-100 border border-emerald-300">
              <Bot className="h-5 w-5 text-[#059669]" />
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs font-medium text-emerald-950 max-w-lg space-y-2">
              <p>
                <strong>4 accessibility barriers</strong> were detected and all <strong>4 have been verified as resolved</strong>:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Missing chart alt text → Reconstructed with full data breakdown.</li>
                <li>14th-grade complex sentences → Simplified to 7th-grade plain language.</li>
                <li>Flat structure → Converted to semantic H1/H2/H3 landmarks.</li>
              </ul>
              <div className="pt-2 border-t border-emerald-200 text-[10px] font-bold text-emerald-800">
                ✨ Verified Score Improvement: 81/100 → 100/100 (+19 Points)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
