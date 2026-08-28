import React from 'react';
import { Languages, MessageSquare, Volume2, Sparkles } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export const MultilingualSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-3">
            <InclusaMascot pose="reading" size={60} />
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-950 text-xs font-black mb-3 inline-block">
            REGIONAL & MULTILINGUAL INCLUSION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Same Information.{' '}
            <span className="hand-highlight text-[#7C3AED]">More Ways to Understand It.</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
            Language barriers shouldn’t block essential healthcare, policy, and educational content. INCLUSA bridges English with regional Indian and global languages while strictly preserving headings and tables.
          </p>
        </div>

        {/* Speech Bubbles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* English Card */}
          <div className="p-7 rounded-3xl bg-[var(--bg-primary)] border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 bg-white px-2.5 py-1 rounded-md border border-[var(--border-strong)]">
                Original English
              </span>
              <span className="text-xs font-bold text-[var(--text-muted)]">Source Format</span>
            </div>
            <h3 className="text-base font-black text-[var(--text-primary)]">Public Health & Monsoon Notice</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic bg-white p-3 rounded-xl border border-[var(--border-color)]">
              “Seasonal heavy precipitation increases vector-borne pathogen transmission risks. Eliminate all stagnant water reservoirs within 24 hours.”
            </p>
          </div>

          {/* Telugu Card */}
          <div className="p-7 rounded-3xl bg-purple-50 border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-950 bg-purple-200 px-2.5 py-1 rounded-md border border-purple-400">
                తెలుగు (Telugu)
              </span>
              <span className="text-xs font-black text-purple-700">Preserved Structure</span>
            </div>
            <h3 className="text-base font-black text-purple-950">ప్రజా ఆరోగ్య సమాచారం</h3>
            <p className="text-xs text-purple-900 leading-relaxed bg-white p-3 rounded-xl border border-purple-200 font-medium">
              “వర్షాకాలంలో వ్యాధులు వ్యాప్తి చెందకుండా ఉండటానికి, మీ నివాస పరిసరాల్లో నిలిచి ఉన్న నీటిని 24 గంటల్లో తొలగించండి.”
            </p>
          </div>

          {/* Hindi Card */}
          <div className="p-7 rounded-3xl bg-amber-50 border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 bg-amber-200 px-2.5 py-1 rounded-md border border-amber-400">
                हिन्दी (Hindi)
              </span>
              <span className="text-xs font-black text-amber-700">Preserved Structure</span>
            </div>
            <h3 className="text-base font-black text-amber-950">सार्वजनिक स्वास्थ्य सूचना</h3>
            <p className="text-xs text-amber-900 leading-relaxed bg-white p-3 rounded-xl border border-amber-200 font-medium">
              “बारिश के मौसम में बीमारियों से बचाव के लिए, अपने घर के आसपास जमा पानी को 24 घंटे के भीतर साफ करें।”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
