'use client';

import React, { useState } from 'react';
import { AccessibilityIssue, RuleCategory, SeverityLevel } from '@/types';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  MapPin,
  HelpCircle,
  Users,
  Search,
  Filter,
  Wand2,
} from 'lucide-react';

interface IssueExplorerProps {
  issues: AccessibilityIssue[];
  onFixWithAi?: (issue: AccessibilityIssue) => void;
}

export const IssueExplorer: React.FC<IssueExplorerProps> = ({
  issues,
  onFixWithAi,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(issues[0]?.id || null);

  const getSeverityBadge = (sev: SeverityLevel, isResolved?: boolean) => {
    if (isResolved) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
          <CheckCircle2 className="h-3 w-3 text-emerald-700" /> Resolved
        </span>
      );
    }
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-950 border border-rose-300">
            <AlertCircle className="h-3 w-3 text-rose-700" /> Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300">
            <AlertTriangle className="h-3 w-3 text-amber-700" /> High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-950 border border-sky-300">
            <Info className="h-3 w-3 text-sky-700" /> Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-300">
            Low
          </span>
        );
    }
  };

  const filteredIssues = issues.filter((iss) => {
    if (severityFilter === 'resolved' && !iss.isResolved) return false;
    if (severityFilter !== 'all' && severityFilter !== 'resolved' && iss.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        iss.title.toLowerCase().includes(q) ||
        iss.description.toLowerCase().includes(q) ||
        iss.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-[var(--border-strong)]">
        <div>
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <span>Detected Accessibility Barriers</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-xs font-mono font-black text-amber-950">
              {filteredIssues.length} of {issues.length}
            </span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
            Actionable barrier catalogue mapped to WCAG 2.1 criteria
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search barriers or location..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-9 pr-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 my-5">
        <span className="text-[11px] font-black text-[var(--text-muted)] mr-1 flex items-center gap-1">
          <Filter className="h-3 w-3" /> Severity:
        </span>
        {['all', 'critical', 'high', 'medium', 'low', 'resolved'].map((sev) => (
          <button
            key={sev}
            type="button"
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all border-2 ${
              severityFilter === sev
                ? 'bg-amber-200 text-amber-950 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-color)]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Issue Items List */}
      <div className="space-y-3.5 mt-4">
        {filteredIssues.length === 0 ? (
          <div className="p-8 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-primary)] text-center">
            <CheckCircle2 className="h-8 w-8 text-[#059669] mx-auto mb-2" />
            <div className="text-sm font-black text-[var(--text-primary)]">No barriers match your filter</div>
            <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
              Try adjusting the search query or severity filter.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isExpanded = expandedIssueId === issue.id;
            return (
              <div
                key={issue.id}
                className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  issue.isResolved
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : issue.severity === 'critical'
                    ? 'border-rose-300 bg-rose-50/40'
                    : 'border-[var(--border-strong)] bg-white shadow-sm'
                }`}
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-amber-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(issue.severity, issue.isResolved)}
                    <div>
                      <div className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
                        {issue.title}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-bold mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin className="h-3 w-3" /> {issue.location}
                        </span>
                        <span>•</span>
                        <span className="uppercase">{issue.category}</span>
                        <span>•</span>
                        <span>Confidence: {issue.confidenceScore}%</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#059669]">
                    {isExpanded ? 'Collapse' : 'Details'}
                  </span>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-5 pt-3 border-t-2 border-[var(--border-subtle)] bg-[var(--bg-primary)] space-y-3.5 text-xs">
                    {/* Problem */}
                    <div>
                      <span className="font-black text-[var(--text-primary)] block mb-1">
                        Detected Barrier Description:
                      </span>
                      <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* Why it matters */}
                      <div className="p-3.5 rounded-xl bg-white border border-[var(--border-color)]">
                        <span className="font-black text-amber-900 flex items-center gap-1.5 mb-1">
                          <HelpCircle className="h-3.5 w-3.5 text-amber-600" /> Why It Matters:
                        </span>
                        <p className="text-[var(--text-secondary)] text-[11px] font-medium leading-relaxed">
                          {issue.whyItMatters}
                        </p>
                      </div>

                      {/* Who is affected */}
                      <div className="p-3.5 rounded-xl bg-white border border-[var(--border-color)]">
                        <span className="font-black text-sky-900 flex items-center gap-1.5 mb-1">
                          <Users className="h-3.5 w-3.5 text-sky-600" /> Who is Affected:
                        </span>
                        <p className="text-[var(--text-secondary)] text-[11px] font-medium leading-relaxed">
                          {issue.whoIsAffected}
                        </p>
                      </div>
                    </div>

                    {/* Recommendation & Fix Action */}
                    <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-black text-emerald-950 block mb-0.5">
                          ✓ Recommended Remediation:
                        </span>
                        <p className="text-xs text-emerald-900 font-medium">
                          {issue.recommendation}
                        </p>
                      </div>

                      {issue.isFixableWithAi && !issue.isResolved && onFixWithAi && (
                        <button
                          type="button"
                          onClick={() => onFixWithAi(issue)}
                          className="shrink-0 px-4 py-2 rounded-xl bg-[#059669] text-white font-black text-xs shadow hover:bg-[#047857] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Wand2 className="h-3.5 w-3.5" />
                          <span>Fix with AI</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
