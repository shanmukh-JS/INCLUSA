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
} from 'lucide-react';

interface AccessibleOutputTabsProps {
  analysis: DocumentAnalysis;
}

export const AccessibleOutputTabs: React.FC<AccessibleOutputTabsProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<string>('simplified');
  const [activeLanguage, setActiveLanguage] = useState<string>('te');
  const [copied, setCopied] = useState(false);

  const out = analysis.transformedOutput;
  const verification = analysis.verification;

  if (!out) {
    return (
      <div className="p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white text-center text-xs text-[var(--text-muted)] font-medium">
        Transformations have not yet been generated for this document. Click "Transform Content" in the audit report.
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
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-black transition-all ${
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-xs font-black text-[var(--text-primary)] shadow-[2px_2px_0_0_#192138] hover:bg-amber-50"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-black border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: SIMPLIFIED VERSION */}
        {activeTab === 'simplified' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-300">
              <div className="flex items-center gap-2 font-black text-xs text-purple-950 mb-1">
                <Sparkles className="h-4 w-4 text-purple-700" />
                <span>Cognitive Plain-Language Transformation (7th Grade Level)</span>
              </div>
              <p className="text-xs text-purple-900 font-medium">
                Simplified syntax, eliminated dense jargon, and structured into clear takeaways.
              </p>
            </div>

            {/* Key Takeaways */}
            {out.stepByStepGuide && out.stepByStepGuide.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-3">
                  Key Points & Action Steps:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {out.stepByStepGuide.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] leading-relaxed font-semibold shadow-sm"
                    >
                      <span className="font-black text-[#059669] mr-1.5 font-mono">0{idx + 1}.</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plain prose */}
            <div className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-medium shadow-inner">
              {out.simplifiedVersion}
            </div>
          </div>
        )}

        {/* TAB 2: TRANSLATION */}
        {activeTab === 'translation' && (
          <div className="space-y-6">
            {/* Language Selector */}
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[var(--border-strong)]">
              <span className="text-xs font-black text-[var(--text-primary)]">Select Language:</span>
              {Object.entries(out.translations).map(([code, trans]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setActiveLanguage(code)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 border-[var(--border-strong)] ${
                    activeLanguage === code
                      ? 'bg-amber-200 text-amber-950 shadow-[2px_2px_0_0_#192138]'
                      : 'bg-white text-[var(--text-secondary)] hover:bg-amber-50'
                  }`}
                >
                  {trans.languageName} ({code.toUpperCase()})
                </button>
              ))}
            </div>

            {out.translations[activeLanguage] ? (
              <div className="space-y-4">
                <h3 className="text-base font-black text-[var(--text-primary)]">
                  {out.translations[activeLanguage].title}
                </h3>
                <div className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-medium">
                  {out.translations[activeLanguage].content}
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
                <span>Multi-Tiered Visual & Data Descriptions</span>
              </div>
              <p className="text-xs text-sky-900 font-medium">
                Includes concise alt text for screen readers, detailed numerical trend analysis, and plain-language summaries.
              </p>
            </div>

            <div className="space-y-4">
              {out.imageDescriptions.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] space-y-3.5 shadow-sm"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                    <span className="text-xs font-black text-[var(--text-primary)]">
                      Figure / Chart {idx + 1}
                    </span>
                    <span className="text-[10px] font-black text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      WCAG 1.1.1 Remediation
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-black text-sky-800 block mb-1">
                      Alt Text (Concise):
                    </span>
                    <p className="text-xs text-[var(--text-primary)] bg-white p-3 rounded-xl border border-[var(--border-strong)] font-mono font-bold">
                      "{img.altText}"
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-black text-emerald-800 block mb-1">
                      Detailed Narrative & Data Breakdown:
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-[var(--border-color)]">
                      {img.detailed}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-black text-purple-800 block mb-1">
                      Plain-Language Summary:
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
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
            <div className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-mono font-medium shadow-inner">
              {out.accessibleText}
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
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[var(--text-primary)]">
                Semantic HTML5 Output with ARIA Landmarks
              </span>
              <button
                type="button"
                onClick={() => handleCopy(out.screenReaderHtml)}
                className="text-xs font-black text-[#059669] hover:underline"
              >
                Copy HTML Code
              </button>
            </div>
            <pre className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-[11px] font-mono text-emerald-900 overflow-x-auto leading-relaxed max-h-[500px] font-bold">
              {out.screenReaderHtml}
            </pre>
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
