'use client';

import React from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import {
  Accessibility,
  Eye,
  Type,
  Maximize2,
  Sliders,
  RotateCcw,
  Sparkles,
  Keyboard,
  X,
} from 'lucide-react';

export const UniversalToolbar: React.FC = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    isToolbarExpanded,
    setIsToolbarExpanded,
    setIsShortcutsOpen,
  } = useAccessibility();

  return (
    <aside
      aria-label="Universal Accessibility Toolbar"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none"
    >
      {/* Expanded Controls Drawer */}
      {isToolbarExpanded && (
        <div
          role="dialog"
          aria-label="Accessibility Settings Panel"
          className="mb-3 w-[calc(100vw-32px)] max-w-sm rounded-3xl border-3 border-[var(--border-strong)] bg-white p-5 sm:p-6 shadow-[8px_8px_0_0_#192138] transition-all duration-200"
        >

          <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-strong)]">
            <div className="flex items-center gap-2 font-black text-sm text-[var(--text-primary)]">
              <Accessibility className="h-5 w-5 text-[#059669]" aria-hidden="true" />
              <span>Accessibility Suite</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={resetSettings}
                title="Reset to defaults"
                aria-label="Reset accessibility settings"
                className="p-1.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-amber-50"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsToolbarExpanded(false)}
                aria-label="Close accessibility toolbar"
                className="p-1.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-amber-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* 1. Text Size Scaling */}
            <div>
              <div className="flex justify-between text-xs font-black text-[var(--text-primary)] mb-2">
                <span className="flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-[#059669]" /> Text Size
                </span>
                <span className="font-mono text-[#059669]">{settings.textSize}%</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 115, 130, 150].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateSetting('textSize', size)}
                    className={`py-2 text-xs font-black rounded-xl border-2 transition-all ${
                      settings.textSize === size
                        ? 'bg-amber-200 text-amber-950 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                        : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-amber-50'
                    }`}
                  >
                    {size}%
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Contrast Themes */}
            <div>
              <div className="text-xs font-black text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-sky-600" /> Color Contrast
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'normal', label: 'Default Cream' },
                  { id: 'yellow-on-black', label: 'Yellow on Black' },
                  { id: 'high-contrast-dark', label: 'High Contrast (D)' },
                  { id: 'high-contrast-light', label: 'High Contrast (L)' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => updateSetting('highContrast', c.id as any)}
                    className={`py-2 px-2.5 text-xs font-black rounded-xl border-2 text-left truncate transition-all ${
                      settings.highContrast === c.id
                        ? 'bg-amber-200 text-amber-950 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                        : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-amber-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Dyslexia Friendly Font */}
            <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)]">
              <div>
                <div className="text-xs font-black text-[var(--text-primary)]">Dyslexia Font</div>
                <div className="text-[10px] text-[var(--text-muted)] font-medium">Weighted baseline font</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.dyslexiaFont}
                onClick={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                className={`w-12 h-6 rounded-full transition-colors relative border-2 border-[var(--border-strong)] ${
                  settings.dyslexiaFont ? 'bg-[#059669]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full border border-[var(--border-strong)] transition-transform ${
                    settings.dyslexiaFont ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* 4. Line & Letter Spacing */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-black text-[var(--text-primary)] block mb-1">
                  Line Height
                </label>
                <select
                  aria-label="Line Height"
                  value={settings.lineSpacing}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateSetting('lineSpacing', parseFloat(e.target.value))}
                  className="w-full text-xs font-bold py-2 px-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-[var(--text-primary)]"
                >
                  <option value={1.2}>Compact (1.2)</option>
                  <option value={1.55}>Standard (1.55)</option>
                  <option value={1.8}>Spacious (1.8)</option>
                  <option value={2.0}>Maximum (2.0)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-[var(--text-primary)] block mb-1">
                  Letter Spacing
                </label>
                <select
                  aria-label="Letter Spacing"
                  value={settings.letterSpacing}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateSetting('letterSpacing', parseInt(e.target.value, 10))}
                  className="w-full text-xs font-bold py-2 px-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-[var(--text-primary)]"
                >
                  <option value={0}>Normal (0px)</option>
                  <option value={1}>Wide (+1px)</option>
                  <option value={2}>Extra Wide (+2px)</option>
                  <option value={3}>Maximum (+3px)</option>
                </select>
              </div>
            </div>

            {/* 5. Focus Mode & Reduced Motion */}
            <div className="space-y-2.5 pt-2 border-t-2 border-[var(--border-strong)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-purple-600" /> Focus Reading Mode
                </span>
                <input
                  type="checkbox"
                  checked={settings.focusMode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting('focusMode', e.target.checked)}
                  className="h-4 w-4 rounded accent-[#059669]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-amber-600" /> Reduce Motion
                </span>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting('reducedMotion', e.target.checked)}
                  className="h-4 w-4 rounded accent-[#059669]"
                />
              </div>
            </div>

            {/* Keyboard Shortcuts Button */}
            <button
              type="button"
              onClick={() => {
                setIsShortcutsOpen(true);
                setIsToolbarExpanded(false);
              }}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs font-black text-[var(--text-primary)] hover:bg-amber-100 shadow-[2px_2px_0_0_#192138] flex items-center justify-center gap-2"
            >
              <Keyboard className="h-3.5 w-3.5 text-[#059669]" />
              <span>Keyboard Shortcuts (Alt + K)</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        type="button"
        id="universal-accessibility-trigger"
        onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
        aria-expanded={isToolbarExpanded}
        aria-label="Universal Accessibility Controls (Shortcut: Alt + A)"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-white text-[var(--text-primary)] font-black text-xs border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#192138] active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <Accessibility className="h-5 w-5 text-[#059669]" aria-hidden="true" />
        <span className="text-xs font-black tracking-wide hidden sm:inline">Accessibility</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-950 font-mono hidden md:inline">
          Alt+A
        </span>
      </button>
    </aside>
  );
};
