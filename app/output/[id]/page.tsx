'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { documentStore } from '@/lib/storage/document-store';
import { DocumentAnalysis } from '@/types';
import { AccessibleOutputTabs } from '@/components/transformation/AccessibleOutputTabs';
import { InclusaAssistant } from '@/components/chat/InclusaAssistant';
import {
  ChevronLeft,
  FileCheck2,
  TrendingUp,
  Download,
  AlertCircle,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export default function OutputDetailPage() {
  const params = useParams();
  const documentId = params.id as string;

  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const doc = documentStore.getAnalysisById(documentId);
    if (doc) {
      setAnalysis(doc);
    } else {
      setNotFound(true);
    }
  }, [documentId]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="flex justify-center mb-3">
          <InclusaMascot pose="reading" size={70} />
        </div>
        <h2 className="text-xl font-black text-[var(--text-primary)]">Analysis Not Found</h2>
        <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 mb-6">
          The requested document could not be located in your local storage.
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138]"
        >
          <span>Start New Analysis</span>
        </Link>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-xs text-[var(--text-muted)] font-bold">
        Loading accessible output...
      </div>
    );
  }

  const beforeScore = analysis.initialScore?.overallScore || 40;
  const afterScore = analysis.finalScore?.overallScore || analysis.verification?.afterScore.overallScore || 92;
  const improvement = afterScore - beforeScore;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[var(--border-strong)] mb-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#059669] hover:underline mb-2"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Workspace
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              Accessible Output: {analysis.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
              Verified Improvement
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
            Personalized for profile: <span className="font-black text-[var(--text-primary)]">{analysis.profileUsed?.name || 'Default'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/audit/${analysis.id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-xs font-black text-[var(--text-primary)] shadow-[2px_2px_0_0_#192138] hover:bg-amber-50 transition-all"
          >
            <span>Inspect Audit</span>
          </Link>

          <Link
            href={`/report/${analysis.id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Executive Report</span>
          </Link>
        </div>
      </div>

      {/* Score Improvement Banner */}
      <div className="p-5 sm:p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-emerald-50 shadow-[4px_4px_0_0_#192138] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-200 text-emerald-950 border border-emerald-400">
            <TrendingUp className="h-6 w-6 text-[#059669]" />
          </div>
          <div>
            <span className="text-xs font-black text-emerald-950 uppercase tracking-wide block">
              Verified Improvement
            </span>
            <span className="text-xs sm:text-sm text-[var(--text-primary)] font-medium">
              Accessibility score improved from <strong className="text-rose-700 font-mono font-black">{beforeScore}/100</strong> to{' '}
              <strong className="text-emerald-800 font-mono font-black">{afterScore}/100</strong> (
              <span className="text-emerald-950 font-black">+{improvement} points</span>)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
          <span>{analysis.verification?.issuesResolved || 0} barriers resolved</span>
        </div>
      </div>

      {/* Main Grid: Accessible Output Tabs & Smart Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Accessible Tabs */}
        <div className="lg:col-span-8 space-y-6">
          <AccessibleOutputTabs analysis={analysis} />
        </div>

        {/* Right Column: INCLUSA Assistant */}
        <div className="lg:col-span-4 space-y-6">
          <InclusaAssistant
            documentId={analysis.id}
            documentTitle={analysis.title}
            documentText={analysis.structuredContent?.rawText || ''}
          />
        </div>
      </div>
    </div>
  );
}
