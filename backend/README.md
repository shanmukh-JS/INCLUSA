# ⚡ INCLUSA Backend & Autonomous AI Agent Services

This directory contains the core intelligence, multimodal agents, WCAG audit rules, scoring algorithms, and AI integrations for the **INCLUSA** platform.

---

## 📁 Architecture Overview

```
backend/
├── agents/                       # The 6 Autonomous Specialized AI Agents
│   ├── content-understanding.ts  # Agent 1: Multimodal Layout, OCR, & Speech Extraction
│   ├── accessibility-audit.ts    # Agent 2: 24+ WCAG 2.1 AA/AAA Compliance Rule Engine
│   ├── user-needs.ts             # Agent 3: User Disability Profile Personalization
│   ├── transformation-engine.ts  # Agent 4: Remediation Synthesizer (Alt Text, Telugu, Audio)
│   ├── verification-engine.ts    # Agent 5: Mathematical Re-Audit & Delta Verification
│   ├── explanation-agent.ts      # Agent 6: Human-Readable Benefit Summarizer
│   └── orchestrator.ts           # Master Agent Coordination Loop
├── ai/
│   └── ai-service.ts             # Dual AI Engine (Google Gemini 1.5 Pro / GPT-4o / Local NLP Fallback)
├── scoring/
│   └── accessibility-scorer.ts   # Weighted 6-Category Accessibility Scoring Engine
└── rules/
    └── wcag-rules.ts             # 24+ Deterministic WCAG 2.1 AA & AAA Rules
```

---

## 🤖 The 6-Agent Autonomous Pipeline
1. **UNDERSTAND**: Parses PDF structure, diagrams, data tables, audio waveforms, and reading order.
2. **AUDIT**: Executes 24+ deterministic rules across Vision, Cognitive, Hearing, Language, Structure, and Screen Reader.
3. **PERSONALIZE**: Reads individual accessibility profiles (e.g. Low Vision + Telugu Speaker + Cognitive Simplification).
4. **TRANSFORM**: Synthesizes alt text, natural Telugu translations, 7th-grade plain language, and audio narration.
5. **VERIFY**: Re-scans generated output to prove mathematical score improvement (e.g. 42/100 $\rightarrow$ 94/100, +52 gain).
6. **EXPLAIN**: Generates transparent, human-readable executive summaries of all remediations.

---

## ⚖️ Weighted Scoring Methodology
- **Vision Accessibility**: 20%
- **Cognitive & Reading**: 20%
- **Hearing Accessibility**: 15%
- **Language Inclusion**: 15%
- **Document Structure**: 15%
- **Screen Reader Readiness**: 15%
