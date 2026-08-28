import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { aiService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Valid authentication session required.' }, { status: 401 });
    }

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
