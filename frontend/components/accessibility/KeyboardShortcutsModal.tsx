'use client';

import React from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Keyboard, X } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useAccessibility();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'Alt + A', description: 'Open Universal Accessibility Toolbar' },
    { key: 'Alt + K', description: 'Open Keyboard Shortcuts Guide' },
    { key: 'Alt + C', description: 'Toggle High Contrast Mode (Yellow-on-Black)' },
    { key: 'Tab', description: 'Navigate forward between interactive elements' },
    { key: 'Shift + Tab', description: 'Navigate backward between interactive elements' },
    { key: 'Enter / Space', description: 'Activate buttons, links, and switches' },
    { key: 'Esc', description: 'Close modals, drawers, and active dialogs' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setIsShortcutsOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-3xl border-3 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[10px_10px_0_0_#192138]"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b-2 border-[var(--border-strong)]">
          <div className="flex items-center gap-2.5 font-black text-lg text-[var(--text-primary)]">
            <Keyboard className="h-5 w-5 text-[#059669]" aria-hidden="true" />
            <h2 id="shortcuts-modal-title">Keyboard Navigation & Shortcuts</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(false)}
            aria-label="Close shortcuts guide"
            className="p-1.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-amber-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm"
            >
              <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">{s.description}</span>
              <kbd className="px-3 py-1 text-xs font-mono font-black rounded-xl border-2 border-[var(--border-strong)] bg-amber-100 text-amber-950 shadow-[1px_1px_0_0_#192138]">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(false)}
            className="px-6 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138]"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
