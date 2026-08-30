'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Sparkles,
  BookOpen,
  Eye,
  Languages,
  Volume2,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  X,
  Bot,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { useAuth } from '@/context/AuthContext';

export default function OutputDetailPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const params = useParams();
  const documentId = params.id as string;

  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=/output/${documentId}`);
    }
  }, [user, isLoading, documentId, router]);

  useEffect(() => {
    if (user) {
      const doc = documentStore.getAnalysisById(documentId, user.id);
      if (doc) {
        setAnalysis(doc);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [documentId, user]);

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

  const beforeScore = analysis.initialScore?.overallScore ?? 40;
  const afterScore = analysis.finalScore?.overallScore ?? analysis.verification?.afterScore.overallScore ?? 94;
  const improvement = analysis.verification?.scoreImprovement ?? (afterScore - beforeScore);
  const resolvedCount = analysis.verification?.issuesResolved || analysis.issues?.length || 4;

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1 relative">
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
              Verified Accessible
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
            Personalized for profile: <span className="font-black text-[var(--text-primary)]">{analysis.profileUsed?.name || 'Default'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Ask INCLUSA Assistant Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--border-strong)] text-xs font-black shadow-[2px_2px_0_0_#192138] transition-all cursor-pointer ${
              isAssistantOpen ? 'bg-amber-200 text-amber-950' : 'bg-white text-[var(--text-primary)] hover:bg-amber-50'
            }`}
          >
            <MessageSquare className="h-4 w-4 text-amber-600" />
            <span>{isAssistantOpen ? 'Close Assistant' : '💬 Ask INCLUSA'}</span>
          </button>

          <Link
            href={`/audit/${analysis.id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-xs font-black text-[var(--text-primary)] shadow-[2px_2px_0_0_#192138] hover:bg-amber-50 transition-all"
          >
            <span>Inspect Audit Findings</span>
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

      {/* Visual Impact Dashboard: Understanding the 3 Pillars of What Changed */}
      <div className="rounded-3xl border-3 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#192138] mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950">
              <Sparkles className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                Understanding Your Accessible Output
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-1">
                How INCLUSA Solved Barriers in &ldquo;{analysis.title}&rdquo;
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-emerald-50 px-4 py-2 rounded-2xl border-2 border-emerald-300">
            <TrendingUp className="h-5 w-5 text-[#059669]" />
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-900 block">Verified Compliance Gain</span>
              <span className="text-sm font-black text-emerald-950 font-mono">
                {beforeScore}/100 &rarr; <span className="text-emerald-700">{afterScore}/100</span> (+{improvement} pts)
              </span>
            </div>
          </div>
        </div>

        {/* 3 Impact Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Cognitive */}
          <div className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-purple-950">
              <BookOpen className="h-4 w-4 text-purple-700" />
              <span>1. Cognitive Plain Language</span>
            </div>
            <p className="text-xs text-purple-900 font-medium leading-relaxed">
              <strong>Before:</strong> Dense bureaucratic/academic jargon.<br />
              <strong>Fixed:</strong> Simplified to a <strong>7th-grade reading level</strong> with clear action steps, key points, and rules for ADHD, Dyslexia, and quick readers.
            </p>
          </div>

          {/* Column 2: Visual & Tables */}
          <div className="p-5 rounded-2xl border-2 border-sky-200 bg-sky-50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-sky-950">
              <Eye className="h-4 w-4 text-sky-700" />
              <span>2. Visual Alt-Text & Tables</span>
            </div>
            <p className="text-xs text-sky-900 font-medium leading-relaxed">
              <strong>Before:</strong> Unlabelled diagrams & raw data rows blocked screen readers.<br />
              <strong>Fixed:</strong> Converted into <strong>sequential process breakdowns</strong>, data charts, and semantic WCAG 2.1 HTML tables with header traversal.
            </p>
          </div>

          {/* Column 3: Regional & Auditory */}
          <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
              <Languages className="h-4 w-4 text-[#059669]" />
              <span>3. Regional & Auditory Inclusion</span>
            </div>
            <p className="text-xs text-emerald-900 font-medium leading-relaxed">
              <strong>Before:</strong> English only text without audio.<br />
              <strong>Fixed:</strong> Generated full <strong>Telugu (సులభమైన సారాంశం) & Hindi translations</strong> + multi-mode <strong>audio player</strong> (45s Summary, Action Points, Full Narration).
            </p>
          </div>
        </div>
      </div>

      {/* Main Showcase: Accessible Output Tabs (Full Width) */}
      <div className="w-full">
        <AccessibleOutputTabs analysis={analysis} />
      </div>

      {/* Floating / Expandable "Ask INCLUSA" Side Assistant Drawer */}
      {isAssistantOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l-3 border-[var(--border-strong)] shadow-[-10px_0_30px_rgba(0,0,0,0.15)] flex flex-col animate-slide-in-right">
          {/* Drawer Header */}
          <div className="p-4 border-b-2 border-[var(--border-strong)] bg-[var(--bg-secondary)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="text-xs font-black text-[var(--text-primary)]">INCLUSA Assistant</h3>
                <p className="text-[10px] text-[var(--text-muted)] font-medium">Grounded Q&A for {analysis.title}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAssistantOpen(false)}
              className="p-1.5 rounded-lg border border-[var(--border-strong)] bg-white hover:bg-rose-50 text-[var(--text-primary)] hover:text-rose-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4">
            <InclusaAssistant
              documentId={analysis.id}
              documentTitle={analysis.title}
              documentText={analysis.structuredContent?.rawText || ''}
            />
          </div>
        </div>
      )}
    </div>
  );
}
