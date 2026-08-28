'use client';

import React, { useState } from 'react';
import { TransformationItem } from '@/types';
import {
  Wand2,
  Sparkles,
  CheckSquare,
  Square,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface TransformationCenterProps {
  transformations: TransformationItem[];
  onExecuteTransformations: (selectedItems: TransformationItem[]) => void;
  isTransforming: boolean;
}

export const TransformationCenter: React.FC<TransformationCenterProps> = ({
  transformations,
  onExecuteTransformations,
  isTransforming,
}) => {
  const [items, setItems] = useState<TransformationItem[]>(transformations);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setItems((prev) => prev.map((t) => ({ ...t, selected: select })));
  };

  const handleRun = () => {
    onExecuteTransformations(items);
  };

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[var(--border-strong)]">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-[#059669]" />
            <h2 className="text-lg font-black text-[var(--text-primary)]">
              AI Transformation Center
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
            Select automated remediations to resolve detected barriers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSelectAll(true)}
            className="text-[11px] font-black text-[#059669] hover:underline"
          >
            Select All
          </button>
          <span className="text-[var(--text-muted)] text-xs font-bold">•</span>
          <button
            type="button"
            onClick={() => handleSelectAll(false)}
            className="text-[11px] font-bold text-[var(--text-muted)] hover:underline"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Transformation Checkbox List */}
      <div className="space-y-3.5 my-6">
        {items.map((item) => (
          <label
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              item.selected
                ? 'border-[var(--border-strong)] bg-emerald-50 shadow-[3px_3px_0_0_#192138]'
                : 'border-[var(--border-color)] bg-[var(--bg-primary)] opacity-70 hover:opacity-100'
            }`}
          >
            <div className="mt-0.5 text-emerald-800 shrink-0">
              {item.selected ? (
                <CheckSquare className="h-5 w-5 fill-[#059669] text-white" />
              ) : (
                <Square className="h-5 w-5 text-[var(--text-muted)]" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
                  {item.title}
                </span>
                {item.isRecommended && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-400">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t-2 border-[var(--border-strong)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-[var(--text-secondary)]">
          {selectedCount} of {items.length} remediations selected
        </span>

        <button
          type="button"
          onClick={handleRun}
          disabled={selectedCount === 0 || isTransforming}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {isTransforming ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Applying Remediations...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Transform Content ({selectedCount})</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
