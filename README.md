# INCLUSA — Agentic Multimodal AI Accessibility Platform

> **Make Digital Information Accessible to Everyone.**
> Autonomous multimodal AI agents that detect digital accessibility barriers, personalize transformations to individual disability profiles, and mathematically verify measurable compliance improvements.

---

## 🌟 Overview & Core Product Vision

Digital information is available to everyone, but it is not equally accessible to everyone. **INCLUSA** solves this fundamental barrier by ingesting any digital content (PDF, Images, Documents, Audio, Video, Text, or live URLs) and orchestrating **6 specialized autonomous AI agents** to analyze, remediate, verify, and explain accessible versions in real time.

---

## 🤖 6-Agent Architecture: The Autonomous Decision Loop

INCLUSA executes the continuous intelligent loop:
```
PERCEIVE → REASON → PLAN → ACT → VERIFY → IMPROVE
```

1. **Agent 1 — Content Understanding Agent (`lib/agents/content-understanding.ts`)**:
   - Ingests multimodal content (PDF, Images, Audio, Video, DOCX, TXT, URLs).
   - Extracts structural reading order, headings, data tables, visual graphics/charts, audio waveforms, and speech language.
2. **Agent 2 — Accessibility Audit Agent (`lib/agents/accessibility-audit.ts`)**:
   - Runs 24+ WCAG 2.1 AA & AAA rules across 6 weighted categories.
   - Identifies missing alt text, unlabelled charts, reading complexity (Flesch-Kincaid), missing captions, and heading skips.
3. **Agent 3 — User Needs Agent (`lib/agents/user-needs.ts`)**:
   - Maps user disability profiles (Blind, Low vision, Dyslexia, Deaf, Telugu/Hindi primary language).
   - Dynamically prioritizes transformation plans.
4. **Agent 4 — Transformation Planning & Execution Agent (`lib/agents/transformation-engine.ts`)**:
   - Synthesizes multi-tiered image/chart descriptions (alt text, detailed numerical breakdowns, plain summaries).
   - Simplifies dense text into 7th-grade plain language and step-by-step takeaways.
   - Translates into regional languages (Telugu, Hindi, Tamil) while preserving semantic hierarchy.
   - Generates screen-reader-compliant semantic HTML5 with ARIA landmarks.
   - Generates WebVTT subtitles and audio transcripts with speaker labels.
5. **Agent 5 — Verification Agent (`lib/agents/verification-engine.ts`)**:
   - Re-audits remediated output against baseline issues.
   - Computes mathematical Before vs. After score improvements (+52 gain).
6. **Agent 6 — Explanation Agent (`lib/agents/explanation-agent.ts`)**:
   - Generates clear, plain-language narratives of what was remediated and which user groups benefit most.

---

## ⚖️ Programmatic Accessibility Scoring Engine

INCLUSA never fabricates scores. Overall scores (0..100) are mathematically derived from weighted categories and penalty deductions:

| Category | Weight | Focus Areas |
| :--- | :--- | :--- |
| **Vision Accessibility** | **20%** | Alt text, chart data descriptions, color contrast ratios |
| **Cognitive & Reading** | **20%** | Flesch-Kincaid grade level, paragraph length, jargon definitions |
| **Hearing Accessibility** | **15%** | Synchronized captions (WebVTT), audio transcripts |
| **Language Inclusion** | **15%** | Telugu/Hindi translations, language metadata tags |
| **Document Structure** | **15%** | H1-H3 heading hierarchy, linearized tables, column scopes |
| **Screen Reader Readiness** | **15%** | ARIA landmarks, reading sequence, decorative element hiding |

**Severity Penalty Scaling:**
- Critical: -28 points
- High: -16 points
- Medium: -8 points
- Low: -3 points

---

## ⚡ Dual AI Engine

INCLUSA is engineered with a dual AI architecture:
1. **Live AI Mode**: Reads `OPENAI_API_KEY` (GPT-4o / GPT-4o-mini) or `GEMINI_API_KEY` from environment variables for live multimodal vision, natural language simplification, translation, and RAG document Q&A.
2. **INCLUSA Demo Engine (Built-in Heuristic Fallback)**: Built-in deterministic NLP parsers, Flesch-Kincaid readability calculators, vision description heuristics, and Telugu/Hindi translation matrices that run out-of-the-box with zero configuration.

---

## 📁 Project Folder Structure

