import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { UniversalToolbar } from '@/components/accessibility/UniversalToolbar';
import { KeyboardShortcutsModal } from '@/components/accessibility/KeyboardShortcutsModal';
import { ScrollProgressBar } from '@/components/animation/ScrollProgressBar';
import { InteractiveDotField } from '@/components/animation/InteractiveDotField';

export const metadata: Metadata = {
  title: 'INCLUSA — Agentic Multimodal AI Accessibility Platform',
  description:
    'INCLUSA uses autonomous multimodal AI agents to detect digital accessibility barriers, apply personalized transformations, and verify measurable score improvement.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-contrast="normal" data-dyslexia="false">
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black relative">
        <AuthProvider>
          <AccessibilityProvider>
            {/* Interactive Cursor-Reactive Background Dot Field */}
            <InteractiveDotField />

            {/* Smooth Top Scroll Progress Bar */}
            <ScrollProgressBar />

            {/* Skip Link for WCAG Keyboard Navigation */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            <div className="relative z-10 flex-1 flex flex-col">
              <Navbar />

              <main id="main-content" className="flex-1 flex flex-col">
                {children}
              </main>

              <Footer />
            </div>

            {/* Universal Accessibility Controls & Hotkeys Guide */}
            <UniversalToolbar />
            <KeyboardShortcutsModal />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
