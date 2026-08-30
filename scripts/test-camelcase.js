const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const imgBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAADulEJRQAAADUlEQVR4n2Nk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const prompt = 'What color is this image? Return JSON with key "color".';

async function test() {
  const body = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/png',
            data: imgBase64
          }
        }
      ]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1
    }
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  const status = res.status;
  console.log('status:', status);
  if (data.candidates && data.candidates[0]) {
    console.log('result:', data.candidates[0].content.parts[0].text);
  } else {
    console.log('error:', data);
  }
}
test();
