/**
 * Agent 1 — Multimodal Content Understanding Agent
 * Responsibilities:
 * - Ingests multimodal documents, images, audio, video, PDFs, and URLs
 * - Directs raw image bytes / base64 data to Google Gemini Vision for multimodal visual comprehension
 * - Extracts structured visual semantics: visible text, objects, colors, layout, relationships, visual meaning, key facts, explicit actions
 * - Produces structured JSON output conforming to the INCLUSA multimodal schema
 * - NEVER uses the filename as semantic content
 * - NEVER invents eligibility rules, application steps, or deadlines
 */

import type {
  ContentBlock,
  DocumentInputType,
  ExtractedImage,
  ExtractedMedia,
  ExtractedTable,
  StructuredContent,
  StructuredImageAnalysis,
} from '@/types';
import { aiService } from '../ai/ai-service';

export interface ContentUnderstandingInput {
  id?: string;
  inputType: DocumentInputType;
  title?: string;
  fileName?: string;
  rawText?: string;
  fileDataUrl?: string;
  url?: string;
  fileSizeBytes?: number;
}

export class ContentUnderstandingAgent {
  public async analyze(input: ContentUnderstandingInput): Promise<StructuredContent> {
    const documentId = input.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const inputType = input.inputType;
    const fileName = input.fileName || 'Uploaded Document';
    const fallbackTitle = input.title || (inputType === 'image' ? 'Visual Image Content' : 'Accessible Document');

    let rawText = input.rawText || '';
    let extractedData: any = null;

    if (input.fileDataUrl || !rawText || rawText.includes('Multimodal IMAGE file processed with INCLUSA') || inputType === 'image') {
      try {
        extractedData = await aiService.extractMultimodalContent({
          fileDataUrl: input.fileDataUrl,
          fileName,
          inputType,
          title: fallbackTitle,
          url: input.url,
          rawText: input.rawText,
        });

        if (extractedData?.text) {
          rawText = extractedData.text;
        }
      } catch (err) {
        console.warn('[Agent 1 - Content Understanding] Multimodal extraction warning:', err);
      }
    }

    if (!rawText || rawText.trim().length === 0) {
      rawText = this.getDefaultContentForType(inputType, fallbackTitle);
    }

    const title = extractedData?.title || fallbackTitle;
    const imageAnalysis: StructuredImageAnalysis | undefined = extractedData?.imageAnalysis;

    const metrics = aiService.calculateReadabilityMetrics(rawText);

    const blocks: ContentBlock[] = [];
    const images: ExtractedImage[] = [];
    const tables: ExtractedTable[] = [];
    let media: ExtractedMedia | undefined = undefined;

    if (extractedData?.tables && extractedData.tables.length > 0) {
      extractedData.tables.forEach((tbl: any, idx: number) => {
        tables.push({
          id: `tbl_${idx + 1}`,
          pageNumber: 1,
          headers: tbl.headers,
          rows: tbl.rows,
          summary: tbl.summary || `Data table with ${tbl.headers.length} columns`,
          hasHeaders: true,
          isComplex: tbl.headers.length > 4,
        });
      });
    }

    if (extractedData?.imageDescriptions && extractedData.imageDescriptions.length > 0) {
      extractedData.imageDescriptions.forEach((img: any, idx: number) => {
        images.push({
          id: `img_${idx + 1}`,
          pageNumber: 1,
          isChartOrGraph: Boolean(img.isChart || imageAnalysis?.contentType === 'chart'),
          hasExistingAlt: false,
          altText: img.altText || imageAnalysis?.altText,
          detailedDescription: img.detailed || imageAnalysis?.detailedDescription,
          simpleDescription: imageAnalysis?.visualMeaning,
          chartDataSummary: img.detailed || img.altText || imageAnalysis?.layout,
        });
      });
    }

    if (inputType === 'image' && images.length === 0) {
      const conciseAlt = imageAnalysis?.altText || (imageAnalysis?.visualMeaning ? (imageAnalysis.visualMeaning.length > 120 ? `${imageAnalysis.visualMeaning.slice(0, 117)}...` : imageAnalysis.visualMeaning) : 'Visual image content requiring accessible description.');
      const detailedDesc = imageAnalysis?.detailedDescription || imageAnalysis?.visualMeaning || 'Visual image presented with high-contrast elements and accessible description.';

      images.push({
        id: 'img_uploaded_main',
        pageNumber: 1,
        isChartOrGraph: Boolean(imageAnalysis?.contentType === 'chart'),
        hasExistingAlt: false,
        altText: conciseAlt,
        detailedDescription: detailedDesc,
        simpleDescription: imageAnalysis?.visualMeaning || conciseAlt,
        chartDataSummary: imageAnalysis?.layout || detailedDesc,
      });
    }

    const lines = rawText.split('\n');
    let currentOrder = 1;
    let inTable = false;
    let currentTableHeaders: string[] = [];
    let currentTableRows: string[][] = [];

    const flushCurrentTable = () => {
      if (currentTableHeaders.length > 0) {
        const tableId = `tbl_${tables.length + 1}`;
        tables.push({
          id: tableId,
          pageNumber: 1,
          headers: currentTableHeaders,
          rows: currentTableRows,
          summary: `Data table with ${currentTableHeaders.length} columns: ${currentTableHeaders.join(', ')}`,
          hasHeaders: true,
          isComplex: currentTableHeaders.length > 4,
        });
        blocks.push({
          id: `blk_${currentOrder}`,
          type: 'table',
          tableId,
          pageNumber: 1,
          readingOrder: currentOrder++,
        });
      }
      currentTableHeaders = [];
      currentTableRows = [];
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        if (inTable) flushCurrentTable();
        continue;
      }

      if (line.includes('|') && line.split('|').length >= 3) {
        if (line.includes('---')) {
          continue;
        }
        const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length > 0) {
          if (!inTable) {
            inTable = true;
            currentTableHeaders = cells;
          } else {
            currentTableRows.push(cells);
          }
        }
      } else {
        if (inTable) flushCurrentTable();

        if (line.startsWith('### ')) {
          blocks.push({
            id: `blk_${currentOrder}`,
            type: 'heading',
            level: 3,
            text: line.replace(/^###\s*/, ''),
            pageNumber: 1,
            readingOrder: currentOrder++,
          });
        } else if (line.startsWith('## ')) {
          blocks.push({
            id: `blk_${currentOrder}`,
            type: 'heading',
            level: 2,
            text: line.replace(/^##\s*/, ''),
            pageNumber: 1,
            readingOrder: currentOrder++,
          });
        } else if (line.startsWith('# ')) {
          blocks.push({
            id: `blk_${currentOrder}`,
            type: 'heading',
            level: 1,
            text: line.replace(/^#\s*/, ''),
            pageNumber: 1,
            readingOrder: currentOrder++,
          });
        } else if (line.startsWith('* ') || line.startsWith('- ') || /^\d+\.\s/.test(line)) {
          blocks.push({
            id: `blk_${currentOrder}`,
            type: 'list',
            text: line.replace(/^[*•\-\d.]+\s*/, ''),
            pageNumber: 1,
            readingOrder: currentOrder++,
          });
        } else {
          blocks.push({
            id: `blk_${currentOrder}`,
            type: 'paragraph',
            text: line,
            pageNumber: 1,
            readingOrder: currentOrder++,
          });
        }
      }
    }

    if (inTable) flushCurrentTable();

    if (inputType === 'audio' || inputType === 'video') {
      media = {
        type: inputType,
        durationSeconds: 120,
        hasCaptions: false,
        hasAudioDescription: false,
        hasTranscript: false,
        transcript: rawText,
      };
    }

    const pageCount = Math.max(1, Math.ceil(blocks.length / 8));
    const detectedLanguage = this.detectLanguage(rawText);

    return {
      id: documentId,
      inputType,
      title,
      originalFileName: input.fileName,
      fileSizeBytes: input.fileSizeBytes || (input.fileDataUrl ? Math.round(input.fileDataUrl.length * 0.75) : 1024 * 45),
      rawText,
      blocks,
      images,
      tables,
      media,
      pageCount,
      detectedLanguage,
      hasScannedPages: inputType === 'pdf' && rawText.includes('scanned'),
      imageAnalysis,
      fileDataUrl: input.fileDataUrl,
      metadata: {
        author: 'Content Author',
        creationDate: new Date().toISOString(),
        readingComplexityFleschKincaid: metrics.gradeLevel,
        wordCount: metrics.wordCount,
        charCount: rawText.length,
      },
    };
  }

  private detectLanguage(text: string): string {
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    return 'en';
  }

  private getDefaultContentForType(type: DocumentInputType, title: string): string {
    if (type === 'image') {
      return `# ${title}
## What This Content Is About
Visual image content provided for accessibility remediation.

## Visual Elements
* Visual graphic presentation elements.

## What You Need to Know
* All visual information is structured with accessible high-contrast markup and screen-reader alt text.

## Action Steps
There are no explicit action steps in this content.`;
    }
    if (type === 'audio' || type === 'video') {
      return `Audio/Video recording for ${title}. Content contains spoken dialogue requiring automated transcription and captioning.`;
    }
    if (type === 'url') {
      return `# Web Resource: ${title}\nWeb page structure requiring accessibility inspection and semantic remediation.`;
    }
    return `# ${title}\nContent provided for accessibility inspection and transformation.`;
  }
}

export const contentUnderstandingAgent = new ContentUnderstandingAgent();
