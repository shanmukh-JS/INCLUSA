'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { documentStore } from '@/lib/storage/document-store';
import { DashboardStats, DocumentAnalysis } from '@/types';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { RecentDocumentsTable } from '@/components/dashboard/RecentDocumentsTable';
import { QuickUploadCard } from '@/components/dashboard/QuickUploadCard';
import { PlusCircle, Sparkles, RefreshCw } from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api-client';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    averageScore: 0,
    averageImprovement: 0,
    issuesDetectedTotal: 0,
    issuesResolvedTotal: 0,
    documentsImprovedCount: 0,
  });

  const loadData = React.useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getDocuments();
      if (res && res.success && Array.isArray(res.data)) {
        setAnalyses(res.data);
      } else {
        const all = documentStore.getAllAnalyses(user.id);
        setAnalyses(all);
      }
    } catch {
      const all = documentStore.getAllAnalyses(user.id);
      setAnalyses(all);
    }
    setStats(documentStore.getDashboardStats(user.id));
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this analysis record?')) {
      try {
        await api.deleteDocument(id);
      } catch (e) {
        console.warn('API delete error:', e);
      }
      documentStore.deleteAnalysis(id, user.id);
      loadData();
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-xs font-bold text-[var(--text-muted)]">
        Loading workspace dashboard...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1">
      {/* Header Bar with Incli */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[var(--border-strong)]">
        <div className="flex items-center gap-4">
          <InclusaMascot pose="waving" size={54} />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                Accessibility Workspace
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                Workspace Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-0.5">
              Logged in as <strong className="text-[var(--text-primary)]">{user.fullName || user.email}</strong>. Centralized document history, reports, and accessibility insights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            title="Refresh dashboard metrics"
            className="p-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-[var(--text-primary)] shadow-[2px_2px_0_0_#192138] hover:bg-amber-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <Link
            href="/analyze"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-8">
        <MetricsGrid stats={stats} />
      </div>

      {/* Main Grid: Recent Documents Table & Sidebar */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <RecentDocumentsTable analyses={analyses} onDelete={handleDelete} />
        </div>

        <div className="space-y-6">
          <QuickUploadCard />

          {/* Quick Demo Launch Widget */}
          <div className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                Try Preloaded Demo
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mb-4">
              Instantly test the 6-agent loop on an unlabelled financial PDF with growth charts and dense jargon.
            </p>
            <Link
              href="/analyze?sample=demo-finance-report"
              className="block w-full py-2.5 px-4 rounded-xl border-2 border-[var(--border-strong)] bg-amber-50 hover:bg-amber-100 text-center text-xs font-black text-[var(--text-primary)] shadow-[2px_2px_0_0_#192138] transition-colors"
            >
              Launch Financial Report Demo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
