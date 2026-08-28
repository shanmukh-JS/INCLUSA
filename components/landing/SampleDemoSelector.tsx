'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_DOCUMENTS } from '@/lib/mock/sample-documents';
import {
  FileText,
  FileSpreadsheet,
  Volume2,
  Globe,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const SampleDemoSelector: React.FC = () => {
  const router = useRouter();

  const handleLaunchSample = (sampleId: string) => {
    router.push(`/analyze?sample=${sampleId}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'docx':
        return FileSpreadsheet;
      case 'audio':
        return Volume2;
      default:
        return Globe;
    }
  };

  return (
    <div className="mt-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
          <Zap className="h-3.5 w-3.5" /> 1-Click Interactive Demo Launcher
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
          Try INCLUSA with Preloaded Complex Content
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Experience the complete 6-agent workflow from upload through accessibility audit, transformation, Telugu translation, and before/after verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLE_DOCUMENTS.map((doc) => {
          const Icon = getIcon(doc.inputType);
          return (
            <div
              key={doc.id}
              className="flex flex-col justify-between p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-blue)] transition-all duration-200 hover:-translate-y-1 shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--accent-blue)] border border-[var(--border-subtle)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-blue-bg)] text-[var(--accent-blue)] border border-[var(--accent-blue)]/20">
                    {doc.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-3 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => handleLaunchSample(doc.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold text-[var(--text-primary)] border border-[var(--border-color)] hover:border-transparent transition-all shadow-sm"
                >
                  <span>Launch Live Demo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
