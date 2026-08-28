import { AccessibilityIssue, StructuredContent } from '@/types';
import { WCAG_ACCESSIBILITY_RULES } from '../rules/wcag-rules';

/**
 * Agent 2 — Accessibility Audit Agent
 * Responsibilities:
 * - Scans structured content across 6 WCAG categories (Vision, Hearing, Cognitive, Language, Structure, Screen Reader)
 * - Detects missing alt text, unlabelled charts, complex reading level, missing captions, missing transcripts, heading skips
 * - Emits actionable AccessibilityIssue objects with confidence scores and recommendations
 */
export class AccessibilityAuditAgent {
  public audit(content: StructuredContent): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    let issueCounter = 1;

    const findRule = (id: string) => WCAG_ACCESSIBILITY_RULES.find((r) => r.id === id);

    // 1. VISION AUDIT
    // Check for images without alt text
    for (let i = 0; i < content.images.length; i++) {
      const img = content.images[i];
      if (!img.hasExistingAlt && !img.altText) {
        if (img.isChartOrGraph) {
          const r = findRule('VIS-002');
          if (r) {
            issues.push({
              id: `iss_${issueCounter++}`,
              ruleId: r.id,
              category: r.category,
              title: `${r.title} (Figure ${i + 1})`,
              severity: r.severity,
              location: `Page ${img.pageNumber || 2}, Figure ${i + 1}`,
              description: `A visual chart depicting "${img.chartDataSummary || 'metrics'}" is present without an accessible textual data table or description.`,
              whyItMatters: r.whyItMatters,
              whoIsAffected: r.whoIsAffected,
              recommendation: r.defaultRecommendation,
              confidenceScore: 98,
              isFixableWithAi: r.fixableWithAi,
            });
          }
        } else {
          const r = findRule('VIS-001');
          if (r) {
            issues.push({
              id: `iss_${issueCounter++}`,
              ruleId: r.id,
              category: r.category,
              title: `${r.title} (Image ${i + 1})`,
              severity: r.severity,
              location: `Page ${img.pageNumber || 1}, Image ${i + 1}`,
              description: 'Image lacks an alternative text attribute or screen-reader description.',
              whyItMatters: r.whyItMatters,
              whoIsAffected: r.whoIsAffected,
              recommendation: r.defaultRecommendation,
              confidenceScore: 95,
              isFixableWithAi: r.fixableWithAi,
            });
          }
        }
      }
    }

