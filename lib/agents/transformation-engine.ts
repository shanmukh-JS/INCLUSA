import {
  AccessibilityProfile,
  StructuredContent,
  TransformationItem,
  TransformedOutput,
} from '@/types';
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

    // 1. Generate Image Descriptions if requested or selected by user
    const imgItem = transformations.find((t) => t.type === 'image_descriptions');
    const shouldGenImages = imgItem ? imgItem.selected : (transformations.length === 0 || profile.vision.screenReaderUser || profile.vision.blind);
    const imageDescriptions: TransformedOutput['imageDescriptions'] = [];

    if (shouldGenImages) {
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

      if (imageDescriptions.length === 0 && content.images.length > 0) {
        imageDescriptions.push({
          id: 'img_desc_gen',
          altText: `Visual illustration in ${title} describing key structural concepts.`,
          detailed: `A structured conceptual illustration depicting accessible workflow components and diagrams.`,
          simple: `A clear image describing the document's main visual topics.`,
          screenReader: `Figure: Accessible description generated for visual graphic in ${title}.`,
        });
      }
    }

    // 2. Generate Simplified Cognitive Version
    const simpItem = transformations.find((t) => t.type === 'simplify_language');
    const shouldSimplify = simpItem ? simpItem.selected : (transformations.length === 0 || profile.cognitive.simplifiedLanguage);
    const { simplifiedText, bulletPoints, keyTakeaways } = shouldSimplify
      ? await aiService.simplifyLanguage(rawText)
      : { simplifiedText: rawText, bulletPoints: ['Original text preserved without simplification.'], keyTakeaways: ['Direct original content structure.'] };

    // 3. Generate Translations
    const translations: TransformedOutput['translations'] = {};
    const transItems = transformations.filter((t) => t.type === 'translate');
    
    if (transItems.length > 0) {
      for (const tItem of transItems) {
        if (tItem.selected && tItem.targetLanguage) {
          translations[tItem.targetLanguage] = await aiService.translateContent(rawText, tItem.targetLanguage);
        }
      }
    } else if (profile.language.primaryLanguage && profile.language.primaryLanguage !== 'en') {
      translations[profile.language.primaryLanguage] = await aiService.translateContent(rawText, profile.language.primaryLanguage);
    }

    // 4. Generate Screen Reader Accessible HTML
    const srItem = transformations.find((t) => t.type === 'screen_reader_structure');
    const shouldSr = srItem ? srItem.selected : (transformations.length === 0 || profile.vision.screenReaderUser || profile.vision.blind);
    const screenReaderHtml = shouldSr ? aiService.generateScreenReaderHtml(title, rawText) : '';

    // 5. Linearize Tables
    const tableRepresentations: TransformedOutput['tableRepresentations'] = content.tables.map((tbl, idx) => {
      const headerList = tbl.headers.length > 0 ? tbl.headers.join(', ') : 'columns';
      const rowCount = tbl.rows.length;
      const sampleValues = tbl.rows.length > 0 ? tbl.rows[0].slice(0, 3).join(', ') : '';

      return {
        id: tbl.id,
        accessibleHtml: `<table role="table" aria-label="Accessible Table ${idx + 1}: ${tbl.summary}">
  <thead>
    <tr>${tbl.headers.map((h) => `<th scope="col">${h}</th>`).join('')}</tr>
  </thead>
  <tbody>
    ${tbl.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}
  </tbody>
</table>`,
        plainExplanation: `Table ${idx + 1} (${tbl.summary || 'Data Table'}): Formatted with ${tbl.headers.length} columns [${headerList}] and ${rowCount} data rows.${sampleValues ? ` Initial record: [${sampleValues}].` : ''} All cells are linearized with column header associations for screen reader navigation.`,
      };
    });

    // 6. Generate Audio/Video Captions & Transcripts
    const timedCaptionsVtt = aiService.generateWebVttCaptions(title);
    const audioTranscript = content.media?.transcript || rawText;

    // 7. Structured Accessible Text
    const accessibleText = `# ${title} (Accessible Edition)

## Executive Summary
${bulletPoints.map((b) => `* ${b}`).join('\n')}

---

## Remediated Document Structure
${rawText}

---

## Figure & Chart Annotations
${imageDescriptions.map((img, i) => `### Figure ${i + 1} Accessible Narrative\n**Alt Text:** ${img.altText}\n\n**Detailed Breakdown:** ${img.detailed}`).join('\n\n')}
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
