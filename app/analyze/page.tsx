'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MultimodalDropzone } from '@/components/analysis/MultimodalDropzone';
import { AgentTimelinePanel } from '@/components/analysis/AgentTimelinePanel';
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
} from 'lucide-react';
import Link from 'next/link';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

export default function AnalyzePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sampleParam = searchParams.get('sample');
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [completedAnalysis, setCompletedAnalysis] = useState<DocumentAnalysis | null>(null);

  // Auto-launch sample if specified in URL query
  useEffect(() => {
    if (sampleParam && !isProcessing && !completedAnalysis) {
      const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleParam);
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
  }, [sampleParam]);

  const handleStartAnalysis = async (data: {
    inputType: DocumentInputType;
    title: string;
    fileName?: string;
    rawText: string;
    url?: string;
    fileSizeBytes?: number;
  }) => {
    setIsProcessing(true);
    setCompletedAnalysis(null);

    const activeProfile = documentStore.getActiveProfile(user?.id);

    try {
      const pipelineResult = await inclusaOrchestrator.runPipeline(
        {
          inputType: data.inputType,
          title: data.title,
          fileName: data.fileName,
          rawText: data.rawText,
          fileSizeBytes: data.fileSizeBytes,
          url: data.url,
        },
        activeProfile,
        (currentStep, allSteps) => {
          setAgentSteps(allSteps);
        }
      );

      const analysisRecord: DocumentAnalysis = {
        id: pipelineResult.documentId,
        userId: user?.id || 'user_default_inclusa_owner',
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

      documentStore.saveAnalysis(analysisRecord, user?.id);
      setCompletedAnalysis(analysisRecord);
      setIsProcessing(false);
    } catch (err) {
      console.error('Error running accessibility pipeline', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1">
      {/* Header with Incli */}
      <div className="pb-6 border-b-2 border-[var(--border-strong)] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            Upload any digital format or enter a URL. The 6-agent system will audit, personalize, transform, and verify compliance automatically.
          </p>
        </div>

        <div className="shrink-0 hidden md:block">
          <InclusaMascot
            pose={isProcessing ? 'magnifying' : completedAnalysis ? 'celebrating' : 'waving'}
            size={58}
          />
        </div>
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
            <div className="p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138] text-center">
              <div className="flex justify-center mb-3">
                <InclusaMascot pose="magnifying" size={70} />
              </div>
              <h2 className="text-base font-black text-[var(--text-primary)]">Agent Pipeline Ready</h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 max-w-sm mx-auto leading-relaxed">
                When you submit content, the 6 autonomous agents will activate in sequence to detect accessibility barriers and apply remediations.
              </p>
            </div>
          )}

          {/* Success Banner when pipeline finishes */}
          {completedAnalysis && (
            <div className="p-6 sm:p-8 rounded-3xl border-3 border-[var(--border-strong)] bg-emerald-50 shadow-[6px_6px_0_0_#192138] transition-all animate-fade-in space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-200 text-emerald-950 border border-emerald-400">
                  <ShieldCheck className="h-6 w-6 text-[#059669]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-950">
                    Remediation & Verification Complete!
                  </h3>
                  <p className="text-xs text-emerald-800 font-bold">
                    Score improved from {completedAnalysis.initialScore?.overallScore}/100 to{' '}
                    {completedAnalysis.finalScore?.overallScore}/100 (+
                    {completedAnalysis.verification?.scoreImprovement} points)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href={`/output/${completedAnalysis.id}`}
                  className="py-3 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs text-center border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Accessible Output</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href={`/audit/${completedAnalysis.id}`}
                  className="py-3 px-4 rounded-xl border-2 border-[var(--border-strong)] bg-white text-[var(--text-primary)] font-black text-xs text-center shadow-[3px_3px_0_0_#192138] hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Inspect Audit Report</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
