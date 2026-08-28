import React from 'react';
import { DashboardStats } from '@/types';
import { FileCheck2, TrendingUp, CheckCircle2, Award, Info } from 'lucide-react';

interface MetricsGridProps {
  stats: DashboardStats;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Analyses',
      value: stats.totalAnalyses,
      sub: 'Documents, Audio & Media processed',
      icon: FileCheck2,
      color: 'bg-sky-100 text-sky-950 border-sky-300',
    },
    {
      title: 'Weighted Accessibility Score',
      value: `${stats.averageScore}/100`,
      sub: stats.totalAnalyses > 0
        ? 'Vision 20% · Cognitive 20% · Hearing 15% · Language 15% · Structure 15% · Screen Reader 15%'
        : 'No analyses performed yet',
      icon: Award,
      color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    },
    {
      title: 'Issues Resolved',
      value: stats.issuesResolvedTotal,
      sub: `${stats.issuesDetectedTotal} barriers detected across analyses`,
      icon: CheckCircle2,
      color: 'bg-purple-100 text-purple-950 border-purple-300',
    },
    {
      title: 'Avg. Score Improvement',
      value: `+${stats.averageImprovement} pts`,
      sub: 'Verified Before vs After gain',
      icon: TrendingUp,
      color: 'bg-amber-100 text-amber-950 border-amber-300',
    },
  ];

  return (
    <div>
      {/* Demo Data Label */}
      {stats.totalAnalyses === 0 && (
        <div className="flex items-center gap-2 mb-4 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-950">
          <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Example Organization Workspace — analyze content to populate real metrics.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wide">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)] font-mono tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] font-medium text-[var(--text-muted)] mt-2">
                {card.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
