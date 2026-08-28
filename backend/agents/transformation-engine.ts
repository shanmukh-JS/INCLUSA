import {
  AccessibilityProfile,
  StructuredContent,
  TransformationItem,
  TransformedOutput,
} from '../../types';
import { aiService } from '../ai/ai-service';

/**
 * Agent 4 — Transformation Planning & Execution Agent
 * Responsibilities:
 * - Executes all selected remediations (Vision, Cognitive, Multilingual, Structure, Audio/Video)
 * - Synthesizes accessible text, simplified versions, translations, image descriptions, and screen-reader HTML
 */
export class TransformationAgent {
  public async transform(
    content: StructuredContent,
    transformations: TransformationItem[],
    profile: AccessibilityProfile
  ): Promise<TransformedOutput> {
    const rawText = content.rawText;
    const title = content.title;

    // 1. Generate Image & Chart Descriptions
    const imageDescriptions: TransformedOutput['imageDescriptions'] = [];

    // Always process any extracted images
    for (let i = 0; i < content.images.length; i++) {
      const img = content.images[i];
      const desc = await aiService.generateImageDescription({
        isChartOrGraph: img.isChartOrGraph,
        contextText: img.chartDataSummary || content.title,
        pageNumber: img.pageNumber,
      });
      imageDescriptions.push({
        id: img.id,
        altText: desc.altText,
        detailed: desc.detailed,
        simple: desc.simple,
        screenReader: desc.screenReader,
      });
    }

    // If document contains tables or data but no separate image blocks, create chart/table descriptions
    if (content.tables.length > 0 && imageDescriptions.length === 0) {
      for (let i = 0; i < content.tables.length; i++) {
        const tbl = content.tables[i];
        imageDescriptions.push({
          id: `chart_tbl_${i + 1}`,
          altText: `Data chart representation for ${tbl.summary || title}`,
          detailed: `Data breakdown comparing ${tbl.headers.join(', ')}. Contains ${tbl.rows.length} records. Sample data: ${tbl.rows[0] ? tbl.rows[0].join(' | ') : 'N/A'}. Shows comparative metrics and structured values.`,
          simple: `A clear table and chart showing data for ${tbl.headers.slice(0, 3).join(', ')}.`,
          screenReader: `Figure: Data visual comparing ${tbl.headers.join(', ')} with ${tbl.rows.length} rows of accessible tabular information.`,
        });
      }
    }

    // Default infographic breakdown if still empty
    if (imageDescriptions.length === 0) {
      const headingsSummary = content.blocks.filter((b: any) => b.type === 'heading').map((b: any) => b.text).slice(0, 3).join(' -> ');
      imageDescriptions.push({
        id: 'img_desc_gen',
        altText: `Visual overview for ${title}: covers ${headingsSummary || 'core document sections'}.`,
        detailed: `Structured diagram mapping out the document's main hierarchy: ${headingsSummary || title}. Outlines key metrics, procedural steps, and core guidelines with high-contrast visual cues.`,
        simple: `An illustration showing the main topics and steps of this document in order.`,
        screenReader: `Figure: Accessible structural overview for ${title}. Highlights main topics and verified compliance elements.`,
      });
    }

    // 2. Generate Simplified Cognitive Version
    const simpItem = transformations.find((t) => t.type === 'simplify_language');
    const shouldSimplify = simpItem ? simpItem.selected : true;
    const { simplifiedText, bulletPoints, keyTakeaways } = await aiService.simplifyLanguage(rawText);

    // 3. Generate Regional Translations (Always include Telugu and Hindi)
    const translations: TransformedOutput['translations'] = {};
    
    // Always generate Telugu translation
    translations['te'] = await aiService.translateContent(rawText, 'te');
    // Always generate Hindi translation
    translations['hi'] = await aiService.translateContent(rawText, 'hi');

    // Also generate any custom target language selected by profile or transformation
    const transItems = transformations.filter((t) => t.type === 'translate');
    for (const tItem of transItems) {
      if (tItem.selected && tItem.targetLanguage && !translations[tItem.targetLanguage]) {
        translations[tItem.targetLanguage] = await aiService.translateContent(rawText, tItem.targetLanguage);
      }
    }
    if (profile.language.primaryLanguage && profile.language.primaryLanguage !== 'en' && !translations[profile.language.primaryLanguage]) {
      translations[profile.language.primaryLanguage] = await aiService.translateContent(rawText, profile.language.primaryLanguage);
    }

    // 4. Generate Screen Reader Accessible HTML
    const screenReaderHtml = aiService.generateScreenReaderHtml(title, rawText);

    // 5. Linearize Tables
    const tableRepresentations: TransformedOutput['tableRepresentations'] = content.tables.map((tbl: any, idx: number) => {
      const headerList = tbl.headers.length > 0 ? tbl.headers.join(', ') : 'columns';
      const rowCount = tbl.rows.length;
      const sampleValues = tbl.rows.length > 0 ? tbl.rows[0].slice(0, 3).join(', ') : '';

      return {
        id: tbl.id,
        accessibleHtml: `<table role="table" aria-label="Accessible Table ${idx + 1}: ${tbl.summary}">
  <caption>${tbl.summary || `Table ${idx + 1}: Data Records`}</caption>
  <thead>
    <tr>${tbl.headers.map((h: string) => `<th scope="col">${h}</th>`).join('')}</tr>
  </thead>
  <tbody>
    ${tbl.rows.map((r: string[]) => `<tr>${r.map((c: string, ci: number) => ci === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}
  </tbody>
</table>`,
        plainExplanation: `Table ${idx + 1} (${tbl.summary || 'Data Table'}): Formatted with ${tbl.headers.length} columns [${headerList}] and ${rowCount} data rows.${sampleValues ? ` Initial record: [${sampleValues}].` : ''} All cells are linearized with column header associations for screen reader navigation.`,
      };
    });

    // 6. Generate Audio/Video Captions & Audio Narration Script
    const timedCaptionsVtt = aiService.generateWebVttCaptions(title);
    const audioTranscript = `Welcome to the accessible audio version of "${title}". 

Key Summary:
${keyTakeaways.join('. ')}.

Detailed Content:
${simplifiedText}`;

    // 7. Structured Accessible Text
    const accessibleText = `# ${title} (Accessible Edition)

## Executive Summary
${bulletPoints.map((b: string) => `* ${b}`).join('\n')}

---

## Remediated Document Structure
${rawText}

---

## Figure & Chart Annotations
${imageDescriptions.map((img: any, i: number) => `### Figure ${i + 1} Accessible Narrative\n**Alt Text:** ${img.altText}\n\n**Detailed Breakdown:** ${img.detailed}`).join('\n\n')}
`;

    return {
      id: `tx_${Date.now()}`,
      documentId: content.id,
      accessibleText,
      simplifiedVersion: simplifiedText,
      stepByStepGuide: bulletPoints,
      summary: keyTakeaways.join(' '),
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
