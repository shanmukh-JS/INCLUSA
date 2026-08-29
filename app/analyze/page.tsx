'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MultimodalDropzone } from '@/components/analysis/MultimodalDropzone';
import { AgentTimelinePanel } from '@/components/analysis/AgentTimelinePanel';
import { JudgeExplainerWidget } from '@/components/analysis/JudgeExplainerWidget';
import { inclusaOrchestrator } from '@/lib/agents/orchestrator';
import { documentStore } from '@/lib/storage/document-store';
import { SAMPLE_DOCUMENTS } from '@/lib/mock/sample-documents';
import {
  AgentStep,
  DocumentAnalysis,
  DocumentInputType,
} from '@/types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  UserCheck,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

function AnalyzePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sampleParam = searchParams.get('sample');
  const { user, isLoading } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [completedAnalysis, setCompletedAnalysis] = useState<DocumentAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastInputData, setLastInputData] = useState<any>(null);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/analyze');
    }
  }, [user, isLoading, router]);

  const handleStartAnalysis = React.useCallback(async (data: {
    inputType: DocumentInputType;
    title: string;
    fileName?: string;
    rawText: string;
    fileDataUrl?: string;
    url?: string;
    fileSizeBytes?: number;
  }) => {
    if (!user) {
      router.push('/login?redirect=/analyze');
      return;
    }

    setIsProcessing(true);
    setCompletedAnalysis(null);
    setErrorMessage(null);
    setLastInputData(data);

    const activeProfile = documentStore.getActiveProfile(user.id);

    try {
      const pipelineResult = await inclusaOrchestrator.runPipeline(
        {
          inputType: data.inputType,
          title: data.title,
          fileName: data.fileName,
          rawText: data.rawText,
          fileDataUrl: data.fileDataUrl,
          fileSizeBytes: data.fileSizeBytes,
          url: data.url,
        },
        activeProfile,
        (currentStep: any, allSteps: any) => {
          setAgentSteps(allSteps);
        }
      );

      const analysisRecord: DocumentAnalysis = {
        id: pipelineResult.documentId,
        userId: user.id,
        title: pipelineResult.structuredContent.title,
        inputType: data.inputType,
        fileName: data.fileName,
        fileSizeBytes: data.fileSizeBytes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'completed',
        profileUsed: activeProfile,
        initialScore: pipelineResult.initialScore,
        finalScore: pipelineResult.verification?.afterScore,
        structuredContent: pipelineResult.structuredContent,
        issues: pipelineResult.initialIssues,
        transformations: pipelineResult.transformations,
        transformedOutput: pipelineResult.transformedOutput,
        verification: pipelineResult.verification,
        pipelineResult,
      };

      documentStore.saveAnalysis(analysisRecord, user.id);
      setCompletedAnalysis(analysisRecord);
      setIsProcessing(false);
    } catch (err: any) {
      console.error('Error running accessibility pipeline', err);
      setErrorMessage(err.message || 'An error occurred during agent pipeline execution.');
      setIsProcessing(false);
    }
  }, [user, router]);

  // Auto-launch sample if specified in URL query
  useEffect(() => {
    if (sampleParam && !isProcessing && !completedAnalysis && user) {
      const sample = SAMPLE_DOCUMENTS.find((s: any) => s.id === sampleParam);
      if (sample) {
        handleStartAnalysis({
          inputType: sample.inputType,
          title: sample.title,
          fileName: sample.fileName,
          rawText: sample.rawText,
          fileSizeBytes: sample.rawText.length,
        });
      }
    }
  }, [sampleParam, user, isProcessing, completedAnalysis, handleStartAnalysis]);


  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-xs font-bold text-[var(--text-muted)]">
        Checking authentication session...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const activeProfile = documentStore.getActiveProfile(user.id);

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1 space-y-8">
      {/* Header Bar */}
      <div className="pb-6 border-b-2 border-[var(--border-strong)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
              Autonomous Multimodal Ingestion
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Content Accessibility Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
            Upload any digital format or enter a URL. The 6 autonomous agents will audit, personalize, transform, and verify compliance automatically.
          </p>
        </div>

        <div className="shrink-0 hidden md:block">
          <InclusaMascot
            pose={isProcessing ? 'magnifying' : completedAnalysis ? 'celebrating' : 'waving'}
            size={58}
          />
        </div>
      </div>

      {/* 10-Second Judge Explainer Guide */}
      <JudgeExplainerWidget />

      {/* Active Profile Info Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-purple-50/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-200 text-purple-900 border border-purple-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-purple-900 block">
              Active Accessibility Profile
            </span>
            <span className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
              {activeProfile.name} ({activeProfile.language.primaryLanguage === 'te' ? 'Telugu / తెలుగు' : activeProfile.language.primaryLanguage.toUpperCase()})
            </span>
          </div>
        </div>

        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-xs font-black text-[var(--text-primary)] hover:bg-purple-100 shadow-[2px_2px_0_0_#192138] transition-all self-start sm:self-auto"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Change Preferences</span>
        </Link>
      </div>

      {/* Main Grid: Upload Dropzone & Real-Time Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dropzone */}
        <div className="lg:col-span-6 space-y-6">
          <MultimodalDropzone
            onStartAnalysis={handleStartAnalysis}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Column: Live Agent Timeline & Completion Card */}
        <div className="lg:col-span-6 space-y-6">
          {agentSteps.length > 0 ? (
            <AgentTimelinePanel steps={agentSteps} isProcessing={isProcessing} />
          ) : (
            <div className="p-8 rounded-3xl border-3 border-[var(--border-strong)] bg-white shadow-[6px_6px_0_0_#192138] text-center">
              <div className="flex justify-center mb-3">
                <InclusaMascot pose="magnifying" size={70} />
              </div>
              <h2 className="text-base font-black text-[var(--text-primary)]">Agent Pipeline Ready</h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1.5 max-w-sm mx-auto leading-relaxed">
                When you submit content, the 6 autonomous agents will activate in sequence to detect accessibility barriers and apply remediations.
              </p>
            </div>
          )}

          {/* Error Banner if pipeline fails */}
          {errorMessage && (
            <div className="p-6 rounded-3xl border-3 border-[var(--border-strong)] bg-rose-50 shadow-[6px_6px_0_0_#192138] space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-200 text-rose-950 border border-rose-400">
                  <AlertCircle className="h-6 w-6 text-rose-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-rose-950">
                    Agent Pipeline Encountered an Error
                  </h3>
                  <p className="text-xs text-rose-800 font-medium mt-0.5">
                    {errorMessage}
                  </p>
                </div>
              </div>
              {lastInputData && (
                <button
                  type="button"
                  onClick={() => handleStartAnalysis(lastInputData)}
                  className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Retry Pipeline</span>
                </button>
              )}
            </div>
          )}

          {/* Success Banner when pipeline finishes */}
          {completedAnalysis && (
            <div className="p-6 sm:p-8 rounded-3xl border-3 border-[var(--border-strong)] bg-emerald-50 shadow-[6px_6px_0_0_#192138] transition-all animate-fade-in space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-emerald-200 text-emerald-950 border border-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="h-6 w-6 text-[#059669]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-emerald-950">
                    Remediation & Independent Verification Complete!
                  </h3>
                  <p className="text-xs text-emerald-900 font-bold mt-1">
                    Score improved from {completedAnalysis.initialScore?.overallScore}/100 to{' '}
                    {completedAnalysis.finalScore?.overallScore}/100 (+
                    {completedAnalysis.verification?.scoreImprovement} points gain)
                  </p>
                </div>
              </div>

              {/* Verified Before/After Metric Box */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border-2 border-emerald-300">
                <div>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">Initial Baseline</span>
                  <span className="text-xl font-mono font-black text-rose-700">
                    {completedAnalysis.initialScore?.overallScore}/100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">Verified After</span>
                  <span className="text-xl font-mono font-black text-emerald-800">
                    {completedAnalysis.finalScore?.overallScore}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Link
                  href={`/output/${completedAnalysis.id}`}
                  className="py-3 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs text-center border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1.5"
                >
                  <FileCheck2 className="h-4 w-4" />
                  <span>View Accessible Output</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href={`/report/${completedAnalysis.id}`}
                  className="py-3 px-4 rounded-xl border-2 border-[var(--border-strong)] bg-white text-[var(--text-primary)] font-black text-xs text-center shadow-[3px_3px_0_0_#192138] hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>View Executive Report</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1700px] px-4 py-20 text-center text-xs font-bold text-[var(--text-muted)]">Loading accessibility analyzer...</div>}>
      <AnalyzePageContent />
    </Suspense>
  );
}
