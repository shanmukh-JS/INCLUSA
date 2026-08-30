'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Sparkles,
  Loader2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { ScoreCard } from '@/components/analysis/ScoreCard';
import { IssueExplorer } from '@/components/analysis/IssueExplorer';
import { AccessibilityIssue, AccessibilityScoreResult } from '@/types';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { useAuth } from '@/context/AuthContext';

export default function WebsiteAnalyzerPage() {
  const router = useRouter();
  const { user, isLoading, getToken } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    url: string;
    status?: string;
    statusCode?: number;
    error?: string;
    score: AccessibilityScoreResult | null;
    issues: AccessibilityIssue[];
    stats: {
      totalElementsChecked: number;
      imagesWithoutAlt: number;
      headingSkips: number;
      unlabelledButtons: number;
      missingLang: boolean;
    };
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/website');
    }
  }, [user, isLoading, router]);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isAuditing) return;

    setIsAuditing(true);
    setAuditResult(null);

    try {
      const token = getToken();
      const res = await fetch('/api/website-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await res.json();
      if (data && data.success && data.data) {
        setAuditResult(data.data);
      } else if (data && data.url) {
        setAuditResult(data);
      } else {
        throw new Error(data.error || `Audit request failed with status ${res.status}`);
      }
    } catch (err: any) {
      console.error('Failed to audit website:', err);
      // Honest failure display: do NOT calculate fake 99/100 score on failed network requests
      setAuditResult({
        url: urlInput,
        status: 'failed',
        statusCode: 0,
        error: err.message || 'Connection timed out or network error occurred.',
        score: null,
        issues: [],
        stats: {
          totalElementsChecked: 0,
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
            className="px-7 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer"
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
          {/* FAILED AUDIT DISPLAY: Trustworthy error state without misleading high score */}
          {auditResult.status === 'failed' || !auditResult.score ? (
            <div className="p-8 rounded-3xl border-3 border-rose-300 bg-rose-50 shadow-[6px_6px_0_0_#FDA4AF] space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-200 border-2 border-rose-400 text-rose-950">
                  <ShieldAlert className="h-6 w-6 text-rose-700" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-200 border border-rose-400 text-rose-950 text-xs font-black mb-1">
                    <span>Audit Could Not Be Completed</span>
                  </div>
                  <h2 className="text-xl font-black text-rose-950">
                    Unable to Inspect Website DOM
                  </h2>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-rose-300 space-y-2 text-xs text-rose-900 font-medium">
                <p>
                  <strong>Failure Reason:</strong> {auditResult.error || 'The remote server did not return a valid HTML response.'}
                </p>
                <p className="text-[11px] text-slate-600">
                  INCLUSA requires direct access to inspect HTML elements, headings, ARIA tags, and form inputs. A reliable accessibility score cannot be computed without a successful DOM inspection.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-rose-300">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-500 block">Accessibility Score</span>
                  <span className="text-2xl font-mono font-black text-rose-700">NOT AVAILABLE</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuditResult(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-white shadow-xs">
                  <span className="text-[11px] font-black text-[var(--text-secondary)]">DOM Nodes Inspected</span>
                  <div className="text-2xl font-black font-mono text-[var(--text-primary)] mt-1">{auditResult.stats.totalElementsChecked}</div>
                </div>
                <div className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/50 shadow-xs">
                  <span className="text-[11px] font-black text-rose-800">Images Missing Alt</span>
                  <div className="text-2xl font-black font-mono text-rose-700 mt-1">{auditResult.stats.imagesWithoutAlt}</div>
                </div>
                <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/50 shadow-xs">
                  <span className="text-[11px] font-black text-amber-800">Heading Tree Skips</span>
                  <div className="text-2xl font-black font-mono text-amber-700 mt-1">{auditResult.stats.headingSkips}</div>
                </div>
                <div className="p-5 rounded-2xl border-2 border-sky-300 bg-sky-50/50 shadow-xs">
                  <span className="text-[11px] font-black text-sky-800">Missing Lang Tag</span>
                  <div className="text-base font-black text-sky-900 mt-1.5">{auditResult.stats.missingLang ? 'Yes (Barrier)' : 'No (Passed)'}</div>
                </div>
              </div>

              {/* Score Card */}
              <ScoreCard scoreResult={auditResult.score} title={`Website Score for: ${auditResult.url}`} />

              {/* Issue Explorer */}
              <IssueExplorer issues={auditResult.issues} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
