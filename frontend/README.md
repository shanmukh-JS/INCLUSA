# 🎨 INCLUSA Frontend UI & User Interaction Layer

This directory contains the user interface, interactive visualizers, media players, and accessibility toolbars for the **INCLUSA** platform.

---

## 📁 Architecture Overview

```
frontend/
├── app/                          # Next.js App Router (Pages & Layouts)
│   ├── layout.tsx                # Root layout with AccessibilityContext & Universal Toolbar
│   ├── page.tsx                  # Interactive Landing Page & 1-Click Showcase
│   ├── dashboard/page.tsx        # Accessibility Workspace & KPI Analytics
│   ├── analyze/page.tsx          # Multimodal Ingestion & Agent Timeline Workspace
│   ├── audit/[id]/page.tsx       # WCAG Audit Report & Issue Explorer
│   ├── output/[id]/page.tsx      # Accessible Output Tabs & RAG Assistant
│   ├── profile/page.tsx          # User Accessibility Profile Editor
│   ├── history/page.tsx          # Filterable Accessibility History
│   ├── website/page.tsx          # Live Website Accessibility Crawler
│   └── report/[id]/page.tsx      # 10-Section Printable Executive Report
├── components/                   # Modular React Component Library
│   ├── landing/                  # 15 Interactive landing page sections
│   ├── dashboard/                # MetricsGrid, RecentDocumentsTable, QuickUpload
│   ├── analysis/                 # FileDropzone, AgentTimeline, IssueExplorer
│   ├── transformation/           # AccessibleOutputTabs, BeforeAfterComparison
│   ├── chat/                     # InclusaAssistant (Context-grounded Q&A)
│   ├── accessibility/            # UniversalToolbar, KeyboardShortcutsModal
│   ├── media/                    # AccessibleAudioPlayer, CaptionedVideoPlayer
│   ├── navigation/               # Paper-card Navbar & Accessible Footer
│   └── ui/                       # InclusaMascot (Incli with 8 expressive poses)
├── context/
│   └── AccessibilityContext.tsx  # Dynamic styling, contrast themes & dyslexia font
└── styles/
    └── globals.css               # Design tokens, high-contrast themes & full-width layout
```

---

## ♿ Universal Accessibility Features
- **Universal Toolbar (`Alt + A`)**: Live font scaling (80% to 200%), line-height control, letter-spacing, OpenDyslexic font mode, and 4 high-contrast color themes.
- **Keyboard Shortcuts (`Alt + K`)**: Complete hotkey navigation for screen reader users and keyboard-only access.
- **Screen Reader Optimization**: Semantic HTML5 elements (`<main>`, `<nav>`, `<header>`, `<article>`), ARIA landmarks, and live status announcer.
- **Full-Width Responsive UI**: Engineered for wide monitors up to 1920px max-width with warm cream retro-modern paper card aesthetics.
