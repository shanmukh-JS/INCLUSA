import React from 'react';
import { VerificationResult } from '@/types';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface BeforeAfterViewProps {
  verification: VerificationResult;
}

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({ verification }) => {
  const { beforeScore, afterScore, scoreImprovement, totalIssuesDetected, issuesResolved, issuesRemaining, resolvedIssues } = verification;

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-[var(--border-strong)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" /> Verified Accessibility Delta
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Before vs. After Verification
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
            Mathematical proof of accessibility barrier elimination and score improvement
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138]">
          <TrendingUp className="h-7 w-7 text-[#059669] shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-black text-[#059669] block">Total Improvement</span>
            <span className="text-2xl font-black font-mono text-emerald-950">+{scoreImprovement} Points</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* BEFORE CARD */}
        <div className="p-6 rounded-2xl border-2 border-rose-300 bg-rose-50/50 shadow-[3px_3px_0_0_#FDA4AF]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-rose-800">
              BEFORE REMEDIATION
            </span>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-950 border border-rose-400">
              {beforeScore.status}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-black font-mono text-rose-700">{beforeScore.overallScore}</span>
            <span className="text-sm font-bold text-[var(--text-muted)]">/ 100</span>
          </div>

          <div className="space-y-2 text-xs text-[var(--text-secondary)]">
            <div className="flex justify-between py-1 border-b border-rose-200 font-medium">
              <span>Total Barriers Detected:</span>
              <span className="font-bold text-[var(--text-primary)]">{totalIssuesDetected}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rose-200 font-medium">
              <span>Critical Severity Issues:</span>
              <span className="font-bold text-rose-700">{beforeScore.criticalIssues}</span>
            </div>
            <div className="flex justify-between py-1 font-medium">
              <span>Passed WCAG Checks:</span>
              <span className="font-bold text-[var(--text-primary)]">{beforeScore.passedChecks}</span>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="p-6 rounded-2xl border-2 border-[var(--border-strong)] bg-emerald-50 shadow-[4px_4px_0_0_#192138]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
              AFTER INCLUSA REMEDIATION
            </span>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-400">
              {afterScore.status}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-black font-mono text-emerald-800">{afterScore.overallScore}</span>
            <span className="text-sm font-bold text-[var(--text-muted)]">/ 100</span>
            <span className="ml-auto text-xs font-black text-emerald-950 bg-emerald-200 border border-emerald-400 px-2.5 py-1 rounded-lg">
              +{scoreImprovement} GAIN
            </span>
          </div>

          <div className="space-y-2 text-xs text-[var(--text-secondary)]">
            <div className="flex justify-between py-1 border-b border-emerald-200 font-medium">
              <span>Barriers Successfully Resolved:</span>
              <span className="font-black text-emerald-900">
                {issuesResolved} of {totalIssuesDetected}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-emerald-200 font-medium">
              <span>Critical Issues Remaining:</span>
              <span className="font-black text-emerald-900">{afterScore.criticalIssues}</span>
            </div>
            <div className="flex justify-between py-1 font-medium">
              <span>Passed WCAG Checks:</span>
              <span className="font-black text-emerald-900">{afterScore.passedChecks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resolved Barriers Checklist */}
      <div className="mt-6 pt-5 border-t-2 border-[var(--border-strong)]">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#059669]" />
          <span>Verified Resolved Barriers ({resolvedIssues.length}):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resolvedIssues.map((iss) => (
            <div
              key={iss.id}
              className="p-3.5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] flex items-start gap-2.5 text-xs shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[var(--text-primary)]">{iss.title}</div>
                <div className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">{iss.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
