'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { documentStore } from '@/lib/storage/document-store';
import { inclusaOrchestrator } from '@/lib/agents/orchestrator';
import { DocumentAnalysis, TransformationItem } from '@/types';
import { ScoreCard } from '@/components/analysis/ScoreCard';
import { IssueExplorer } from '@/components/analysis/IssueExplorer';
import { TransformationCenter } from '@/components/transformation/TransformationCenter';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  FileText,
  FileCheck2,
  AlertCircle,
  Download,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

import { useAuth } from '@/context/AuthContext';

export default function AuditDetailPage() {
  const { user, isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=/audit/${documentId}`);
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


  const handleExecuteTransformations = async (selectedItems: TransformationItem[]) => {
    if (!analysis) return;
    setIsTransforming(true);

    try {
      const activeProfile = analysis.profileUsed || documentStore.getActiveProfile();

      const pipelineResult = await inclusaOrchestrator.runPipeline(
        {
          id: analysis.id,
          inputType: analysis.inputType,
          title: analysis.title,
          fileName: analysis.fileName,
          rawText: analysis.structuredContent?.rawText || '',
          fileSizeBytes: analysis.fileSizeBytes,
        },
        activeProfile,
        undefined,
        selectedItems
      );

      const updatedRecord: DocumentAnalysis = {
        ...analysis,
        status: 'completed',
        finalScore: pipelineResult.verification?.afterScore,
        transformations: selectedItems,
        transformedOutput: pipelineResult.transformedOutput,
        verification: pipelineResult.verification,
        pipelineResult,
        updatedAt: new Date().toISOString(),
      };

      documentStore.saveAnalysis(updatedRecord, user?.id);
      setAnalysis(updatedRecord);
      setIsTransforming(false);

      // Navigate to accessible output
      router.push(`/output/${analysis.id}`);
    } catch (err) {
      console.error('Error transforming content', err);
      setIsTransforming(false);
    }
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="flex justify-center mb-3">
          <InclusaMascot pose="reading" size={70} />
        </div>
        <h2 className="text-xl font-black text-[var(--text-primary)]">Analysis Record Not Found</h2>
        <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 mb-6">
          The requested document analysis could not be located in your history.
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138]"
        >
          <span>Start New Analysis</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-xs text-[var(--text-muted)] font-bold">
        Loading audit analysis...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1">
      {/* Top Breadcrumb & Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[var(--border-strong)] mb-8">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#059669] hover:underline mb-2"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Workspace
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Audit Report: {analysis.title}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
            Format: <span className="uppercase font-mono font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">{analysis.inputType}</span> • Created: {new Date(analysis.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/output/${analysis.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Accessible Output</span>
          </Link>

          <Link
            href={`/report/${analysis.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-[var(--text-primary)] text-xs font-black shadow-[3px_3px_0_0_#192138] hover:bg-amber-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Executive Report</span>
          </Link>
        </div>
      </div>

      {/* Main Audit Grid */}
      <div className="space-y-8">
        {/* Score Card */}
        <ScoreCard scoreResult={analysis.initialScore} title="Initial Accessibility Score" />

        {/* 2-Column Split: Issue Explorer & Transformation Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <IssueExplorer issues={analysis.issues} />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <TransformationCenter
              transformations={analysis.transformations}
              onExecuteTransformations={handleExecuteTransformations}
              isTransforming={isTransforming}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
