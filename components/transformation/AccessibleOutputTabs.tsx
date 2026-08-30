'use client';

import React, { useState } from 'react';
import { DocumentAnalysis, TransformedOutput } from '@/types';
import { BeforeAfterView } from './BeforeAfterView';
import { AccessibleAudioPlayer } from '../media/AccessibleAudioPlayer';
import {
  FileText,
  Sparkles,
  Languages,
  Image as ImageIcon,
  Volume2,
  Code,
  FileCode,
  TrendingUp,
  Copy,
  Check,
  Download,
  Eye,
  CheckCircle2,
  Table as TableIcon,
  HelpCircle,
  ListChecks,
  Info,
} from 'lucide-react';

interface AccessibleOutputTabsProps {
  analysis: DocumentAnalysis;
}

/**
 * Rich, accessible Markdown parser and renderer that turns raw markdown
 * (headings, tables, lists, bold text) into clean, styled, high-contrast accessible HTML elements.
 */
const AccessibleContentRenderer: React.FC<{ content: string; isRegionalScript?: boolean }> = ({
  content,
  isRegionalScript = false,
}) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let tableKey = 0;

  const flushTable = () => {
    if (tableHeaders.length > 0) {
      const currentHeaders = [...tableHeaders];
      const currentRows = [...tableRows];
      elements.push(
        <div
          key={`tbl-${tableKey++}`}
          className="my-5 overflow-hidden rounded-2xl border-2 border-[var(--border-strong)] bg-white shadow-xs"
        >
          <div className="p-3 bg-amber-50 border-b-2 border-[var(--border-strong)] flex items-center gap-2 text-xs font-black text-amber-950">
            <TableIcon className="h-4 w-4 text-amber-700" />
            <span>Accessible Structured Data Table</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" role="table">
              <thead className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--border-strong)] font-black">
                <tr>
                  {currentHeaders.map((h, hi) => (
                    <th
                      key={hi}
                      scope="col"
                      className="py-3 px-4 text-xs font-black text-[var(--text-primary)] border-r border-[var(--border-subtle)] last:border-r-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {currentRows.map((r, ri) => (
                  <tr key={ri} className="hover:bg-amber-50/50 transition-colors">
                    {r.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`py-3 px-4 text-xs ${
                          ci === 0 ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)] font-medium'
                        } border-r border-[var(--border-subtle)] last:border-r-0`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    tableHeaders = [];
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inTable) flushTable();
      continue;
    }

    // Markdown Table Detection
    if (line.includes('|') && line.split('|').length >= 3) {
      if (line.includes('---')) {
        continue;
      }
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cells.length > 0) {
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
      }
      continue;
    } else {
      if (inTable) flushTable();
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1
          key={`h1-${i}`}
          className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-6 mb-3 pb-2 border-b-2 border-[var(--border-strong)] flex items-center gap-2"
        >
          <span>{line.replace(/^#\s+/, '')}</span>
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-base sm:text-lg font-black text-[var(--text-primary)] mt-5 mb-2 flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-[#059669]" />
          <span>{line.replace(/^##\s+/, '')}</span>
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-sm sm:text-base font-black text-[var(--text-primary)] mt-4 mb-2"
        >
          {line.replace(/^###\s+/, '')}
        </h3>
      );
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      // Bullet list items
      const cleanText = line.replace(/^[*|-]\s*/, '');
      elements.push(
        <div
          key={`li-${i}`}
          className="flex items-start gap-2.5 my-2 p-2.5 rounded-xl bg-white border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-semibold shadow-xs"
        >
          <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
          <span>{cleanText}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      // Numbered items
      const cleanText = line.replace(/^\d+\.\s*/, '');
      const num = line.match(/^(\d+)\./)?.[1] || '1';
      elements.push(
        <div
          key={`num-${i}`}
          className="flex items-start gap-2.5 my-2 p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-[var(--text-primary)] font-semibold shadow-xs"
        >
          <span className="h-5 w-5 rounded-full bg-amber-200 border border-amber-400 text-amber-950 font-mono font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
            {num}
          </span>
          <span>{cleanText}</span>
        </div>
      );
    } else if (line === '---') {
      elements.push(<hr key={`hr-${i}`} className="my-6 border-t-2 border-[var(--border-strong)]" />);
    } else {
      // Regular Paragraph
      elements.push(
        <p
          key={`p-${i}`}
          className={`text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed my-2.5 font-medium ${
            isRegionalScript ? 'leading-loose tracking-wide' : ''
          }`}
        >
          {line}
        </p>
      );
    }
  }

  if (inTable) flushTable();

  return <div className="space-y-1">{elements}</div>;
};

export const AccessibleOutputTabs: React.FC<AccessibleOutputTabsProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<string>('simplified');
  const [activeLanguage, setActiveLanguage] = useState<string>('te');
  const [copied, setCopied] = useState(false);
  const [htmlViewMode, setHtmlViewMode] = useState<'preview' | 'code'>('preview');

  const out = analysis.transformedOutput;
  const verification = analysis.verification;

  const availableLanguages = Object.keys(out?.translations || {});
  const selectedLang = out?.translations?.[activeLanguage] ? activeLanguage : (availableLanguages[0] || 'te');

  if (!out) {
    return (
      <div className="p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white text-center text-xs text-[var(--text-muted)] font-medium">
        Transformations have not yet been generated for this document. Click &ldquo;Transform Content&rdquo; in the audit report.
      </div>
    );
  }

  const tabs = [
    { id: 'simplified', label: 'Simplified Plain Version', icon: Sparkles },
    { id: 'translation', label: 'Telugu / Regional Translation', icon: Languages },
    { id: 'images', label: 'Image & Chart Descriptions', icon: ImageIcon },
    { id: 'accessible_text', label: 'Accessible Text', icon: FileText },
    { id: 'audio_transcript', label: 'Audio Narration & Transcript', icon: Volume2 },
    { id: 'screen_reader', label: 'Screen Reader HTML', icon: Code },
    { id: 'before_after', label: 'Before / After Comparison', icon: TrendingUp },
    { id: 'original', label: 'Original Source', icon: FileCode },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[6px_6px_0_0_#192138] overflow-hidden">
      {/* Top Tab Bar */}
      <div className="border-b-2 border-[var(--border-strong)] bg-[var(--bg-secondary)] px-4 pt-3 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[var(--text-primary)] border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 pb-3 shrink-0">
          <button
            type="button"
            onClick={() => handleCopy(out.simplifiedVersion || out.accessibleText)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-xs font-black text-[var(--text-primary)] shadow-[2px_2px_0_0_#192138] hover:bg-amber-50 cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleDownload(
                out.screenReaderHtml || out.accessibleText,
                `${analysis.title}_accessible.html`,
                'text/html'
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download HTML</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: SIMPLIFIED VERSION */}
        {activeTab === 'simplified' && (
          <div className="space-y-6">
            {/* Plain Language Banner */}
            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-300">
              <div className="flex items-center gap-2 font-black text-xs text-purple-950 mb-1">
                <Sparkles className="h-4 w-4 text-purple-700" />
                <span>Cognitive Plain-Language Transformation (7th Grade Level)</span>
              </div>
              <p className="text-xs text-purple-900 font-medium">
                Written so anyone can understand: explains what this document is, who it is for, key rules, and what actions to take.
              </p>
            </div>

            {/* Structured Action Steps */}
            {out.stepByStepGuide && out.stepByStepGuide.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-[#059669]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                    What You Need to Do (Action Steps):
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {out.stepByStepGuide.map((step: string, idx: number) => {
                    const cleanStep = step.replace(/^[*•\-\d.]+\s*/, '').trim();
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border-2 border-[var(--border-strong)] bg-white text-xs text-[var(--text-primary)] leading-relaxed font-semibold shadow-xs flex items-start gap-2.5"
                      >
                        <span className="h-6 w-6 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{cleanStep}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rich formatted prose */}
            <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-inner">
              <AccessibleContentRenderer content={out.simplifiedVersion} />
            </div>
          </div>
        )}

        {/* TAB 2: TRANSLATION */}
        {activeTab === 'translation' && (
          <div className="space-y-6">
            {/* Language Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-[var(--border-strong)]">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-[#059669]" />
                <span className="text-xs font-black text-[var(--text-primary)]">Select Language:</span>
              </div>
              <div className="flex items-center gap-2">
                {Object.entries(out.translations).map(([code, trans]: [string, any]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setActiveLanguage(code)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 border-[var(--border-strong)] cursor-pointer ${
                      activeLanguage === code
                        ? 'bg-amber-200 text-amber-950 shadow-[2px_2px_0_0_#192138]'
                        : 'bg-white text-[var(--text-secondary)] hover:bg-amber-50'
                    }`}
                  >
                    {trans.languageName} ({code.toUpperCase()})
                  </button>
                ))}
              </div>
            </div>

            {/* Regional Notice Banner */}
            {selectedLang === 'te' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-950 mb-1">
                  <span>తెలుగు సులభమైన సారాంశం (Telugu Accessible Translation)</span>
                </div>
                <p className="text-xs text-emerald-900 font-medium">
                  అసలు పత్రంలోని సమాచారం, నిబంధనలు, అర్హత ప్రమాణాలు మరియు ముఖ్యమైన తేదీలు తెలుగులో ఖచ్చితంగా అనువదించబడ్డాయి.
                </p>
              </div>
            )}

            {out.translations[selectedLang] ? (
              <div className="space-y-4">
                <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-inner">
                  <AccessibleContentRenderer
                    content={out.translations[selectedLang].content}
                    isRegionalScript={true}
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] font-medium">
                Translation in selected language is not yet generated.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IMAGE & CHART DESCRIPTIONS */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-300">
              <div className="flex items-center gap-2 font-black text-xs text-sky-950 mb-1">
                <ImageIcon className="h-4 w-4 text-sky-700" />
                <span>Multi-Tiered Visual, Diagram & Chart Understander</span>
              </div>
              <p className="text-xs text-sky-900 font-medium">
                Genuinely explains what the visual communicates: chronological process stages, data trends, highest/lowest metrics, and plain-language conclusions.
              </p>
            </div>

            <div className="space-y-4">
              {out.imageDescriptions.map((img: any, idx: number) => (
                <div
                  key={img.id || idx}
                  className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                    <span className="text-xs font-black text-[var(--text-primary)] flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-sky-600" />
                      <span>Figure / Diagram {idx + 1}</span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      WCAG 1.1.1 Semantic Remediation
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-black text-sky-800 block mb-1">
                      1. Concise Alt Text (Screen Reader Tag):
                    </span>
                    <p className="text-xs text-[var(--text-primary)] bg-white p-3 rounded-xl border border-[var(--border-strong)] font-mono font-bold">
                      &ldquo;{img.altText}&rdquo;
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-black text-emerald-800 block mb-1">
                      2. Detailed Meaning, Stages & Data Breakdown:
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-[var(--border-color)]">
                      {img.detailed}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-black text-purple-800 block mb-1">
                      3. Plain-Language Summary (What this picture means to the user):
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed bg-purple-50/50 p-3 rounded-xl border border-purple-200 text-purple-950">
                      {img.simple}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACCESSIBLE TEXT */}
        {activeTab === 'accessible_text' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 font-bold">
              Screen-reader friendly structured edition with semantic headings, lists, and figure descriptions.
            </div>
            <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-inner">
              <AccessibleContentRenderer content={out.accessibleText} />
            </div>
          </div>
        )}

        {/* TAB 5: AUDIO NARRATION & TRANSCRIPT */}
        {activeTab === 'audio_transcript' && (
          <div className="space-y-6">
            <AccessibleAudioPlayer
              title={analysis.title}
              transcript={out.audioTranscript}
              textToRead={out.simplifiedVersion || out.accessibleText}
            />
          </div>
        )}

        {/* TAB 6: SCREEN READER HTML */}
        {activeTab === 'screen_reader' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-strong)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHtmlViewMode('preview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    htmlViewMode === 'preview'
                      ? 'bg-amber-200 text-amber-950 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                      : 'bg-white text-[var(--text-secondary)] border-[var(--border-color)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Rendered Preview</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setHtmlViewMode('code')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    htmlViewMode === 'code'
                      ? 'bg-amber-200 text-amber-950 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                      : 'bg-white text-[var(--text-secondary)] border-[var(--border-color)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Code className="h-3.5 w-3.5" />
                    <span>Raw HTML5 Code</span>
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(out.screenReaderHtml)}
                className="text-xs font-black text-[#059669] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy HTML</span>
              </button>
            </div>

            {htmlViewMode === 'preview' ? (
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-inner">
                <div
                  className="prose max-w-none text-xs sm:text-sm"
                  dangerouslySetInnerHTML={{ __html: out.screenReaderHtml }}
                />
              </div>
            ) : (
              <pre className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-[11px] font-mono text-emerald-950 overflow-x-auto leading-relaxed max-h-[500px] font-bold">
                {out.screenReaderHtml}
              </pre>
            )}
          </div>
        )}

        {/* TAB 7: BEFORE / AFTER COMPARISON */}
        {activeTab === 'before_after' && verification && (
          <div>
            <BeforeAfterView verification={verification} />
          </div>
        )}

        {/* TAB 8: ORIGINAL SOURCE */}
        {activeTab === 'original' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 font-bold">
              Original un-remediated content for comparison and audit inspection.
            </div>
            <pre className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-secondary)] overflow-x-auto leading-relaxed whitespace-pre-line font-mono font-medium">
              {analysis.structuredContent?.rawText || 'Raw text content.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
