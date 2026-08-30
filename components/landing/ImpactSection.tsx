import React from 'react';
import { Award, Zap, Shield, Users } from 'lucide-react';
import { ScrollScene } from '@/components/animation/ScrollScene';
import { ScrollLayer } from '@/components/animation/ScrollLayer';
import { ScrollReveal } from '@/components/animation/ScrollReveal';
import { ScrollStaggerContainer, ScrollStaggerItem } from '@/components/animation/ScrollStagger';

export const ImpactSection: React.FC = () => {
  const stats = [
    {
      icon: Zap,
      value: '10x Faster',
      label: 'Remediation Velocity',
      description: 'Transform complex multimodal files in seconds instead of waiting days for manual accessibility remediation.',
      color: 'bg-amber-100 text-amber-950 border-amber-300',
    },
    {
      icon: Award,
      value: '94 / 100',
      label: 'Average Remediated Score',
      description: 'Typical documents jump from an initial 42 baseline to 94+ verified accessibility score.',
      color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    },
    {
      icon: Shield,
      value: '24+ Rules',
      label: 'WCAG 2.1 Criteria Audited',
      description: 'Covers Vision, Cognitive, Hearing, Language, Semantic Structure, and Screen Reader compatibility.',
      color: 'bg-sky-100 text-sky-950 border-sky-300',
    },
    {
      icon: Users,
      value: '100% Inclusive',
      label: 'Universal Multimodal Design',
      description: 'Built for blind, low-vision, deaf, dyslexic, neurodivergent, and regional language speakers.',
      color: 'bg-purple-100 text-purple-950 border-purple-300',
    },
  ];

  return (
    <ScrollScene id="impact-scene" className="py-20 bg-[var(--bg-secondary)]/40 border-t-2 border-[var(--border-strong)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollLayer depth="content" scaleDepth={0.02}>
          <ScrollReveal direction="up" distance={20} duration={700}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-3 inline-block">
                MEASURABLE HUMAN IMPACT
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                Designed for Real Human Impact
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
                Accessibility is not just a compliance checkbox — it is about ensuring dignity, independence, and equal access to information for every individual.
              </p>
            </div>
          </ScrollReveal>
        </ScrollLayer>

        {/* 4 Cards Grid */}
        <ScrollLayer depth="foreground" speed={0.06} maxOffset={30}>
          <ScrollStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerMs={75}>
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <ScrollStaggerItem key={s.label} index={idx}>
                  <div
                    className="p-7 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[6px_6px_0_0_#192138] flex flex-col justify-between h-full hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                  >
                    <div>
                      <div className={`p-3 rounded-2xl border-2 border-[var(--border-strong)] ${s.color} shadow-[2px_2px_0_0_#192138] w-fit mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-3xl font-black text-[var(--text-primary)] font-mono mb-1">
                        {s.value}
                      </div>
                      <div className="text-xs font-black text-[#059669] mb-3">
                        {s.label}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </ScrollStaggerItem>
              );
            })}
          </ScrollStaggerContainer>
        </ScrollLayer>
      </div>
    </ScrollScene>
  );
};
