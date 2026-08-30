const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAADulEJRQAAADUlEQVR4n2Nk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function testVisionModels() {
  const models = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-lite-latest'];
  for (const m of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: 'Describe this image in 10 words. Return JSON with key "description".' },
              { inline_data: { mime_type: 'image/png', data: samplePngBase64 } }
            ]
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        })
      });
      const data = await res.json();
      const txt = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) || JSON.stringify(data.error || data);
      console.log(`${m} -> ${res.status}: ${txt}`);
    } catch(e) {
      console.log(`${m} -> error: ${e.message}`);
    }
  }
}
testVisionModels();