```
inclusa/
├── app/
│   ├── layout.tsx                    # Root layout with AccessibilityContext & Toolbar
│   ├── page.tsx                      # High-converting interactive Landing Page
│   ├── dashboard/page.tsx            # Analytics Dashboard & Recent Analyses
│   ├── analyze/page.tsx              # Multimodal Analysis Workspace & Live Agent Timeline
│   ├── audit/[id]/page.tsx           # Audit Report, Issue Explorer & AI Transformation Center
│   ├── output/[id]/page.tsx          # Multi-tab Output Viewer & Grounded RAG Assistant
│   ├── website/page.tsx              # Live Website Accessibility Scanner
│   ├── profile/page.tsx              # User Accessibility Profile & Preferences
│   ├── history/page.tsx              # Historical Analyses & Filters
│   ├── report/[id]/page.tsx          # 10-Section Printable Executive Accessibility Report
│   └── api/                          # Backend API Routes (analyze, transform, verify, chat)
├── components/
│   ├── accessibility/
│   │   ├── UniversalToolbar.tsx      # Persistent Accessibility Controls (Font, Contrast, Dyslexia)
│   │   └── KeyboardShortcutsModal.tsx# Accessible Hotkeys Guide (Alt+A, Alt+K, Alt+C)
│   ├── landing/
│   │   ├── HeroSection.tsx           # Hero with dynamic callouts
│   │   ├── InteractivePipelineVisualizer.tsx # 6-Agent animated state machine
│   │   ├── SampleDemoSelector.tsx    # 1-Click preloaded sample document launcher
│   │   └── MultimodalFeatureMatrix.tsx # Multimodal capabilities grid
│   ├── dashboard/
│   │   ├── MetricsGrid.tsx           # Total Analyses, Average Score, Issues Resolved
│   │   ├── RecentDocumentsTable.tsx  # Document list with score badges & actions
│   │   └── QuickUploadCard.tsx       # Fast ingestion widget
│   ├── analysis/
│   │   ├── MultimodalDropzone.tsx    # File, URL, and Paste ingestion
│   │   ├── AgentTimelinePanel.tsx    # Live agent execution progress
│   │   ├── ScoreGauge.tsx            # Radial SVG score visualizer
│   │   ├── ScoreCard.tsx             # 6-Category score breakdown
│   │   └── IssueExplorer.tsx         # Filterable barrier catalogue with "Fix with AI"
│   ├── transformation/
│   │   ├── TransformationCenter.tsx  # Customizable remediation checkboxes
│   │   ├── BeforeAfterView.tsx       # Side-by-side Score & Issue Delta visualizer
│   │   └── AccessibleOutputTabs.tsx  # Simplified, Telugu translation, and code viewer
│   ├── media/
│   │   └── AccessibleAudioPlayer.tsx # Audio player with interactive timestamp jumping & TTS
│   ├── chat/
│   │   └── InclusaAssistant.tsx      # Grounded RAG Document Assistant with citations
│   └── navigation/
│       ├── Navbar.tsx                # Responsive navigation with profile badge
│       └── Footer.tsx                # Accessible footer
├── context/
│   └── AccessibilityContext.tsx      # Universal Toolbar state & ARIA live announcer
├── lib/
│   ├── agents/                       # 6 Autonomous Agents + Master Orchestrator
│   ├── ai/                           # Dual AI Service (OpenAI / Gemini / Demo Engine)
│   ├── rules/                        # 24+ WCAG 2.1 AA/AAA accessibility rules
│   ├── scoring/                      # Algorithmic scoring & Before/After delta engine
│   ├── storage/                      # Unified client/server document persistence
│   └── mock/                         # 4 Preloaded rich sample files
├── styles/
│   └── globals.css                   # High-contrast themes, focus rings & CSS design tokens
├── types/
│   └── index.ts                      # Comprehensive TypeScript definitions
├── supabase-schema.sql               # PostgreSQL database schema with RLS
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your `OPENAI_API_KEY` or `GEMINI_API_KEY` for live AI processing. If omitted, INCLUSA seamlessly runs on its built-in multimodal demo engine.

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ♿ Universal Accessibility Features

INCLUSA is built accessible from the ground up:
- **Universal Accessibility Toolbar (`Alt + A`)**:
  - Text scaling: 100%, 115%, 130%, 150%
  - Color Contrast themes: Default Dark, Yellow on Black, High Contrast Dark, High Contrast Light
  - Dyslexia-friendly font toggle with heavy baselines
  - Line height (1.2 to 2.0) and letter spacing (0px to 3px) adjustments
  - Focus Reading Mode
  - Reduced motion toggle respecting `prefers-reduced-motion`
- **Keyboard Shortcuts (`Alt + K`)**:
  - `Alt + A`: Open Universal Toolbar
  - `Alt + K`: Open Keyboard Shortcuts Guide
  - `Alt + C`: Toggle Yellow-on-Black High Contrast
  - `Esc`: Close open dialogs and drawers
- **Assistive Technology Integration**:
  - WCAG 2.2 compliant 3px focus rings
  - Dynamic `aria-live="polite"` live announcements for screen readers
  - Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`)

---

## 🏆 Hackathon Demonstration Flow

To demonstrate INCLUSA during the presentation:
1. **Launch**: Open the landing page at [http://localhost:3000](http://localhost:3000).
2. **Select Sample**: Click any 1-click sample (e.g. *Enterprise Annual Financial & Growth Strategy 2025*).
3. **Watch Agents Execute**: Observe the real-time **INCLUSA Agent Orchestration Live Activity** panel execute Agent 1 through Agent 6.
4. **Inspect Audit**: View the baseline score (e.g. `42/100 - Needs Improvement`) and explore the detected barriers with inline *"Fix with AI"*.
5. **Transform Content**: Click **Transform Content** in the AI Transformation Center.
6. **Verify Before / After**: Inspect the visual **Before vs. After Delta** showing mathematical score gain (`42/100 → 94/100`, `+52 points`, 16 barriers resolved).
7. **Inspect Output Tabs**:
   - Read the **Simplified Plain Version** (7th grade level).
   - View the **Telugu (తెలుగు)** regional translation.
   - Inspect the multi-level **Image & Chart Descriptions**.
   - Test the **Accessible Audio Reader** with interactive timestamp jumping.
8. **Ask INCLUSA Assistant**: Ask *"Explain this document in simple Telugu"* or *"Describe figure 1"* and review grounded citations.
9. **Export Report**: Open **Executive Report** to view and print the 10-section formal accessibility audit report.

---

## 🔒 Security & Privacy
- Zero client-side API key exposure.
- Strict input sanitization and 25MB file size boundaries.
- Supabase Row-Level Security (RLS) policies isolating user records.
