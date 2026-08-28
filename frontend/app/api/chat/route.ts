import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, documentTitle, documentText, chatHistory } = body;

    if (!question || !documentText) {
      return NextResponse.json(
        { error: 'Missing required fields: question, documentText' },
        { status: 400 }
      );
    }

    const result = await aiService.answerDocumentQuestion({
      question,
      documentTitle: documentTitle || 'Analyzed Document',
      documentText,
      chatHistory,
    });

    return NextResponse.json({
      success: true,
      answer: result.answer,
      citations: result.citations,
    });
  } catch (err: any) {
    console.error('API /api/chat error:', err);
    return NextResponse.json({ error: err.message || 'Chat assistant failed' }, { status: 500 });
  }
}
