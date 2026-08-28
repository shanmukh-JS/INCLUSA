import React from 'react';
import { AccessibilityScoreResult } from '@/types';
import { ScoreGauge } from './ScoreGauge';
import {
  Eye,
  Brain,
  Volume2,
  Languages,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ScoreCardProps {
  scoreResult: AccessibilityScoreResult;
  title?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  scoreResult,
  title = 'Accessibility Compliance Score',
}) => {
  const cats = [
    { label: 'Vision Accessibility', score: scoreResult.categories.vision, weight: '20%', icon: Eye, color: 'text-sky-700', stroke: 'bg-sky-500' },
    { label: 'Cognitive & Reading', score: scoreResult.categories.cognitive, weight: '20%', icon: Brain, color: 'text-purple-700', stroke: 'bg-purple-500' },
    { label: 'Hearing Accessibility', score: scoreResult.categories.hearing, weight: '15%', icon: Volume2, color: 'text-amber-700', stroke: 'bg-amber-500' },
    { label: 'Language Inclusion', score: scoreResult.categories.language, weight: '15%', icon: Languages, color: 'text-emerald-700', stroke: 'bg-emerald-500' },
    { label: 'Document Structure', score: scoreResult.categories.structure, weight: '15%', icon: Layers, color: 'text-rose-700', stroke: 'bg-rose-500' },
    { label: 'Screen Reader Readiness', score: scoreResult.categories.screenReader, weight: '15%', icon: Sparkles, color: 'text-teal-700', stroke: 'bg-teal-500' },
  ];

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-[var(--border-strong)]">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#059669]">
            Algorithmic WCAG 2.1 Audit
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1 max-w-md">
            Computed mathematically from detected barriers across all 6 weighted categories.
          </p>
        </div>

        <div className="shrink-0">
          <ScoreGauge scoreResult={scoreResult} size="lg" />
        </div>
      </div>

      {/* 6 Category Breakdown Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${c.color}`} />
                  <span className="text-xs font-black text-[var(--text-primary)]">{c.label}</span>
                </div>
                <span className="text-xs font-mono font-black text-[var(--text-primary)]">
                  {c.score}/100
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-white border border-[var(--border-color)] overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.stroke} transition-all duration-700`}
                  style={{ width: `${c.score}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] mt-1.5">
                <span>Weight: {c.weight}</span>
                <span>{c.score >= 90 ? 'Passed' : c.score >= 50 ? 'Barriers' : 'Critical'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
