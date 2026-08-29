import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { aiService } from '@/lib/ai/ai-service';
import { chatRequestSchema } from '@/lib/validation/schemas';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError } from '@/lib/utils/api-response';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized('Valid authentication session required.');
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiValidationError(parsed.error);
    }

    const { question, documentTitle, documentText, chatHistory } = parsed.data;

    const formattedHistory = chatHistory?.map((msg) => ({
      role: msg.role || msg.sender || 'user',
      content: msg.content,
    }));

    const result = await aiService.answerDocumentQuestion({
      question,
      documentTitle: documentTitle || 'Analyzed Document',
      documentText,
      chatHistory: formattedHistory,
    });

    return apiSuccess({
      answer: result.answer,
      citations: result.citations,
    });
  } catch (err: any) {
    console.error('API /api/chat error:', err);
    return apiError(err.message || 'Chat assistant failed');
  }
}
