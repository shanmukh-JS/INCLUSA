'use client';

import React, { useState } from 'react';
import { DocumentAnalysis, TransformedOutput } from '@/types';
import {
  FileText,
  Languages,
  Eye,
  Table as TableIcon,
  Code2,
  Headphones,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface AccessibleOutputTabsProps {
  analysis: DocumentAnalysis;
  transformedOutput?: TransformedOutput;
  selectedTab?: string;
  onTabChange?: (t: any) => void;
}

type TabKey = 'plain_language' | 'translation' | 'images' | 'tables' | 'screen_reader' | 'audio' | 'original';

const AccessibleContentRenderer: React.FC<{ content: string; isRegionalScript?: boolean }> = ({
  content,
  isRegionalScript = false,
}) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className={`space-y-4 text-base leading-relaxed ${isRegionalScript ? 'font-serif text-lg leading-loose' : 'font-sans'}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="text-base sm:text-lg font-black text-[var(--text-primary)] mt-5 mb-2 flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              {trimmed.replace(/^###\s*/, '')}
            </h4>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-6 mb-2.5 pb-1 border-b border-[var(--border-strong)]"
            >
              {trimmed.replace(/^##\s*/, '')}
            </h3>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h2
              key={idx}
              className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-6 mb-3"
            >
              {trimmed.replace(/^#\s*/, '')}
            </h2>
          );
        }

        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
          const cleanText = trimmed.replace(/^[*•\-\d.]+\s*/, '');
          const isKeyFact = cleanText.includes(':');
          
          return (
            <div key={idx} className="flex items-start gap-3 pl-2 py-1">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-[#059669] flex-shrink-0" />
              <p className="text-[var(--text-secondary)] font-medium">
                {isKeyFact ? (
                  <>
                    <strong className="text-[var(--text-primary)] font-black">
                      {cleanText.split(':')[0]}:
                    </strong>
                    {cleanText.slice(cleanText.indexOf(':') + 1)}
                  </>
                ) : (
                  cleanText
                )}
              </p>
            </div>
          );
        }

        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-[#059669] pl-4 py-2 my-3 italic text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-r-xl"
            >
              {trimmed.replace(/^>\s*/, '')}
            </blockquote>
          );
        }

        return (
          <p key={idx} className="text-[var(--text-secondary)] font-medium leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

export const AccessibleOutputTabs: React.FC<AccessibleOutputTabsProps> = ({
  analysis,
  transformedOutput,
  selectedTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<TabKey>('plain_language');
  const activeTab = (selectedTab as TabKey) || internalTab;
  const setActiveTab = (tab: TabKey) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [selectedLang, setSelectedLang] = useState<string>('te');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const out = transformedOutput || analysis.transformedOutput;
  if (!out) {
    return (
      <div className="p-8 text-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-strong)] rounded-3xl">
        No transformed output available.
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const tabs: Array<{ key: TabKey; label: string; icon: React.FC<any>; badge?: string | number }> = [
    { key: 'plain_language', label: 'Plain Language', icon: FileText },
    {
      key: 'translation',
      label: 'Regional Translation',
      icon: Languages,
      badge: out.translations ? Object.keys(out.translations).length : 0,
    },
    {
      key: 'images',
      label: 'Image Descriptions',
      icon: Eye,
      badge: out.imageDescriptions?.length || 0,
    },
    {
      key: 'tables',
      label: 'Linearized Tables',
      icon: TableIcon,
      badge: out.tableRepresentations?.length || 0,
    },
    { key: 'screen_reader', label: 'Screen Reader HTML', icon: Code2 },
    { key: 'audio', label: 'Audio Narration', icon: Headphones },
    { key: 'original', label: 'Original Source', icon: ExternalLink },
  ];

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[6px_6px_0_0_#192138] overflow-hidden">
      {/* Top Tab Bar */}
      <div className="border-b-2 border-[var(--border-strong)] bg-[var(--bg-secondary)] px-4 pt-3 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  isActive
                    ? 'bg-[#059669] text-white shadow-[2px_2px_0_0_#192138]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && Number(tab.badge) > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                      isActive ? 'bg-white text-[#059669]' : 'bg-[var(--border-strong)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-2 pb-3 flex-shrink-0">
          <button
            onClick={() => handleCopy(out.accessibleText || '')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-strong)] bg-white text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] shadow-sm"
            title="Copy Full Remediated Output"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#059669]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Tab Content Panel */}
      <div className="p-6 sm:p-8 bg-white min-h-[420px]">
        {/* TAB 1: PLAIN LANGUAGE */}
        {activeTab === 'plain_language' && (
          <div className="space-y-6">
            {/* Header info badge */}
            <div className="p-4 rounded-2xl bg-[#059669]/10 border border-[#059669]/30 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-[#059669] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-black text-[var(--text-primary)]">Simplified Cognitive Version</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Refactored for 7th-grade reading level. Complex jargon converted to plain language bullet points with step-by-step action items.
                </p>
              </div>
            </div>

            {/* Quick Action Steps Checklist */}
            {out.stepByStepGuide && out.stepByStepGuide.length > 0 && (
              <div className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  <h4 className="text-xs font-black tracking-wider uppercase text-[var(--text-primary)]">
                    Action Steps & Important Next Steps
                  </h4>
                </div>
                <div className="space-y-2">
                  {out.stepByStepGuide.map((step, idx) => {
                    const cleanStep = step.replace(/^[*•\-\d.]+\s*/, '');
                    return (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                        <span className="flex-shrink-0 h-5 w-5 rounded-md bg-white border border-[var(--border-strong)] text-[#059669] flex items-center justify-center font-black text-[11px] shadow-sm">
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
              <AccessibleContentRenderer content={out.simplifiedVersion || out.accessibleText || ''} />
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
              <div className="flex flex-wrap gap-2">
                {Object.entries(out.translations || {}).map(([langKey, trans]) => (
                  <button
                    key={langKey}
                    onClick={() => setSelectedLang(langKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      selectedLang === langKey
                        ? 'bg-[#059669] text-white shadow-[2px_2px_0_0_#192138]'
                        : 'border border-[var(--border-strong)] bg-white text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                    }`}
                  >
                    {trans.languageName || langKey.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Output Body */}
            {out.translations && out.translations[selectedLang] ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-muted)]">
                    Target Language: <strong className="text-[var(--text-primary)]">{out.translations[selectedLang].languageName}</strong>
                  </span>
                  <button
                    onClick={() => handleSpeak(out.translations[selectedLang].content)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border-strong)] bg-white text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
                  >
                    {isPlayingAudio ? <VolumeX className="h-3.5 w-3.5 text-red-500" /> : <Volume2 className="h-3.5 w-3.5 text-[#059669]" />}
                    <span>{isPlayingAudio ? 'Stop Speech' : 'Listen'}</span>
                  </button>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-inner">
                  <AccessibleContentRenderer
                    content={out.translations[selectedLang].content}
                    isRegionalScript={true}
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-strong)] rounded-2xl">
                No translation available for selected language.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IMAGES & CHARTS */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#059669]/10 border border-[#059669]/30 flex items-start gap-3">
              <Eye className="h-5 w-5 text-[#059669] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-black text-[var(--text-primary)]">Multi-Tier Visual Descriptions</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  3-layer accessibility breakdown: Short Alt Text for inline screen readers, Detailed Description for visual structure, and Plain Meaning for cognitive understanding.
                </p>
              </div>
            </div>

            {out.imageDescriptions && out.imageDescriptions.length > 0 ? (
              <div className="space-y-5">
                {out.imageDescriptions.map((img, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-secondary)] space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--border-strong)] pb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                        Figure {idx + 1}
                      </span>
                      <button
                        onClick={() => handleCopy(`Alt: ${img.altText}\n\nDetailed: ${img.detailed}`)}
                        className="text-xs font-bold text-[var(--text-secondary)] hover:text-[#059669] flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Copy Text
                      </button>
                    </div>

                    {/* Tier 1: Concise Alt Text */}
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#059669] block mb-1">
                        1. Screen Reader Alt Text (Concise)
                      </span>
                      <p className="text-sm font-bold text-[var(--text-primary)] bg-white p-3 rounded-xl border border-[var(--border-strong)]">
                        {img.altText}
                      </p>
                    </div>

                    {/* Tier 2: Detailed Visual Breakdown */}
                    <div>
                      <span className="text-[11px] font-black uppercase text-[var(--text-secondary)] block mb-1">
                        2. Detailed Visual & Data Breakdown
                      </span>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] bg-white p-3.5 rounded-xl border border-[var(--border-strong)] leading-relaxed">
                        {img.detailed}
                      </p>
                    </div>

                    {/* Tier 3: Plain Meaning */}
                    {img.simple && (
                      <div>
                        <span className="text-[11px] font-black uppercase text-[#f59e0b] block mb-1">
                          3. Plain Language Meaning
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] bg-white p-3 rounded-xl border border-[var(--border-strong)]">
                          {img.simple}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-strong)] rounded-2xl">
                No embedded images or charts detected in this content.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LINEARIZED TABLES */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#059669]/10 border border-[#059669]/30 flex items-start gap-3">
              <TableIcon className="h-5 w-5 text-[#059669] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-black text-[var(--text-primary)]">Linearized Accessible Tables</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Complex tabular records converted to semantic HTML with explicit &lt;th scope=&quot;col&quot;&gt; header bindings and plain-language summaries.
                </p>
              </div>
            </div>

            {out.tableRepresentations && out.tableRepresentations.length > 0 ? (
              <div className="space-y-6">
                {out.tableRepresentations.map((tbl, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-secondary)] space-y-4"
                  >
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                      Table {idx + 1} Narrative & Accessible Structure
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic bg-white p-3.5 rounded-xl border border-[var(--border-strong)]">
                      {tbl.plainExplanation}
                    </p>
                    <div
                      className="overflow-x-auto bg-white p-4 rounded-xl border border-[var(--border-strong)] text-xs text-[var(--text-primary)]"
                      dangerouslySetInnerHTML={{ __html: tbl.accessibleHtml }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-strong)] rounded-2xl">
                No data tables found in this document.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SCREEN READER HTML */}
        {activeTab === 'screen_reader' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-muted)]">
                Semantic HTML5 with ARIA Landmarks
              </span>
              <button
                onClick={() => handleDownload(out.screenReaderHtml, `${analysis.title || 'accessible'}.html`, 'text/html')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-strong)] bg-white text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] shadow-sm"
              >
                <Download className="h-3.5 w-3.5 text-[#059669]" />
                <span>Download HTML</span>
              </button>
            </div>

            <pre className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] bg-[#192138] text-green-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{out.screenReaderHtml}</code>
            </pre>
          </div>
        )}

        {/* TAB 6: AUDIO NARRATION */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-secondary)] flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-[var(--text-primary)]">Interactive Spoken Audio</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Listen to the structured accessibility narration synthesized for screen-free auditory comprehension.
                </p>
              </div>
              <button
                onClick={() => handleSpeak(out.audioTranscript || out.simplifiedVersion || out.accessibleText || '')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#059669] text-white text-xs font-black shadow-[3px_3px_0_0_#192138] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex-shrink-0"
              >
                {isPlayingAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span>{isPlayingAudio ? 'Stop Narration' : 'Play Narration'}</span>
              </button>
            </div>

            {/* Transcript */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                Narration Script
              </span>
              <div className="p-6 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs sm:text-sm font-medium text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {out.audioTranscript || out.simplifiedVersion || out.accessibleText}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ORIGINAL SOURCE */}
        {activeTab === 'original' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-muted)]">
                Raw Extracted Source Content
              </span>
              <button
                onClick={() => handleCopy(out.accessibleText || '')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-strong)] bg-white text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] shadow-sm"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Source</span>
              </button>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)]">
              <AccessibleContentRenderer content={out.accessibleText || ''} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
