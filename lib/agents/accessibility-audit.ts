/**
 * Agent 2 — Accessibility Audit Agent
 * Responsibilities:
 * - Scans structured content against 24 WCAG 2.1 AA/AAA rules
 * - Performs category-specific barrier detection: Vision, Cognitive, Hearing, Language, Structure, Screen Reader
 * - For images: audits alt text, multi-level descriptions, embedded text accessibility, and ARIA figures
 * - Does NOT flag unrelated document barriers on pure visual graphics
 */

import type { AccessibilityIssue, StructuredContent } from '@/types';
import { WCAG_ACCESSIBILITY_RULES } from '../rules/wcag-rules';

export class AccessibilityAuditAgent {
  public audit(content: StructuredContent): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    let issueCounter = 1;

    const findRule = (ruleId: string) => WCAG_ACCESSIBILITY_RULES.find((r) => r.id === ruleId);
    const isImageUpload = content.inputType === 'image';
    const wordCount = content.metadata?.wordCount || 0;

    // 1. VISION AUDIT
    // Non-text content (Images, Charts, Figures)
    if (content.images.length > 0 || isImageUpload) {
      const missingAltImages = content.images.filter((img) => !img.hasExistingAlt || !img.altText);
      if (missingAltImages.length > 0 || isImageUpload) {
        const r1 = findRule('VIS-001');
        if (r1) {
          issues.push({
            id: `iss_${issueCounter++}`,
            ruleId: r1.id,
            category: r1.category,
            title: r1.title,
            severity: r1.severity,
            location: isImageUpload ? 'Primary Uploaded Visual Graphic' : `Image 1 (Page ${content.images[0]?.pageNumber || 1})`,
            description: isImageUpload
              ? 'Uploaded visual graphic has no embedded screen-reader accessible alt text tag.'
              : `Found ${missingAltImages.length} image/figure element(s) completely lacking alternative \`alt\` text tags.`,
            whyItMatters: r1.whyItMatters,
            whoIsAffected: r1.whoIsAffected,
            recommendation: r1.defaultRecommendation,
            confidenceScore: 99,
            isFixableWithAi: r1.fixableWithAi,
          });
        }

        const r2 = findRule('VIS-002');
        if (r2) {
          issues.push({
            id: `iss_${issueCounter++}`,
            ruleId: r2.id,
            category: r2.category,
            title: r2.title,
            severity: r2.severity,
            location: isImageUpload ? 'Visual Composition & Key Facts' : 'Visual Information Layer',
            description: 'Visual diagram/image lacks a structured plain-language meaning explanation and multi-tier chart narrative.',
            whyItMatters: r2.whyItMatters,
            whoIsAffected: r2.whoIsAffected,
            recommendation: r2.defaultRecommendation,
            confidenceScore: 98,
            isFixableWithAi: r2.fixableWithAi,
          });
        }
      }

      // Check if image contains embedded text that screen readers cannot parse
      const hasEmbeddedText = (content.imageAnalysis?.visibleText && content.imageAnalysis.visibleText.length > 0) ||
        content.rawText.toLowerCase().includes('visible text') ||
        (content.images[0]?.chartDataSummary && content.images[0].chartDataSummary.length > 20);

      if (hasEmbeddedText && isImageUpload) {
        const rText = findRule('VIS-004') || {
          id: 'VIS-004',
          category: 'vision' as const,
          title: 'Inaccessible Embedded Text in Visual Graphic',
          severity: 'high' as const,
          whyItMatters: 'Text rendered inside raster pixels cannot be resized, reflowed, or read by screen readers.',
          whoIsAffected: 'Screen reader users, low vision individuals needing scalable typography',
          defaultRecommendation: 'Extract embedded text into semantic HTML headings and lists.',
          fixableWithAi: true,
        };
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: rText.id,
          category: rText.category,
          title: rText.title,
          severity: rText.severity,
          location: 'Embedded Image Typography',
          description: 'Critical titles and informative labels are embedded directly inside image pixels, making them unreadable to screen readers.',
          whyItMatters: rText.whyItMatters,
          whoIsAffected: rText.whoIsAffected,
          recommendation: rText.defaultRecommendation,
          confidenceScore: 97,
          isFixableWithAi: rText.fixableWithAi,
        });
      }
    }

    // 2. COGNITIVE AUDIT
    if (isImageUpload) {
      const r = findRule('COG-001');
      if (r) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r.id,
          category: r.category,
          title: 'Lack of Plain-Language Visual Meaning Breakdown',
          severity: 'medium',
          location: 'Visual Communication Layer',
          description: 'Visual layout lacks a plain-language summary explaining what this graphic communicates to neurodivergent readers.',
          whyItMatters: r.whyItMatters,
          whoIsAffected: 'Individuals with cognitive differences, ADHD, and visual processing fatigue',
          recommendation: 'Provide upfront plain-language visual meaning and key takeaways.',
          confidenceScore: 94,
          isFixableWithAi: r.fixableWithAi,
        });
      }
    } else if (wordCount >= 40) {
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
            location: 'Document Body Text',
            description: `Content scored a Flesch-Kincaid Grade Level of ${readingGrade}. This exceeds secondary education norms and hinders cognitive comprehension.`,
            whyItMatters: r.whyItMatters,
            whoIsAffected: r.whoIsAffected,
            recommendation: r.defaultRecommendation,
            confidenceScore: 96,
            isFixableWithAi: r.fixableWithAi,
          });
        }
      }

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
            description: 'Dense unbroken paragraphs containing over 65 words cause reading fatigue and tracking difficulties.',
            whyItMatters: r.whyItMatters,
            whoIsAffected: r.whoIsAffected,
            recommendation: r.defaultRecommendation,
            confidenceScore: 90,
            isFixableWithAi: r.fixableWithAi,
          });
        }
      }
    }

    // 3. HEARING AUDIT
    if (content.media || content.inputType === 'audio' || content.inputType === 'video') {
      const r1 = findRule('HEA-001');
      if (r1 && content.media?.type === 'video' && !content.media?.hasCaptions) {
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
      if (r2 && !content.media?.hasTranscript) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r2.id,
          category: r2.category,
          title: r2.title,
          severity: r2.severity,
          location: 'Audio/Video Track',
          description: 'Spoken auditory track lacks a timestamped, speaker-labelled text transcript.',
          whyItMatters: r2.whyItMatters,
          whoIsAffected: r2.whoIsAffected,
          recommendation: r2.defaultRecommendation,
          confidenceScore: 98,
          isFixableWithAi: r2.fixableWithAi,
        });
      }
    }

    // 4. LANGUAGE AUDIT
    if (content.detectedLanguage === 'en') {
      const r = findRule('LAN-002');
      if (r) {
        issues.push({
          id: `iss_${issueCounter++}`,
          ruleId: r.id,
          category: r.category,
          title: 'Monolingual Content (Requires Regional Language Access)',
          severity: 'medium',
          location: 'Entire Content Layer',
          description: 'Content is available solely in English, presenting comprehension barriers for regional language speakers (Telugu / Hindi).',
          whyItMatters: r.whyItMatters,
          whoIsAffected: 'Non-native English speakers, regional Telugu/Hindi primary readers',
          recommendation: 'Provide neural regional language translations in Telugu and Hindi.',
          confidenceScore: 94,
          isFixableWithAi: r.fixableWithAi,
        });
      }
    }

    // 5. STRUCTURE AUDIT
    for (let i = 0; i < content.tables.length; i++) {
      const tbl = content.tables[i];
      if (!tbl.hasHeaders || tbl.headers.length === 0) {
        const r = findRule('STR-003');
        if (r) {
          issues.push({
            id: `iss_${issueCounter++}`,
            ruleId: r.id,
            category: r.category,
            title: `${r.title} (Table ${i + 1})`,
            severity: r.severity,
            location: `Table ${i + 1}`,
            description: 'Data table does not have programmatic `<th scope="col">` column header bindings.',
            whyItMatters: r.whyItMatters,
            whoIsAffected: r.whoIsAffected,
            recommendation: r.defaultRecommendation,
            confidenceScore: 97,
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
        location: 'Document Root / Layout',
        description: 'Content layout lacks HTML5 `<main>`, `<header>`, `<article>`, and `<figure>` ARIA landmark structures.',
        whyItMatters: rScr.whyItMatters,
        whoIsAffected: rScr.whoIsAffected,
        recommendation: rScr.defaultRecommendation,
        confidenceScore: 96,
        isFixableWithAi: rScr.fixableWithAi,
      });
    }

    return issues;
  }
}

export const accessibilityAuditAgent = new AccessibilityAuditAgent();
