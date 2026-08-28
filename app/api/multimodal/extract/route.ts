import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { aiService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    const body = await req.json();
    const { fileDataUrl, fileName, inputType, mimeType, title, url, rawText } = body;

    if (!fileDataUrl && !rawText && !url) {
      return NextResponse.json(
        { error: 'Missing content: please provide fileDataUrl, rawText, or url.' },
        { status: 400 }
      );
    }

    const extraction = await aiService.extractMultimodalContent({
      fileDataUrl,
      fileName: fileName || 'Uploaded Document',
      inputType: inputType || 'image',
      mimeType,
      title: title || fileName || 'Analyzed Document',
      url,
      rawText,
    });

    return NextResponse.json({
      success: true,
      extraction,
    });
  } catch (err: any) {
    console.error('API /api/multimodal/extract error:', err);
    return NextResponse.json({ error: err.message || 'Multimodal extraction failed' }, { status: 500 });
  }
}
