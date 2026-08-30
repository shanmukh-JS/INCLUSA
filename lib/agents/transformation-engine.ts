/**
 * Agent 4 — Transformation Engine
 * Responsibilities:
 * - Executes all prioritized accessibility remediations (Vision, Cognitive, Multilingual, Structure, Speech)
 * - Synthesizes 3-layer image descriptions (Concise Alt Text, Detailed Breakdown, Plain Visual Meaning)
 * - Generates plain language summaries, key facts, and explicit action steps
 * - Generates regional language translations (Telugu & Hindi) of the actual content meaning
 * - Generates WCAG 2.1 AAA semantic HTML5 with ARIA landmarks
 * - Strictly grounded: NEVER transforms raw filenames, NEVER invents fake procedures
 */

import type {
  AccessibilityProfile,
  StructuredContent,
  TransformationItem,
  TransformedOutput,
} from '@/types';
import { aiService } from '../ai/ai-service';

export class TransformationAgent {
  public async transform(
    content: StructuredContent,
    transformations: TransformationItem[],
    profile: AccessibilityProfile
  ): Promise<TransformedOutput> {
    const rawText = content.rawText;
    const title = content.title;
    const imageAnalysis = content.imageAnalysis;

    // 1. Generate 3-Layer Image & Chart Descriptions
    const imageDescriptions: TransformedOutput['imageDescriptions'] = [];

    if (content.images.length > 0) {
      for (let i = 0; i < content.images.length; i++) {
        const img = content.images[i];
        const visualContext = img.chartDataSummary
          ? `${img.chartDataSummary}. ${rawText.slice(0, 1000)}`
          : rawText.slice(0, 1000);

        const desc = await aiService.generateImageDescription({
          isChartOrGraph: img.isChartOrGraph,
          contextText: visualContext,
          pageNumber: img.pageNumber,
          structuredAnalysis: imageAnalysis,
        });

        imageDescriptions.push({
          id: img.id,
          altText: desc.altText,
          detailed: desc.detailed,
          simple: desc.simple,
          screenReader: desc.screenReader,
        });
      }
    } else if (content.inputType === 'image') {
      const desc = await aiService.generateImageDescription({
        isChartOrGraph: false,
        contextText: rawText,
        structuredAnalysis: imageAnalysis,
      });

      imageDescriptions.push({
        id: 'img_primary',
        altText: desc.altText,
        detailed: desc.detailed,
        simple: desc.simple,
        screenReader: desc.screenReader,
      });
    }

    if (content.tables.length > 0 && imageDescriptions.length === 0) {
      for (let i = 0; i < content.tables.length; i++) {
        const tbl = content.tables[i];
        imageDescriptions.push({
          id: `chart_tbl_${i + 1}`,
          altText: `Data table representation for ${tbl.summary || title}`,
          detailed: `Data breakdown comparing ${tbl.headers.join(', ')}. Contains ${tbl.rows.length} records. Key entries: ${tbl.rows.map((r) => r.join(' — ')).slice(0, 3).join('; ')}.`,
          simple: `A clear table showing data for ${tbl.headers.slice(0, 3).join(', ')}.`,
          screenReader: `Figure: Data table comparing ${tbl.headers.join(', ')} with ${tbl.rows.length} rows of accessible tabular information.`,
        });
      }
    }

    // 2. Generate Simplified Cognitive Plain Language Version
    const { simplifiedText, whatThisIs, whatToKnow, whatToDo } = await aiService.simplifyLanguage(rawText);

    // 3. Generate Regional Translations (Telugu & Hindi)
    const translations: TransformedOutput['translations'] = {};
    translations['te'] = await aiService.translateContent(rawText, 'te');
    translations['hi'] = await aiService.translateContent(rawText, 'hi');

    const transItems = transformations.filter((t) => t.type === 'translate');
    for (const tItem of transItems) {
      if (tItem.selected && tItem.targetLanguage && !translations[tItem.targetLanguage]) {
        translations[tItem.targetLanguage] = await aiService.translateContent(rawText, tItem.targetLanguage);
      }
    }
    if (profile.language?.primaryLanguage && profile.language.primaryLanguage !== 'en' && !translations[profile.language.primaryLanguage]) {
      translations[profile.language.primaryLanguage] = await aiService.translateContent(rawText, profile.language.primaryLanguage);
    }

    // 4. Generate Screen Reader Accessible HTML
    const screenReaderHtml = aiService.generateScreenReaderHtml(title, rawText);

    // 5. Linearize Tables with Genuine Semantic Meaning
    const tableRepresentations: TransformedOutput['tableRepresentations'] = content.tables.map((tbl, idx) => {
      const headerList = tbl.headers.length > 0 ? tbl.headers.join(', ') : 'columns';
      const rowCount = tbl.rows.length;
      const sampleValues = tbl.rows.length > 0 ? tbl.rows.map((r) => r.join(' | ')).slice(0, 2).join('; ') : '';

      return {
        id: tbl.id,
        accessibleHtml: `<table role="table" aria-label="Accessible Table ${idx + 1}: ${tbl.summary}">
  <caption>${tbl.summary || `Table ${idx + 1}: Data Records`}</caption>
  <thead>
    <tr>${tbl.headers.map((h) => `<th scope="col">${h}</th>`).join('')}</tr>
  </thead>
  <tbody>
    ${tbl.rows.map((r) => `<tr>${r.map((c, ci) => ci === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}
  </tbody>
</table>`,
        plainExplanation: `Table ${idx + 1} (${tbl.summary || 'Data Table'}): Displays ${tbl.headers.length} columns [${headerList}] with ${rowCount} data rows.${sampleValues ? ` Key entries: [${sampleValues}].` : ''} All rows are linearized with explicit column headers for screen-reader navigation.`,
      };
    });

    // 6. Generate Audio/Video Captions & Audio Narration Script
    const timedCaptionsVtt = aiService.generateWebVttCaptions(title);

    const hasAction = whatToDo.length > 0 && !whatToDo[0].toLowerCase().includes('no explicit action') && !whatToDo[0].toLowerCase().includes('no action');
    const audioTranscript = `Accessible Audio Narration for: ${title}.
    
Overview: ${whatThisIs}.

Key points you need to know:
${whatToKnow.map((k, idx) => `Point ${idx + 1}: ${k}`).join('. ')}.

${hasAction ? `Action steps to take:\n${whatToDo.map((d, idx) => `Step ${idx + 1}: ${d}`).join('. ')}.` : 'No explicit action steps are required for this content.'}

This narration is generated by INCLUSA to ensure universal accessibility.`;

    const summaryMeaning = imageAnalysis?.visualMeaning || whatThisIs;

    return {
      id: `trans_${Date.now()}`,
      documentId: content.id,
      accessibleText: rawText,
      simplifiedVersion: simplifiedText,
      stepByStepGuide: whatToDo,
      summary: summaryMeaning,
      whatThisIs: summaryMeaning,
      whatToKnow,
      keyFacts: imageAnalysis?.keyFacts || whatToKnow,
      visualMeaning: imageAnalysis?.visualMeaning || summaryMeaning,
      translations,
      imageDescriptions,
      screenReaderHtml,
      tableRepresentations,
      audioTranscript,
      timedCaptionsVtt,
      remediatedAt: new Date().toISOString(),
    };
  }
}

export const transformationAgent = new TransformationAgent();
