'use client';

import React from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, FileText, Globe, Volume2 } from 'lucide-react';

export const QuickUploadCard: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[var(--text-primary)]">Quick Ingestion</h3>
          <p className="text-xs text-[var(--text-muted)] font-medium">Upload files or enter a URL</p>
        </div>
      </div>

      <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mb-5">
        Supports PDF, Image, Audio, Video, DOCX, TXT, or live Website URL scanning with autonomous 6-agent remediation.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-5 text-center">
        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
          <FileText className="h-4 w-4 mx-auto text-sky-700 mb-1" />
          <span className="text-[10px] font-black text-sky-950">PDF / Doc</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <Volume2 className="h-4 w-4 mx-auto text-amber-700 mb-1" />
          <span className="text-[10px] font-black text-amber-950">Audio / Video</span>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <Globe className="h-4 w-4 mx-auto text-emerald-700 mb-1" />
          <span className="text-[10px] font-black text-emerald-950">URL Scan</span>
        </div>
      </div>

      <Link
        href="/analyze"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
      >
        <Sparkles className="h-4 w-4 text-white" />
        <span>Open Ingestion Workspace</span>
      </Link>
    </div>
  );
};
