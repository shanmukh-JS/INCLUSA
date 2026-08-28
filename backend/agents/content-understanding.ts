import {
  ContentBlock,
  DocumentInputType,
  ExtractedImage,
  ExtractedMedia,
  ExtractedTable,
  StructuredContent,
} from '../types';
import { aiService } from '../ai/ai-service';

export interface IngestionInput {
  id?: string;
  inputType: DocumentInputType;
  title?: string;
  fileName?: string;
  fileSizeBytes?: number;
  rawText?: string;
  fileDataUrl?: string;
  url?: string;
}

/**
 * Agent 1 — Content Understanding Agent
 */
export class ContentUnderstandingAgent {
  public async analyze(input: IngestionInput): Promise<StructuredContent> {
    const documentId = input.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const title = input.title || input.fileName || 'Digital Document';
    const inputType = input.inputType;
    const rawText = input.rawText || this.getDefaultContentForType(inputType, title);

    const metrics = aiService.calculateReadabilityMetrics(rawText);

    const blocks: ContentBlock[] = [];
    const images: ExtractedImage[] = [];
    const tables: ExtractedTable[] = [];
    let media: ExtractedMedia | undefined = undefined;

    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    let currentOrder = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('# ')) {
        blocks.push({
          id: `blk_${currentOrder}`,
          type: 'heading',
          level: 1,
          text: line.replace('# ', ''),
          pageNumber: Math.floor(i / 10) + 1,
          readingOrder: currentOrder++,
        });
      } else if (line.startsWith('## ')) {
        blocks.push({
          id: `blk_${currentOrder}`,
          type: 'heading',
          level: 2,
          text: line.replace('## ', ''),
          pageNumber: Math.floor(i / 10) + 1,
          readingOrder: currentOrder++,
        });
      } else if (line.startsWith('### ')) {
        blocks.push({
          id: `blk_${currentOrder}`,
          type: 'heading',
          level: 3,
          text: line.replace('### ', ''),
          pageNumber: Math.floor(i / 10) + 1,
          readingOrder: currentOrder++,
        });
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        blocks.push({
          id: `blk_${currentOrder}`,
          type: 'list',
          items: [line.replace(/^[*|-]\s*/, '')],
          pageNumber: Math.floor(i / 10) + 1,
          readingOrder: currentOrder++,
        });
      } else if (line.includes('|') && line.split('|').length >= 3) {
        const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length > 0 && !line.includes('---')) {
          const tableId = `tbl_${tables.length + 1}`;
          tables.push({
            id: tableId,
            pageNumber: Math.floor(i / 10) + 1,
            headers: cells,
            rows: [cells],
            summary: `Data table with ${cells.length} columns`,
            hasHeaders: false,
            isComplex: cells.length > 4,
          });
          blocks.push({
            id: `blk_${currentOrder}`,
            type: 'table',
            tableId,
            pageNumber: Math.floor(i / 10) + 1,
            readingOrder: currentOrder++,
          });
        }
      } else {
        blocks.push({
          id: `blk_${currentOrder}`,
          type: 'paragraph',
          text: line,
          pageNumber: Math.floor(i / 10) + 1,
          readingOrder: currentOrder++,
        });
      }
    }

    if (inputType === 'image' || inputType === 'pdf' || rawText.toLowerCase().includes('chart') || rawText.toLowerCase().includes('figure')) {
      images.push({
        id: 'img_1',
        pageNumber: 2,
        isChartOrGraph: true,
        hasExistingAlt: false,
        chartDataSummary: 'Quarterly financial revenue metrics progressing from Q1 to Q4',
      });
      images.push({
        id: 'img_2',
        pageNumber: 3,
        isChartOrGraph: false,
        hasExistingAlt: false,
      });
    }

    if (inputType === 'audio' || inputType === 'video') {
      media = {
        id: 'med_1',
        type: inputType === 'video' ? 'video' : 'audio',
        durationSeconds: 184,
        hasAudio: true,
        hasVideo: inputType === 'video',
        detectedSpeechLanguage: 'en',
        transcript: rawText,
        timedCaptions: [
          { start: 0, end: 4, speaker: 'Host', text: 'Welcome to this accessibility overview.' },
          { start: 5, end: 11, speaker: 'Presenter', text: 'We are demonstrating how INCLUSA transforms content automatically.' },
          { start: 12, end: 18, speaker: 'Presenter', text: 'Visual charts, tables, and speech are remediated to full WCAG compliance.' },
        ],
      };
    }

    const pageCount = Math.max(1, Math.ceil(blocks.length / 8));
    const detectedLanguage = this.detectLanguage(rawText);

    return {
      id: documentId,
      inputType,
      title,
      originalFileName: input.fileName,
      fileSizeBytes: input.fileSizeBytes || 1024 * 45,
      rawText,
      blocks,
      images,
      tables,
      media,
      pageCount,
      detectedLanguage,
      hasScannedPages: inputType === 'pdf' && rawText.includes('scanned'),
      metadata: {
        author: 'Digital Content Author',
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
    if (type === 'audio' || type === 'video') {
      return `Welcome to the INCLUSA keynote presentation. Today we explore agentic multimodal AI solutions designed to bridge digital divides. Over two billion people experience digital accessibility barriers daily. Our automated architecture transforms complex visual documents, audio recordings, and dense reports into accessible formats instantaneously.`;
    }
    if (type === 'url') {
      return `# Web Accessibility Audit Target: ${title}\nThe target web resource features interactive user dashboards, dynamic charts, and customer reporting summaries. Multiple images and navigation elements require semantic accessibility enhancement.`;
    }
    return `# ${title}\n## Executive Strategic Overview\nThis document contains comprehensive quarterly operational metrics, financial distribution curves, and strategic product initiatives for the upcoming fiscal cycle.\n\n## Quarterly Growth Metrics\nQuarterly performance demonstrated sustained momentum across regional sectors. Revenue reached 185 million in the fourth quarter, representing an 85% increase relative to initial baseline forecasts.\n\n## Key Operational Tables\n| Quarter | Target (M) | Actual (M) | Growth Rate |\n| Q1 | 95 | 100 | +5.2% |\n| Q2 | 115 | 125 | +8.7% |\n| Q3 | 140 | 155 | +10.7% |\n| Q4 | 170 | 185 | +8.8% |\n\n## Implementation Roadmap\n* Complete enterprise deployment across all regional branches.\n* Ensure full digital accessibility compliance across consumer-facing applications.\n* Establish automated verification monitoring for all published assets.`;
  }
}

export const contentUnderstandingAgent = new ContentUnderstandingAgent();
