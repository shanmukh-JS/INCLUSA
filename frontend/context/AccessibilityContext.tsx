'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilityToolbarSettings } from '@/types';

interface AccessibilityContextType {
  settings: AccessibilityToolbarSettings;
  updateSetting: <K extends keyof AccessibilityToolbarSettings>(
    key: K,
    value: AccessibilityToolbarSettings[K]
  ) => void;
  resetSettings: () => void;
  announceToScreenReader: (message: string) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isToolbarExpanded: boolean;
  setIsToolbarExpanded: (expanded: boolean) => void;
}

const DEFAULT_SETTINGS: AccessibilityToolbarSettings = {
  textSize: 100,
  highContrast: 'normal',
  dyslexiaFont: false,
  lineSpacing: 1.5,
  letterSpacing: 0,
  focusMode: false,
  reducedMotion: false,
  screenReaderGuide: false,
};

const STORAGE_KEY = 'inclusa_toolbar_settings_v1';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilityToolbarSettings>(DEFAULT_SETTINGS);
  const [announcement, setAnnouncement] = useState<string>('');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Error reading accessibility settings', e);
    }
  }, []);

  // Apply CSS Variables and HTML Data Attributes
  useEffect(() => {
    const root = document.documentElement;

    // Contrast
    root.setAttribute('data-contrast', settings.highContrast);

    // Dyslexia font
    root.setAttribute('data-dyslexia', settings.dyslexiaFont ? 'true' : 'false');

    // Focus mode
    root.setAttribute('data-focus-mode', settings.focusMode ? 'true' : 'false');

    // Reduced motion
    root.setAttribute('data-reduced-motion', settings.reducedMotion ? 'true' : 'false');

    // Text scale
    root.style.setProperty('--font-scale', `${settings.textSize}%`);

    // Line spacing
    root.style.setProperty('--line-height-scale', `${settings.lineSpacing}`);

    // Letter spacing
    root.style.setProperty('--letter-spacing-scale', `${settings.letterSpacing}px`);

    // Persist
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving accessibility settings', e);
    }
  }, [settings]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Alt + A: Toggle Accessibility Toolbar
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsToolbarExpanded((prev) => !prev);
        announceToScreenReader('Accessibility toolbar toggled');
      }

      // Alt + K: Open Keyboard Shortcuts
      if (e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }

      // Alt + C: Toggle High Contrast
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setSettings((prev) => {
          const next = prev.highContrast === 'normal' ? 'yellow-on-black' : 'normal';
          announceToScreenReader(`Contrast mode set to ${next}`);
          return { ...prev, highContrast: next };
        });
      }

      // Escape: Close modals / toolbar
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsToolbarExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateSetting = <K extends keyof AccessibilityToolbarSettings>(
    key: K,
    value: AccessibilityToolbarSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    announceToScreenReader('Accessibility settings reset to default');
  };

  const announceToScreenReader = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        announceToScreenReader,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isToolbarExpanded,
        setIsToolbarExpanded,
      }}
    >
      {children}

      {/* Screen Reader ARIA Live Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="inclusa-screen-reader-announcer"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
