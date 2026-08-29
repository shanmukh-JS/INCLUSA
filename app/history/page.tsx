'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { documentStore } from '@/lib/storage/document-store';
import { DocumentAnalysis, DocumentInputType } from '@/types';
import {
  History,
  Search,
  FileText,
  FileSpreadsheet,
  Volume2,
  Globe,
  Trash2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

import { useAuth } from '@/context/AuthContext';

export default function HistoryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const loadData = () => {
    if (!user) return;
    setAnalyses(documentStore.getAllAnalyses(user.id));
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/history');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user?.id]);

  const handleDelete = (id: string) => {
    if (!user) return;
    if (window.confirm('Delete this historical analysis record?')) {
      documentStore.deleteAnalysis(id, user.id);
      loadData();
    }
  };


  const getIcon = (type: DocumentInputType) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'docx':
        return FileSpreadsheet;
      case 'audio':
      case 'video':
        return Volume2;
      default:
        return Globe;
    }
  };

  const filtered = analyses.filter((a) => {
    if (typeFilter !== 'all' && a.inputType !== typeFilter) return false;
    if (searchQuery.trim()) {
      return (
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.inputType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1">
      {/* Header */}
      <div className="pb-6 border-b-2 border-[var(--border-strong)] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
              Track Accessibility Results
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            Accessibility History
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
            Track accessibility results across analyzed content.
          </p>
        </div>

        <Link
          href="/analyze"
          className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
        >
          New Analysis
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by title or format..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-9 pr-3.5 rounded-2xl border-2 border-[var(--border-strong)] bg-white text-xs font-bold text-[var(--text-primary)] focus:border-[#059669]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'pdf', 'docx', 'audio', 'video', 'url', 'text'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all border-2 ${
                typeFilter === t
                  ? 'bg-amber-200 text-amber-950 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                  : 'bg-white text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Analyses List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl border-2 border-[var(--border-strong)] bg-white text-center shadow-[4px_4px_0_0_#192138]">
          <div className="flex justify-center mb-3">
            <InclusaMascot pose="reading" size={80} />
          </div>
          <h3 className="text-base font-black text-[var(--text-primary)]">No history found</h3>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 max-w-sm mx-auto">
            {analyses.length === 0
              ? 'Your accessibility journey starts here. Perform your first analysis to record remediations.'
              : 'No analyses matched your current search or format filters.'}
          </p>
          <div className="mt-5">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138]"
            >
              <span>Analyze Content Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const Icon = getIcon(item.inputType);
            const beforeScore = item.initialScore?.overallScore || 40;
            const afterScore = item.finalScore?.overallScore || item.verification?.afterScore.overallScore || 90;
            const delta = afterScore - beforeScore;

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#192138] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase font-mono font-black px-2.5 py-0.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-strong)]">
                      {item.inputType}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[var(--text-primary)] line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium mt-1 block">
                    {new Date(item.createdAt).toLocaleDateString()} • Profile: {item.profileUsed?.name || 'Default'}
                  </span>

                  {/* Score Progression */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-strong)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold block">Before</span>
                      <span className="text-xs font-mono font-black text-rose-700">{beforeScore}/100</span>
                    </div>

                    <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />

                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold block">Verified After</span>
                      <span className="text-xs font-mono font-black text-emerald-800">{afterScore}/100</span>
                    </div>

                    <span className="text-xs font-mono font-black text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                      +{delta}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t-2 border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <Link
                    href={`/output/${item.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs text-center border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] transition-all"
                  >
                    View Output
                  </Link>

                  <Link
                    href={`/audit/${item.id}`}
                    title="Audit Details"
                    className="p-2 rounded-xl border border-[var(--border-strong)] bg-white text-[var(--text-primary)] hover:bg-amber-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title="Delete record"
                    className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
