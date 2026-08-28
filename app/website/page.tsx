'use client';

import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { ScoreCard } from '@/components/analysis/ScoreCard';
import { IssueExplorer } from '@/components/analysis/IssueExplorer';
import { calculateInitialScore } from '@/lib/scoring/accessibility-scorer';
import { AccessibilityIssue, AccessibilityScoreResult } from '@/types';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export default function WebsiteAnalyzerPage() {
  const [urlInput, setUrlInput] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    url: string;
    score: AccessibilityScoreResult;
    issues: AccessibilityIssue[];
    stats: {
      totalElementsChecked: number;
      imagesWithoutAlt: number;
      headingSkips: number;
      unlabelledButtons: number;
      missingLang: boolean;
    };
  } | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isAuditing) return;

    setIsAuditing(true);
    setAuditResult(null);

    try {
      const res = await fetch('/api/website-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!res.ok) {
        throw new Error(`Audit request failed with status ${res.status}`);
      }

      const data = await res.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error('Failed to audit website:', err);
      // Fallback display if network error
      const issues: AccessibilityIssue[] = [
        {
          id: 'web_iss_fallback',
          ruleId: 'VIS-001',
          category: 'vision',
          title: 'Unable to Reach Remote Server Directly',
          severity: 'medium',
          location: urlInput,
          description: `Network request could not complete: ${err.message || 'CORS/Connection timeout'}.`,
          whyItMatters: 'Page must be publicly accessible over standard HTTPS.',
          whoIsAffected: 'All web visitors',
          recommendation: 'Check URL spelling or CORS headers on the origin server.',
          confidenceScore: 90,
          isFixableWithAi: false,
        },
      ];
      setAuditResult({
        url: urlInput,
        score: calculateInitialScore(issues),
        issues,
        stats: {
          totalElementsChecked: 1,
          imagesWithoutAlt: 0,
          headingSkips: 0,
          unlabelledButtons: 0,
          missingLang: false,
        },
      });
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1">
      {/* Header */}
      <div className="pb-6 border-b-2 border-[var(--border-strong)] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-950 border border-sky-300">
              Live Web Crawler & Auditor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Website Accessibility Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
            Evaluate public web pages for WCAG 2.1 compliance, missing alt attributes, heading hierarchies, and contrast issues.
          </p>
        </div>

        <div className="shrink-0 hidden md:block">
          <InclusaMascot pose={isAuditing ? 'magnifying' : 'waving'} size={54} />
        </div>
      </div>

      {/* URL Input Box */}
      <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138] mb-8">
        <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="url"
              placeholder="https://example.gov or https://your-website.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              required
              disabled={isAuditing}
              className="w-full py-3.5 pl-10 pr-4 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] font-bold focus:border-[#059669]"
            />
          </div>

          <button
            type="submit"
            disabled={!urlInput.trim() || isAuditing}
            className="px-7 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isAuditing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Auditing DOM...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Web Audit</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results View */}
      {auditResult && (
        <div className="space-y-8 animate-fade-in">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-white shadow-sm">
              <span className="text-[11px] font-black text-[var(--text-secondary)]">DOM Nodes Inspected</span>
              <div className="text-2xl font-black font-mono text-[var(--text-primary)] mt-1">{auditResult.stats.totalElementsChecked}</div>
            </div>
            <div className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/50 shadow-sm">
              <span className="text-[11px] font-black text-rose-800">Images Missing Alt</span>
              <div className="text-2xl font-black font-mono text-rose-700 mt-1">{auditResult.stats.imagesWithoutAlt}</div>
            </div>
            <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/50 shadow-sm">
              <span className="text-[11px] font-black text-amber-800">Heading Tree Skips</span>
              <div className="text-2xl font-black font-mono text-amber-700 mt-1">{auditResult.stats.headingSkips}</div>
            </div>
            <div className="p-5 rounded-2xl border-2 border-sky-300 bg-sky-50/50 shadow-sm">
              <span className="text-[11px] font-black text-sky-800">Missing Lang Tag</span>
              <div className="text-base font-black text-sky-900 mt-1.5">Checked</div>
            </div>
          </div>

          {/* Score Card */}
          <ScoreCard scoreResult={auditResult.score} title={`Website Score for: ${auditResult.url}`} />

          {/* Issue Explorer */}
          <IssueExplorer issues={auditResult.issues} />
        </div>
      )}
    </div>
  );
}
