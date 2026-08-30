const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const jpegBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2gBDAcMDBAUMDBAUMGBQUGBQgGBQgGBGgGCAgICAsKCQoLCQsLDQ0ODg0MDQwMEgwSDRMPERAPEREQLEQQFRQQFRFR/2gBDAQUGBAgIBQgKBRgQERAQURBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR/wAARCAAgAAgDASIAAhEBAxEB/8QAGwAAAQEBAQEBAAAAAAAAAAAAAQIDBAUHBwg$/8QAMREAAgEDAgIDAwIEBQQAAAAAAAEBAgMEBQAFEQg1GRETIhRXgfPBFyODQiJCUkZTVMr/xAAgEEAQIFAQEAAAAAAAAAAAABAgMEBQAHEQg1/8QAGxEBAxEAAAAAAAAAAAAAAAAAAAABgwEA/wAzzP/gAgA/wdEABF/9f9k/8AA2A/9rj/sA3P//9//gAgA//9//wDyn/9VAB8AAAAADgAAAABxAAAABQAAAAEgAAAABwAAAAAA/8QAMEAAAABAAAAAAAAAAAAAAAAAADAgAEBBgQAAAAEAwEDAAAAAAAAAAAAAAAAAAAAAAAAwEEAAgEEAwMAAAAAAAAAAAAAAAAAAAAAAAEBAAABAAAAAAEBAAAAAAAAAAAAAAAAAAAAAAEBAAABAAAAAAAAAAAAAAAAAAAAAAAA/9oAADAMAAEAhQEFAP/aADQAAAADBAAAAAAAAAAAAAAAAAAA/9oAADAMAAEAhQEFAP/aADQAAAADBAAAAAAAAAAAAAAAAAAAA';

async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: 'Describe what is visible in this image'
        }, {
          inlineData: {
            mimeType: 'image/jpeg',
            data: jpegBase64
          }
        }]
      }]
    })
  });
  const data = await res.json();
  const txt = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text || JSON.stringify(data);
  const status = res.status;
  console.log('Status:', status, 'Text:', txt);
}
run();
