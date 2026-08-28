'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentAnalysis } from '@/types';
import {
  FileText,
  FileSpreadsheet,
  Volume2,
  Globe,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Trash2,
  ExternalLink,
  FileCheck,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

interface RecentDocumentsTableProps {
  analyses: DocumentAnalysis[];
  onDelete: (id: string) => void;
}

export const RecentDocumentsTable: React.FC<RecentDocumentsTableProps> = ({
  analyses,
  onDelete,
}) => {
  const getIcon = (type: string) => {
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

  const getScoreBadgeClass = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-950 border-emerald-300';
    if (score >= 75) return 'bg-sky-100 text-sky-950 border-sky-300';
    if (score >= 50) return 'bg-amber-100 text-amber-950 border-amber-300';
    return 'bg-rose-100 text-rose-950 border-rose-300';
  };

  if (analyses.length === 0) {
    return (
      <div className="p-10 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138] text-center">
        <div className="flex justify-center mb-3">
          <InclusaMascot pose="reading" size={80} />
        </div>
        <h3 className="text-lg font-black text-[var(--text-primary)]">No analyses yet</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto font-medium">
          Upload your first document, audio recording, or webpage to detect accessibility barriers and run automated remediation.
        </p>
        <div className="mt-5">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] transition-all"
          >
            <span>Analyze Content</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138]">
      <div className="p-5 border-b-2 border-[var(--border-strong)] flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-[var(--text-primary)]">Recent Analyses</h2>
          <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
            Audit findings, verified scores, and accessible outputs
          </p>
        </div>
        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-strong)] text-[var(--text-primary)]">
          {analyses.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" aria-label="Recent Document Analyses">
          <thead className="border-b-2 border-[var(--border-strong)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-black">
            <tr>
              <th scope="col" className="py-3.5 px-4">Document / File</th>
              <th scope="col" className="py-3.5 px-3">Type</th>
              <th scope="col" className="py-3.5 px-3">Score Progression</th>
              <th scope="col" className="py-3.5 px-3">Issues Resolved</th>
              <th scope="col" className="py-3.5 px-3">Profile Used</th>
              <th scope="col" className="py-3.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {analyses.map((doc) => {
              const Icon = getIcon(doc.inputType);
              const beforeScore = doc.initialScore?.overallScore || 40;
              const afterScore = doc.finalScore?.overallScore || doc.verification?.afterScore.overallScore || beforeScore;
              const improvement = afterScore - beforeScore;
              const resolvedCount = doc.verification?.issuesResolved || 0;
              const totalCount = doc.issues?.length || doc.verification?.totalIssuesDetected || 0;

              return (
                <tr key={doc.id} className="hover:bg-amber-50/50 transition-colors">
                  {/* Title & File */}
                  <td className="py-3.5 px-4 font-bold text-[var(--text-primary)] max-w-xs truncate">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <Link
                          href={`/output/${doc.id}`}
                          className="hover:underline hover:text-[#059669] transition-colors block truncate font-black"
                        >
                          {doc.title}
                        </Link>
                        <span className="text-[10px] text-[var(--text-muted)] block font-medium">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-3 text-[var(--text-secondary)] uppercase font-mono text-[10px] font-bold">
                    {doc.inputType}
                  </td>

                  {/* Score Progression */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)] line-through font-mono">
                        {beforeScore}
                      </span>
                      <ArrowRight className="h-3 w-3 text-[var(--text-muted)]" />
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-black border ${getScoreBadgeClass(
                          afterScore
                        )}`}
                      >
                        {afterScore}/100
                      </span>
                      {improvement > 0 && (
                        <span className="text-[10px] font-black text-emerald-700">
                          +{improvement}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Issues Resolved */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                      <ShieldCheck className="h-4 w-4 text-[#059669]" />
                      <span>{resolvedCount} / {totalCount}</span>
                    </div>
                  </td>

                  {/* Profile */}
                  <td className="py-3.5 px-3 text-[var(--text-secondary)] truncate max-w-[120px] font-medium">
                    {doc.profileUsed?.name || 'Default'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/output/${doc.id}`}
                        title="View Accessible Remediated Output"
                        className="px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-950 text-[11px] font-black transition-all"
                      >
                        View Output
                      </Link>

                      <Link
                        href={`/audit/${doc.id}`}
                        title="View Full Audit"
                        className="p-1.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(doc.id)}
                        title="Delete record"
                        className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
