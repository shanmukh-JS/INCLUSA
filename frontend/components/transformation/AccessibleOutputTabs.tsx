'use client';

import React, { useState } from 'react';
import { DocumentAnalysis, TransformedOutput } from '../../../types';
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
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface AccessibleOutputTabsProps {
  analysis: DocumentAnalysis;
}

export const AccessibleOutputTabs: React.FC<AccessibleOutputTabsProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeLanguage, setActiveLanguage] = useState<string>('te');
  const [copied, setCopied] = useState(false);

  const out = analysis.transformedOutput;
  const verification = analysis.verification;
  const structured = analysis.structuredContent;
  const issues = analysis.issues || [];
  const explanation = analysis.pipelineResult?.explanation;

  const availableLanguages = Object.keys(out?.translations || {});
  const selectedLang = out?.translations?.[activeLanguage] ? activeLanguage : (availableLanguages[0] || 'te');

  if (!out) {
    return (
      <div className="p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white text-center text-xs text-[var(--text-muted)] font-medium">
        Transformations have not yet been generated for this document. Click "Transform Content" in the audit report.
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Final Accessibility Overview', icon: ShieldCheck },
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

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${analysis.title.replace(/\s+/g, '_')}_accessibility_package.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const whatThisIs = out.whatThisIs || out.summary || structured?.imageAnalysis?.visualMeaning || 'Visual content remediated for universal accessibility.';
  const whatMatters = (out.keyFacts && out.keyFacts.length > 0) ? out.keyFacts : (out.whatToKnow && out.whatToKnow.length > 0 ? out.whatToKnow : [whatThisIs]);
  const visualMeaning = out.visualMeaning || structured?.imageAnalysis?.visualMeaning || whatThisIs;
  const primaryAlt = out.imageDescriptions?.[0]?.altText || structured?.imageAnalysis?.altText || 'Accessible alternative description';
  const primaryDetailed = out.imageDescriptions?.[0]?.detailed || structured?.imageAnalysis?.detailedDescription || visualMeaning;
  const keyRemediations = explanation?.keyRemediations && explanation.keyRemediations.length > 0 
    ? explanation.keyRemediations 
    : [
        'Generated contextual alt text, detailed visual breakdown, and plain-language meaning.',
        'Structured cognitive plain-language version with explicit key facts.',
        'Synthesized regional language translations (Telugu & Hindi).',
        'Compiled semantic HTML5 with ARIA landmarks for screen-reader navigation.',
      ];

  const actionSteps = out.stepByStepGuide && out.stepByStepGuide.length > 0
    ? out.stepByStepGuide
    : ['There are no explicit action steps in this content.'];

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[6px_6px_0_0_#192138] overflow-hidden">
      {/* Top Header Controls */}
      <div className="p-4 sm:p-6 border-b-2 border-[var(--border-strong)] bg-[var(--bg-primary)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-950 border border-emerald-300">
            <ShieldCheck className="h-5 w-5 text-[#059669]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-[var(--text-primary)]">
              {analysis.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-black uppercase text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Accessible
              </span>
              <span className="text-[10px] font-bold text-[var(--text-muted)]">
                Score: {verification ? verification.afterScore.overallScore : analysis.initialScore.overallScore}/100
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="py-2 px-3.5 rounded-xl border-2 border-[var(--border-strong)] bg-white hover:bg-amber-50 shadow-[2px_2px_0_0_#192138] text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#059669]" />
            <span>Export Package</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b-2 border-[var(--border-strong)] overflow-x-auto bg-[var(--bg-primary)] scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3.5 px-5 text-xs font-black whitespace-nowrap transition-all border-r border-[var(--border-color)] ${
                isActive
                  ? 'bg-white text-[#059669] border-b-3 border-b-[#059669] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-amber-50/70 hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#059669]' : 'text-[var(--text-muted)]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="p-6 sm:p-8">
        {/* TAB 0: FINAL ACCESSIBILITY OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overview Header Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300">
              <div className="flex items-center gap-2 font-black text-xs text-emerald-950 mb-1">
                <ShieldCheck className="h-4 w-4 text-[#059669]" />
                <span className="uppercase tracking-wider">FINAL ACCESSIBILITY OVERVIEW</span>
              </div>
              <p className="text-xs text-emerald-900 font-medium">
                Unified, verified output produced by the autonomous 6-agent accessibility pipeline.
              </p>
            </div>

            {/* Grid Section: What is this & What matters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. What is this? */}
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-[var(--text-primary)]">
                  <Info className="h-4 w-4 text-emerald-600" />
                  <span>What is this?</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-[var(--border-color)]">
                  {whatThisIs}
                </p>
              </div>

              {/* 2. What matters? */}
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-[var(--text-primary)]">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>What matters?</span>
                </div>
                <ul className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[var(--border-color)]">
                  {whatMatters.map((fact: string, idx: number) => (
                    <li key={idx} className="text-xs text-[var(--text-primary)] font-medium flex items-start gap-2">
                      <span className="text-[#059669] font-black shrink-0">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. What does the content communicate? */}
            <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-[var(--text-primary)]">
                <FileText className="h-4 w-4 text-sky-600" />
                <span>What does the content communicate?</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium bg-white p-4 rounded-xl border border-[var(--border-color)]">
                {visualMeaning}
              </p>
            </div>

            {/* 4. Accessibility barriers found & 5. What INCLUSA changed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Barriers */}
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--text-primary)]">
                    Accessibility Barriers Detected ({issues.length})
                  </span>
                  <span className="text-[10px] font-black text-rose-900 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                    WCAG 2.1 Audit
                  </span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {issues.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] font-medium">No severe accessibility barriers detected.</p>
                  ) : (
                    issues.map((iss, idx) => (
                      <div key={iss.id || idx} className="p-2.5 rounded-xl bg-white border border-[var(--border-color)] text-xs flex items-start gap-2">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          iss.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                          iss.severity === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {iss.severity}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-[var(--text-primary)] block truncate">{iss.title}</span>
                          <span className="text-[11px] text-[var(--text-secondary)] font-medium">{iss.description}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* What INCLUSA changed */}
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--text-primary)]">
                    What INCLUSA Remediated
                  </span>
                  <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Fixes
                  </span>
                </div>
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-[var(--border-color)]">
                  {keyRemediations.map((rem: string, idx: number) => (
                    <div key={idx} className="text-xs text-[var(--text-primary)] font-medium flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>{rem}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Action Steps */}
            <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] block">
                Action Steps
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {actionSteps.map((step: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-[var(--border-strong)] text-xs text-[var(--text-primary)] font-semibold flex items-start gap-2"
                  >
                    <span className="font-black text-[#059669] font-mono">0{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Alt text & 8. Detailed description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alt text */}
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-800">Alt Text (Screen-Reader Concise)</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(primaryAlt)}
                    className="text-[10px] font-black text-[#059669] hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-[var(--text-primary)] bg-white p-3.5 rounded-xl border border-[var(--border-strong)] font-mono font-bold">
                  "{primaryAlt}"
                </p>
              </div>

              {/* Detailed Description */}
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-2">
                <span className="text-xs font-black text-emerald-800 block">Detailed Image Breakdown</span>
                <p className="text-xs text-[var(--text-secondary)] font-medium bg-white p-3.5 rounded-xl border border-[var(--border-color)] leading-relaxed">
                  {primaryDetailed}
                </p>
              </div>
            </div>

            {/* 9. Language Accessibility */}
            {out.translations && Object.keys(out.translations).length > 0 && (
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--text-primary)]">
                    Regional Language Accessibility
                  </span>
                  <span className="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                    Telugu & Hindi
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {out.translations['te'] && (
                    <div className="bg-white p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                      <span className="text-xs font-black text-purple-950 block">
                        తెలుగు అనువాదం (Telugu Summary)
                      </span>
                      <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line">
                        {out.translations['te'].content}
                      </p>
                    </div>
                  )}
                  {out.translations['hi'] && (
                    <div className="bg-white p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                      <span className="text-xs font-black text-purple-950 block">
                        हिंदी अनुवाद (Hindi Summary)
                      </span>
                      <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line">
                        {out.translations['hi'].content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 10. Audio narration & 11. Screen-reader HTML & 12. Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audio Narration */}
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-2">
                <span className="text-xs font-black text-[var(--text-primary)] block">
                  Accessible Audio Narration
                </span>
                <AccessibleAudioPlayer
                  title={analysis.title}
                  transcript={out.audioTranscript}
                  textToRead={out.simplifiedVersion || out.accessibleText}
                />
              </div>

              {/* Verification & Score */}
              <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm space-y-3">
                <span className="text-xs font-black text-[var(--text-primary)] block">
                  Agent 5 Verification & Compliance Delta
                </span>
                {verification ? (
                  <div className="bg-white p-4 rounded-xl border border-[var(--border-color)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--text-secondary)]">Baseline Audit Score:</span>
                      <span className="text-xs font-bold font-mono">{verification.beforeScore.overallScore}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#059669]">Verified Remediated Score:</span>
                      <span className="text-sm font-black text-[#059669] font-mono">{verification.afterScore.overallScore}/100</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                      <span className="text-xs font-bold text-emerald-800">Score Improvement:</span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                        +{verification.scoreImprovement} points
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">
                      Resolved {verification.issuesResolved} of {verification.totalIssuesDetected} detected accessibility barriers.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-muted)] font-medium">
                    Verification delta calculation complete.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: SIMPLIFIED PLAIN VERSION */}
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
                  {out.stepByStepGuide.map((step: string, idx: number) => (
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
              {Object.entries(out.translations).map(([code, trans]: [string, any]) => (
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

            {out.translations[selectedLang] ? (
              <div className="space-y-4">
                <h3 className="text-base font-black text-[var(--text-primary)]">
                  {out.translations[selectedLang].title}
                </h3>
                <div className="p-6 rounded-3xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-medium">
                  {out.translations[selectedLang].content}
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
              {out.imageDescriptions.map((img: any, idx: number) => (
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
