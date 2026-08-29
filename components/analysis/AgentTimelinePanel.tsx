'use client';

import React from 'react';
import { AgentStep } from '@/types';
import {
  FileSearch,
  ShieldAlert,
  UserCheck,
  Wand2,
  CheckCircle2,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Award,
} from 'lucide-react';

interface AgentTimelinePanelProps {
  steps: AgentStep[];
  isProcessing: boolean;
}

export const AgentTimelinePanel: React.FC<AgentTimelinePanelProps> = ({
  steps,
  isProcessing,
}) => {
  const getAgentDetails = (type: string, stepIdx: number) => {
    switch (type) {
      case 'content_understanding':
        return {
          icon: FileSearch,
          number: '1',
          title: 'Agent 1 — Content Understanding',
          simpleTagline: 'INCLUSA is reading and understanding the document structure.',
          badgeColor: 'bg-blue-600 text-white',
          themeColor: 'border-blue-300 bg-blue-50/50',
          iconBg: 'bg-blue-100 text-blue-800 border-blue-300',
        };
      case 'accessibility_audit':
        return {
          icon: ShieldAlert,
          number: '2',
          title: 'Agent 2 — Accessibility Audit',
          simpleTagline: 'INCLUSA is checking the content for accessibility barriers.',
          badgeColor: 'bg-rose-600 text-white',
          themeColor: 'border-rose-300 bg-rose-50/50',
          iconBg: 'bg-rose-100 text-rose-800 border-rose-300',
        };
      case 'user_needs':
        return {
          icon: UserCheck,
          number: '3',
          title: 'Agent 3 — User Needs',
          simpleTagline: 'INCLUSA is adapting the solution to this user’s accessibility preferences.',
          badgeColor: 'bg-purple-600 text-white',
          themeColor: 'border-purple-300 bg-purple-50/50',
          iconBg: 'bg-purple-100 text-purple-800 border-purple-300',
        };
      case 'transformation_engine':
        return {
          icon: Wand2,
          number: '4',
          title: 'Agent 4 — Transformation',
          simpleTagline: 'INCLUSA is converting the content into formats that are easier to access.',
          badgeColor: 'bg-amber-600 text-white',
          themeColor: 'border-amber-300 bg-amber-50/50',
          iconBg: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'verification_engine':
        return {
          icon: CheckCircle2,
          number: '5',
          title: 'Agent 5 — Verification',
          simpleTagline: 'INCLUSA is checking whether the transformed content is actually more accessible.',
          badgeColor: 'bg-emerald-600 text-white',
          themeColor: 'border-emerald-300 bg-emerald-50/50',
          iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'explanation_agent':
      default:
        return {
          icon: Award,
          number: '6',
          title: 'Agent 6 — Explanation',
          simpleTagline: 'INCLUSA is explaining what changed and who benefits.',
          badgeColor: 'bg-teal-600 text-white',
          themeColor: 'border-teal-300 bg-teal-50/50',
          iconBg: 'bg-teal-100 text-teal-800 border-teal-300',
        };
    }
  };

  return (
    <div className="rounded-3xl border-3 border-[var(--border-strong)] bg-white p-5 sm:p-7 shadow-[6px_6px_0_0_#192138] space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[var(--border-strong)]">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div>
            <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
              6-Agent Autonomous AI Pipeline
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              Live execution trace of the 6 specialized AI agents.
            </p>
          </div>
        </div>

        {isProcessing && (
          <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-950 bg-emerald-100 px-3 py-1.5 rounded-xl border-2 border-emerald-300 shadow-sm animate-pulse self-start sm:self-auto">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
            <span>Autonomous Pipeline Running</span>
          </div>
        )}
      </div>

      {/* Agents Timeline (Vertical Stack on All Devices for Complete Responsiveness) */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const details = getAgentDetails(step.agentType, idx);
          const Icon = details.icon;
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isFailed = step.status === 'failed';
          const isPending = step.status === 'pending' || step.status === 'waiting';

          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 ${
                isRunning
                  ? 'border-[var(--border-strong)] bg-sky-50 shadow-[4px_4px_0_0_#192138] translate-y-[-1px]'
                  : isCompleted
                  ? 'border-emerald-300 bg-emerald-50/40 shadow-sm'
                  : isFailed
                  ? 'border-rose-300 bg-rose-50 shadow-sm'
                  : 'border-[var(--border-color)] bg-[var(--bg-primary)] opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Agent Icon & Badge */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                      isRunning
                        ? 'bg-sky-200 border-sky-400 text-sky-950 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-200 border-emerald-400 text-emerald-950'
                        : isFailed
                        ? 'bg-rose-200 border-rose-400 text-rose-950'
                        : 'bg-white border-[var(--border-color)] text-[var(--text-muted)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${details.badgeColor}`}>
                        Agent {details.number}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
                        {step.name.replace(/^Agent\s+\d+\s*—\s*/, '')}
                      </span>
                      {step.durationMs !== undefined && (
                        <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1 font-bold">
                          <Clock className="h-3 w-3" /> {step.durationMs}ms
                        </span>
                      )}
                    </div>

                    {/* Simple Human-Friendly Tagline */}
                    <p className="text-xs text-[var(--text-secondary)] font-bold mt-1">
                      {details.simpleTagline}
                    </p>

                    {/* Progress Bar while running */}
                    {isRunning && (
                      <div className="mt-3 w-full bg-sky-200/80 rounded-full h-2 overflow-hidden border border-sky-300">
                        <div
                          className="bg-[#059669] h-full rounded-full transition-all duration-300 ease-out animate-pulse"
                          style={{ width: `${step.progressPercent || 45}%` }}
                        />
                      </div>
                    )}

                    {/* Real Findings Output Box */}
                    {step.findings && (
                      <div className="mt-3 p-3.5 rounded-xl bg-white border-2 border-[var(--border-strong)] text-xs text-[var(--text-primary)] leading-relaxed font-medium shadow-sm break-words">
                        <div className="flex items-center gap-1.5 mb-1 font-black text-[#059669]">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          <span>Real Agent Result:</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-primary)] font-medium leading-relaxed">
                          {step.findings}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {isRunning && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-sky-950 bg-sky-100 px-2.5 py-1 rounded-xl border border-sky-300 shadow-sm animate-pulse">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-700" />
                      <span className="hidden sm:inline">Processing</span>
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-950 bg-emerald-200 px-2.5 py-1 rounded-xl border border-emerald-400 shadow-sm">
                      <Check className="h-3.5 w-3.5 text-emerald-800" />
                      <span>Done</span>
                    </span>
                  )}
                  {isFailed && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-950 bg-rose-200 px-2.5 py-1 rounded-xl border border-rose-400 shadow-sm">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-700" />
                      <span>Failed</span>
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] font-bold text-[var(--text-muted)] bg-white px-2 py-1 rounded-lg border border-[var(--border-color)]">
                      Queued
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
