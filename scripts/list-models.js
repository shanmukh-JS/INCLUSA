const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        process.env[k] = v;
      }
    }
  });
}

const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

async function list() {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key);
    const data = await res.json();
    if (data.models) {
      console.log('Available models count:', data.models.length);
      data.models.forEach((x) => {
        if (x.supportedGenerationMethods && x.supportedGenerationMethods.includes('generateContent')) {
          console.log(x.name.replace('models/', '') + ' -> ' + x.displayName);
        }
      });
    } else {
      console.log('Error listing models:', data);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

list();
