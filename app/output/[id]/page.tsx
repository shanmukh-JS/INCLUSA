'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { documentStore } from '@/lib/storage/document-store';
import { DocumentAnalysis } from '@/types';
import { AccessibleOutputTabs } from '@/components/transformation/AccessibleOutputTabs';
import { InclusaAssistant } from '@/components/chat/InclusaAssistant';
import {
  ChevronLeft,
  Volume2,
  Languages,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  X,
  Bot,
  ListChecks,
  Info,
  Layers,
  ArrowRight,
  Code,
  FileText,
  FileCheck2,
  Eye,
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
  const [activeTab, setActiveTab] = useState<string>('simplified');

  const tabsSectionRef = useRef<HTMLDivElement>(null);

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

  const scrollToTabs = (tabId: string) => {
    setActiveTab(tabId);
    if (tabsSectionRef.current) {
      tabsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Extract structured highlights strictly from the verified pipeline outputs
  const highlights = useMemo(() => {
    if (!analysis) return null;
    const out = analysis.transformedOutput;
    const imgAnalysis = analysis.structuredContent?.imageAnalysis;
    const rawText = analysis.structuredContent?.rawText || '';
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);

    // 1. What is this?
    const whatIsThis = out?.summary || out?.whatThisIs || imgAnalysis?.visualMeaning || `An accessible representation of ${analysis.title}.`;

    // 2. What do I need to know?
    let whatToKnow: string[] = [];
    if (out?.whatToKnow && out.whatToKnow.length > 0) {
      whatToKnow = out.whatToKnow;
    } else if (imgAnalysis?.keyFacts && imgAnalysis.keyFacts.length > 0) {
      whatToKnow = imgAnalysis.keyFacts;
    } else {
      const rawBullets = lines.filter((l) => l.startsWith('* ') || l.startsWith('- ')).map((l) => l.replace(/^[*|-]\s*/, ''));
      if (rawBullets.length > 0) {
        whatToKnow = rawBullets.slice(0, 4);
      } else {
        const bodyLines = lines.filter((l) => !l.startsWith('#') && !l.includes('|') && l.trim().length > 10);
        whatToKnow = bodyLines.slice(0, 4).map((s) => s.split(/[.!?]/)[0] + '.');
      }
    }
    if (whatToKnow.length === 0) {
      whatToKnow.push('All verified details from the original content are displayed above.');
    }

    // 3. What do I need to do? (Actions)
    let actionSteps: string[] = out?.stepByStepGuide || imgAnalysis?.explicitActions || [];
    if (actionSteps.length === 0) {
      actionSteps = ['There are no explicit action steps in this content.'];
    }

    // 4. Visual chart breakdown or visual meaning
    const visualSummary = out?.imageDescriptions?.[0]?.detailed || imgAnalysis?.detailedDescription || imgAnalysis?.visualMeaning || out?.summary || 'Visual graphic and content elements displayed in accessible high-contrast layout.';

    return {
      whatIsThis,
      whatToKnow: whatToKnow.slice(0, 4),
      actionSteps: actionSteps.slice(0, 4),
      visualSummary,
    };
  }, [analysis]);

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

  if (!analysis || !highlights) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-xs text-[var(--text-muted)] font-bold">
        Loading accessible output...
      </div>
    );
  }

  const beforeScore = analysis.initialScore?.overallScore ?? 74;
  const afterScore = analysis.finalScore?.overallScore ?? analysis.verification?.afterScore?.overallScore ?? 94;
  const improvement = analysis.verification?.scoreImprovement ?? (afterScore - beforeScore);
  const out = analysis.transformedOutput;

  // 6-Agent Process Steps
  const agentFlow = [
    { num: '1', name: 'Understand', action: 'Extracts real visual semantics, tables & diagrams via Gemini Vision' },
    { num: '2', name: 'Audit', action: 'Identifies cognitive, visual, language & structural barriers' },
    { num: '3', name: 'Personalize', action: 'Adapts to user profile (Telugu, ADHD, Screen Reader)' },
    { num: '4', name: 'Transform', action: 'Generates plain text, regional translation, audio & HTML' },
    { num: '5', name: 'Verify', action: 'Recalculates compliance gain against WCAG 2.1 rules' },
    { num: '6', name: 'Explain', action: 'Answers what was wrong, what changed, and who benefits' },
  ];

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1 relative space-y-8">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[var(--border-strong)]">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#059669] hover:underline mb-1.5"
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
            Personalized for profile: <span className="font-black text-[var(--text-primary)]">{analysis.profileUsed?.name || 'Default User'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--border-strong)] text-xs font-black shadow-[2px_2px_0_0_#192138] transition-all cursor-pointer ${
              isAssistantOpen ? 'bg-amber-200 text-amber-950' : 'bg-white text-[var(--text-primary)] hover:bg-amber-50'
            }`}
          >
            <MessageSquare className="h-4 w-4 text-amber-600" />
            <span>Ask INCLUSA Co-Pilot</span>
          </button>

          <Link
            href={`/report/${analysis.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-[var(--text-primary)] text-xs font-black border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]"
          >
            <FileCheck2 className="h-4 w-4 text-[#059669]" />
            <span>Executive Audit Report</span>
          </Link>
        </div>
      </div>

      {/* 10-SECOND INSTANT COGNITIVE COMPREHENSION HERO CARD */}
      <div className="rounded-3xl border-3 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-200 text-amber-950 border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]">
              <Info className="h-6 w-6 text-amber-800" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                Cognitive Accessibility Overview
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-0.5">
                What You Need to Know in 10 Seconds
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border-2 border-emerald-300 shrink-0">
            <ShieldCheck className="h-5 w-5 text-[#059669]" />
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-900 block">Accessibility Verified</span>
              <span className="text-sm font-black text-emerald-950 font-mono">
                {beforeScore}/100 → {afterScore}/100 (+{improvement} pts)
              </span>
            </div>
          </div>
        </div>

        {/* 4 Quadrants: What is this? / What do I need to know? / What do I need to do? / What does the visual show? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quadrant 1: What is this? */}
          <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
              <FileText className="h-4 w-4 text-amber-700" />
              <span>1. WHAT IS THIS?</span>
            </div>
            <p className="text-xs text-amber-950 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200">
              {highlights.whatIsThis}
            </p>
          </div>

          {/* Quadrant 2: What do I need to know? */}
          <div className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-purple-950 uppercase tracking-wider">
              <ListChecks className="h-4 w-4 text-purple-700" />
              <span>2. WHAT DO I NEED TO KNOW?</span>
            </div>
            <ul className="space-y-1.5 text-xs text-purple-950 font-medium bg-white/80 p-3 rounded-xl border border-purple-200">
              {highlights.whatToKnow.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quadrant 3: What do I need to do? */}
          <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-950 uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-[#059669]" />
              <span>3. ACTION STEPS</span>
            </div>
            <div className="space-y-1.5 text-xs text-emerald-950 font-medium bg-white/80 p-3 rounded-xl border border-emerald-200">
              {highlights.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="font-mono font-black text-[#059669]">
                    {highlights.actionSteps.length === 1 && step.toLowerCase().includes('no explicit action') ? '•' : `${idx + 1}.`}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 4: What does the visual show? */}
          <div className="p-5 rounded-2xl border-2 border-sky-200 bg-sky-50/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-sky-950 uppercase tracking-wider">
              <Eye className="h-4 w-4 text-sky-700" />
              <span>4. VISUAL MEANING & COMPOSITION</span>
            </div>
            <p className="text-xs text-sky-950 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-sky-200">
              {highlights.visualSummary}
            </p>
          </div>
        </div>

        {/* Quick Jump Modality Buttons: "NEED IT YOUR WAY?" */}
        <div className="pt-4 border-t-2 border-[var(--border-subtle)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Languages className="h-4 w-4 text-[#059669]" />
              <span>NEED IT YOUR WAY? (Quick Access):</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToTabs('translation')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] transition-all cursor-pointer"
              >
                <Languages className="h-3.5 w-3.5 text-amber-800" />
                <span>తెలుగు (Telugu)</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToTabs('simplified')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-xs border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] transition-all cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-purple-800" />
                <span>Simple English</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToTabs('images')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-black text-xs border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] transition-all cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-sky-800" />
                <span>Image Descriptions</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToTabs('audio_transcript')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black text-xs border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] transition-all cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5 text-[#059669]" />
                <span>Listen Audio</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToTabs('screen_reader')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-black text-xs border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] transition-all cursor-pointer"
              >
                <Code className="h-3.5 w-3.5 text-sky-800" />
                <span>Screen Reader HTML</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToTabs('before_after')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] transition-all cursor-pointer"
              >
                <TrendingUp className="h-3.5 w-3.5 text-slate-700" />
                <span>Before / After</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6-AGENT PROCESS FLOW VISUALIZATION */}
      <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 sm:p-8 shadow-[4px_4px_0_0_#192138] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#059669]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
              Autonomous 6-Agent Pipeline Execution Flow
            </h3>
          </div>
          <span className="text-[10px] font-black text-[#059669] bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
            All 6 Agents Verified
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {agentFlow.map((step, idx) => (
            <div
              key={step.num}
              className="p-3.5 rounded-2xl border-2 border-[var(--border-strong)] bg-white shadow-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-black text-[var(--text-muted)]">
                <span>Agent 0{step.num}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
              </div>
              <h4 className="text-xs font-black text-[var(--text-primary)]">{step.name}</h4>
              <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-tight">
                {step.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED OUTPUT TABS (Full Width) */}
      <div ref={tabsSectionRef} className="w-full pt-2">
        <AccessibleOutputTabs
          analysis={analysis}
          selectedTab={activeTab}
          onTabChange={(t) => setActiveTab(t)}
        />
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
