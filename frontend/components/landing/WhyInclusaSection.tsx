'use client';

import React from 'react';
import { XCircle, CheckCircle2, Bot, ArrowRight, Sparkles, Check, Minus } from 'lucide-react';
import Link from 'next/link';

export const WhyInclusaSection: React.FC = () => {
  const comparisonMatrix = [
    { capability: 'Chat / Q&A', traditional: 'Partial', inclusa: true },
    { capability: 'Document Summarization', traditional: 'Partial', inclusa: true },
    { capability: 'Image & Chart Descriptions', traditional: 'Limited', inclusa: true },
    { capability: 'Multilingual Translation (Telugu, Hindi)', traditional: 'Standard text only', inclusa: true },
    { capability: 'WCAG 2.1 Accessibility Audit', traditional: 'Basic HTML lint only', inclusa: true },
    { capability: 'Weighted Accessibility Score (0-100)', traditional: false, inclusa: true },
    { capability: 'User Needs Personalization Profile', traditional: false, inclusa: true },
    { capability: 'AI Remediation Planning', traditional: false, inclusa: true },
    { capability: 'Automated Transformation Engine', traditional: false, inclusa: true },
    { capability: 'Independent Re-Verification', traditional: false, inclusa: true },
    { capability: 'Before vs After Score Measurement', traditional: false, inclusa: true },
    { capability: 'Autonomous 6-Agent Workflow', traditional: false, inclusa: true },
  ];

  return (
    <section className="py-20 bg-[var(--bg-secondary)]/40 border-t-2 border-[var(--border-strong)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black mb-3 inline-block">
            THE AGENTIC DIFFERENTIATOR
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            INCLUSA Doesn’t Just Find Problems.
          </h2>
          <div className="text-xl sm:text-2xl font-black text-[#059669] mt-2">
            It Understands. Plans. Remediates. Verifies.
          </div>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-4 leading-relaxed">
            General AI and traditional accessibility tools either stop at bug reports or lack personalized accessibility transformations. INCLUSA executes an autonomous 6-agent loop to solve the entire barrier lifecycle.
          </p>
        </div>

        {/* 2-Column High-Level Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* General AI / Traditional Tools Card (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-white border-2 border-rose-300 shadow-[4px_4px_0_0_#FDA4AF] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 border border-rose-300">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-primary)]">
                    General AI / Traditional Tools
                  </h3>
                  <p className="text-xs font-bold text-rose-700">Detect → Report → Stop</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-950 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>1. Detect simple syntax errors</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-950 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>2. Output passive violation list</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-xs font-black text-rose-950 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-600" />
                  <span>3. Stop (No personalized transformation)</span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                Result: Visual charts remain undescribed, complex jargon remains unsimplified, and accessibility barriers persist unaddressed.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-rose-200 text-xs font-black text-rose-700">
              No personalized remediation loop
            </div>
          </div>

          {/* INCLUSA Card (7 cols - Dominant) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138] flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]">
                  <CheckCircle2 className="h-6 w-6 text-[#059669]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[var(--text-primary)]">
                    INCLUSA Multimodal AI
                  </h3>
                  <p className="text-xs font-black text-[#059669]">
                    Understand → Audit → Personalize → Transform → Verify → Explain
                  </p>
                </div>
              </div>

              {/* Active Workflow Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <span><strong>Understand:</strong> Deep multimodal perception</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <span><strong>Audit:</strong> 24+ WCAG 2.1 criteria</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-xs font-black text-amber-950 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                  <span><strong>Personalize:</strong> User disability profile</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                  <span><strong>Transform:</strong> Alt text, Telugu, Audio</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-black text-emerald-950 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">5</span>
                  <span><strong>Verify:</strong> Re-audit score delta</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-black text-emerald-950 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">6</span>
                  <span><strong>Explain:</strong> Human-readable impact</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                Result: Instant accessible text, plain language summaries, multi-tier chart narratives, and screen-reader HTML verified from 42/100 to 94/100.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-xs font-black text-[#059669] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Verified Improvement
              </span>
              <Link
                href="/analyze"
                className="text-xs font-black text-[var(--text-primary)] hover:underline flex items-center gap-1"
              >
                <span>Try It Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Capabilities Comparison Table */}
        <div className="rounded-3xl bg-white border-3 border-[var(--border-strong)] shadow-[8px_8px_0_0_#192138] overflow-hidden">
          <div className="p-6 border-b-2 border-[var(--border-strong)] bg-amber-50">
            <h3 className="text-base font-black text-[var(--text-primary)]">
              Direct Capability Comparison
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
              Evaluating capabilities across the complete accessibility remediation lifecycle
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[var(--border-strong)] bg-[var(--bg-primary)] font-black text-[var(--text-primary)]">
                  <th className="p-4 pl-6">Platform Capability</th>
                  <th className="p-4 text-center">General AI / Traditional Tools</th>
                  <th className="p-4 pr-6 text-center text-[#059669] bg-emerald-50">INCLUSA Agentic Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y border-[var(--border-color)]">
                {comparisonMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-4 pl-6 font-bold text-[var(--text-primary)]">
                      {row.capability}
                    </td>
                    <td className="p-4 text-center font-medium text-[var(--text-secondary)]">
                      {typeof row.traditional === 'boolean' ? (
                        row.traditional ? (
                          <Check className="h-4 w-4 text-emerald-600 inline" />
                        ) : (
                          <Minus className="h-4 w-4 text-rose-500 inline" />
                        )
                      ) : (
                        <span className="text-[11px] text-[var(--text-muted)]">{row.traditional}</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-center font-black text-[#059669] bg-emerald-50/50">
                      <span className="inline-flex items-center gap-1 text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <Check className="h-3.5 w-3.5 text-emerald-700" /> Yes
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
