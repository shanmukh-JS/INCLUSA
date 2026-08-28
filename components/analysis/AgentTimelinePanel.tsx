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
} from 'lucide-react';

interface AgentTimelinePanelProps {
  steps: AgentStep[];
  isProcessing: boolean;
}

export const AgentTimelinePanel: React.FC<AgentTimelinePanelProps> = ({
  steps,
  isProcessing,
}) => {
  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'content_understanding':
        return FileSearch;
      case 'accessibility_audit':
        return ShieldAlert;
      case 'user_needs':
        return UserCheck;
      case 'transformation_engine':
        return Wand2;
      case 'verification_engine':
        return CheckCircle2;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138]">
      <div className="flex items-center justify-between pb-4 border-b-2 border-[var(--border-strong)] mb-6">
        <div className="flex items-center gap-2.5">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-base font-black text-[var(--text-primary)]">
            Agent Orchestration Live Activity
          </h2>
        </div>
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs font-black text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-700" />
            <span>Autonomous Pipeline Running</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const Icon = getAgentIcon(step.agentType);
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isFailed = step.status === 'failed';
          const isPending = step.status === 'pending' || step.status === 'waiting';

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                isRunning
                  ? 'border-[var(--border-strong)] bg-sky-50 shadow-[3px_3px_0_0_#192138] translate-y-[-1px]'
                  : isCompleted
                  ? 'border-emerald-300 bg-emerald-50/60'
                  : 'border-[var(--border-color)] bg-[var(--bg-primary)] opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                      isRunning
                        ? 'bg-sky-200 border-sky-400 text-sky-950 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-200 border-emerald-400 text-emerald-950'
                        : 'bg-white border-[var(--border-color)] text-[var(--text-muted)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[var(--text-primary)]">
                        {step.name}
                      </span>
                      {step.durationMs !== undefined && (
                        <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1 font-bold">
                          <Clock className="h-3 w-3" /> {step.durationMs}ms
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                      {step.currentTask}
                    </p>

                    {/* Agent Findings Summary */}
                    {step.findings && (
                      <div className="mt-2.5 p-3 rounded-xl bg-white border border-[var(--border-color)] text-[11px] text-[var(--text-primary)] leading-relaxed font-medium">
                        <span className="font-black text-[#059669] mr-1.5">✓ Finding:</span>
                        {step.findings}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0">
                  {isRunning && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-sky-950 bg-sky-200 px-2.5 py-1 rounded-xl border border-sky-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Running
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-950 bg-emerald-200 px-2.5 py-1 rounded-xl border border-emerald-400">
                      <Check className="h-3.5 w-3.5 text-emerald-800" />
                      Done
                    </span>
                  )}
                  {isFailed && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-950 bg-rose-200 px-2.5 py-1 rounded-xl border border-rose-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Error
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] font-bold text-[var(--text-muted)] bg-white px-2 py-0.5 rounded-lg border border-[var(--border-color)]">
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
