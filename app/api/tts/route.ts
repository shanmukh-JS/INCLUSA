import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { ttsRequestSchema } from '@/lib/validation/schemas';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError } from '@/lib/utils/api-response';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return apiUnauthorized('Authentication required.');
    }

    const body = await req.json();
    const parsed = ttsRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiValidationError(parsed.error);
    }

    const { text, voice, speed } = parsed.data;
    const apiKey = process.env.OPENAI_API_KEY;

    // If live OpenAI key is configured, synthesize high quality neural speech
    if (apiKey && apiKey.startsWith('sk-')) {
      try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: text.substring(0, 4096),
            voice: voice,
            speed: speed,
          }),
        });

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      } catch (err) {
        console.warn('Live TTS API call failed, falling back to Web Speech client instruction:', err);
      }
    }

    // Graceful instruction for client-side Web Speech Synthesis API
    return apiSuccess({
      useClientSynthesis: true,
      text: text,
      provider: 'Web Speech API (SpeechSynthesis)',
      message: 'Synthesizing speech via native browser audio engine',
    });
  } catch (err: any) {
    return apiError(err.message || 'TTS generation failed');
  }
}
