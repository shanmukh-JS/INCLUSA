const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

async function testGenerate() {
  if (!key) {
    console.log('No GEMINI_API_KEY found in environment.');
    return;
  }
  console.log('Testing gemini-3.6-flash...');
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Hello! Return: GEMINI_READY' }] }]
    })
  });
  
  const json = await res.json();
  console.log('Status:', res.status);
  console.log('Text Output:', json.candidates?.[0]?.content?.parts?.[0]?.text);
}

testGenerate();
