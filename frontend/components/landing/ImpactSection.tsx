import React from 'react';
import { UserCheck, Sparkles, GraduationCap, Building2, HeartHandshake } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const outcomes = [
    {
      icon: UserCheck,
      title: 'More Independent Access',
      description: 'Digital information can be experienced independently across audio, visual, and simplified plain language channels.',
      color: 'bg-sky-100 text-sky-950 border-sky-300',
    },
    {
      icon: HeartHandshake,
      title: 'Better Communication',
      description: 'Speech, text, captions, transcripts, and regional translations collaborate harmoniously without data loss.',
      color: 'bg-purple-100 text-purple-950 border-purple-300',
    },
    {
      icon: GraduationCap,
      title: 'More Inclusive Education',
      description: 'Complex research papers, medical advisories, and technical texts become accessible to neurodivergent and ESL learners.',
      color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    },
    {
      icon: Building2,
      title: 'More Accessible Public Services',
      description: 'Public health advisories, citizen portals, and corporate reports meet universal standards from day one.',
      color: 'bg-amber-100 text-amber-950 border-amber-300',
    },
  ];

  return (
    <section className="py-20 bg-[var(--bg-secondary)]/40 border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-3 inline-block">
            MEANINGFUL REAL-WORLD OUTCOMES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Designed for Everyone.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
            Accessibility is not a compliance checkbox. It is an act of human inclusion that opens doors for millions.
          </p>
        </div>

        {/* 4 Outcome Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((o, idx) => {
            const Icon = o.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] flex flex-col justify-between"
              >
                <div>
                  <div className={`p-3 rounded-2xl border ${o.color} w-fit mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-[var(--text-primary)] mb-2">
                    {o.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                    {o.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