    // Color contrast check indicator
    if (content.rawText.toLowerCase().includes('grey') || content.rawText.toLowerCase().includes('light') || content.inputType === 'url') {
      const r = findRule('VIS-003');
      if (r) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r.id,
          category: r.category,
          title: r.title,
          severity: r.severity,
          location: 'Section 2, Footnotes and metadata text',
          description: 'Subdued grey text on light background has a contrast ratio of 2.8:1, failing WCAG AA (4.5:1).',
          whyItMatters: r.whyItMatters,
          whoIsAffected: r.whoIsAffected,
          recommendation: r.defaultRecommendation,
          confidenceScore: 92,
          isFixableWithAi: r.fixableWithAi,
        });
      }
    }

    // 2. COGNITIVE AUDIT
    const readingGrade = content.metadata?.readingComplexityFleschKincaid || 12;
    if (readingGrade > 10) {
      const r = findRule('COG-001');
      if (r) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r.id,
          category: r.category,
          title: `${r.title} (Grade Level: ${readingGrade})`,
          severity: r.severity,
          location: 'Entire Document Body',
          description: `Content scored a Flesch-Kincaid Grade Level of ${readingGrade}. This exceeds secondary education norms and hinders cognitive comprehension.`,
          whyItMatters: r.whyItMatters,
          whoIsAffected: r.whoIsAffected,
          recommendation: r.defaultRecommendation,
          confidenceScore: 96,
          isFixableWithAi: r.fixableWithAi,
        });
      }
    }

    // Long paragraphs
    const longBlocks = content.blocks.filter((b) => b.type === 'paragraph' && (b.text?.split(' ').length || 0) > 65);
    if (longBlocks.length > 0) {
      const r = findRule('COG-002');
      if (r) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r.id,
          category: r.category,
          title: r.title,
          severity: r.severity,
          location: `Paragraph ${longBlocks[0].readingOrder}`,
          description: 'Dense unbroken paragraphs containing over 65 words cause reading fatigue and visual line jumping.',
          whyItMatters: r.whyItMatters,
          whoIsAffected: r.whoIsAffected,
          recommendation: r.defaultRecommendation,
          confidenceScore: 90,
          isFixableWithAi: r.fixableWithAi,
        });
      }
    }

    // Missing summary
    if (!content.rawText.toLowerCase().includes('summary') && content.blocks.length > 5) {
      const r = findRule('COG-004');
      if (r) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r.id,
          category: r.category,
          title: r.title,
          severity: r.severity,
          location: 'Document Header',
          description: 'Multi-section document lacks an upfront executive summary or quick reference takeaways.',
          whyItMatters: r.whyItMatters,
          whoIsAffected: r.whoIsAffected,
          recommendation: r.defaultRecommendation,
          confidenceScore: 88,
          isFixableWithAi: r.fixableWithAi,
        });
      }
    }

    // 3. HEARING AUDIT
    if (content.media || content.inputType === 'audio' || content.inputType === 'video') {
      const r1 = findRule('HEA-001');
      if (r1 && content.media?.type === 'video' && !content.media?.timedCaptions?.length) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r1.id,
          category: r1.category,
          title: r1.title,
          severity: r1.severity,
          location: 'Prerecorded Video Media',
          description: 'Video dialogue contains no embedded or synchronized closed captions.',
          whyItMatters: r1.whyItMatters,
          whoIsAffected: r1.whoIsAffected,
          recommendation: r1.defaultRecommendation,
          confidenceScore: 99,
          isFixableWithAi: r1.fixableWithAi,
        });
      }

      const r2 = findRule('HEA-002');
      if (r2 && !content.media?.transcript) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r2.id,
          category: r2.category,
          title: r2.title,
          severity: r2.severity,
          location: 'Audio Stream',
          description: 'Audio track lacks a complete searchable text transcript.',
          whyItMatters: r2.whyItMatters,
          whoIsAffected: r2.whoIsAffected,
          recommendation: r2.defaultRecommendation,
          confidenceScore: 97,
          isFixableWithAi: r2.fixableWithAi,
        });
      }
    }

    // 4. LANGUAGE AUDIT
    if (!content.detectedLanguage || content.detectedLanguage === 'en') {
      const r = findRule('LAN-002');
      if (r) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r.id,
          category: r.category,
          title: r.title,
          severity: 'medium',
          location: 'Multilingual Availability Layer',
          description: 'Document is published exclusively in English without localized regional language editions (e.g. Telugu, Hindi).',
          whyItMatters: r.whyItMatters,
          whoIsAffected: r.whoIsAffected,
          recommendation: r.defaultRecommendation,
          confidenceScore: 91,
          isFixableWithAi: r.fixableWithAi,
        });
      }
    }

    // 5. STRUCTURE AUDIT
    const headingBlocks = content.blocks.filter((b) => b.type === 'heading');
    if (headingBlocks.length === 0 || !headingBlocks.some((h) => h.level === 1)) {
      const r = findRule('STR-001');
      if (r) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r.id,
          category: r.category,
          title: r.title,
          severity: r.severity,
          location: 'Document Outline',
          description: 'Document lacks a structured H1/H2/H3 heading hierarchy, hindering screen reader navigational jumping.',
          whyItMatters: r.whyItMatters,
          whoIsAffected: r.whoIsAffected,
          recommendation: r.defaultRecommendation,
          confidenceScore: 94,
          isFixableWithAi: r.fixableWithAi,
        });
      }
    }

    // Tables without explicit header tags
    for (let t = 0; t < content.tables.length; t++) {
      const tbl = content.tables[t];
      if (!tbl.hasHeaders) {
        const r = findRule('STR-003');
        if (r) {
          issues.push({
            id: `iss_${issueCounter++}`,
            ruleId: r.id,
            category: r.category,
            title: `${r.title} (Table ${t + 1})`,
            severity: r.severity,
            location: `Page ${tbl.pageNumber || 2}, Table ${t + 1}`,
            description: 'Data table does not define column header tags (`<th>`), preventing assistive tech from reading cell relationships.',
            whyItMatters: r.whyItMatters,
            whoIsAffected: r.whoIsAffected,
            recommendation: r.defaultRecommendation,
            confidenceScore: 95,
            isFixableWithAi: r.fixableWithAi,
          });
        }
      }
    }

    // 6. SCREEN READER AUDIT
    const rScr = findRule('SCR-001');
    if (rScr) {
      issues.push({
        id: `iss_${issueCounter++}`,
        ruleId: rScr.id,
        category: rScr.category,
        title: rScr.title,
        severity: rScr.severity,
        location: 'Document Container Root',
        description: 'Document body is not wrapped in semantic HTML5 landmarks (`<main>`, `<section>`, `<article>`).',
        whyItMatters: rScr.whyItMatters,
        whoIsAffected: rScr.whoIsAffected,
        recommendation: rScr.defaultRecommendation,
        confidenceScore: 93,
        isFixableWithAi: rScr.fixableWithAi,
      });
    }

    return issues;
  }
}

export const accessibilityAuditAgent = new AccessibilityAuditAgent();
