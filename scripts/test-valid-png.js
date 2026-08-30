const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const zlib = require('zlib');

// Create a valid 32x32 RGB PNG buffer
function createValidPng() {
  const width = 32;
  const height = 32;
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      if (x < width / 2) {
        rawData.push(0, 220, 50);
      } else {
        rawData.push(220, 80, 30);
      }
    }
  }
  const idatData = zlib.deflateSync(Buffer.from(rawData));

  function crc(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = c ^ buf[i];
      for (let k = 0; k < 8;k++) {
        c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]).toString('base64');
}

async function run() {
  const pngBase64 = createValidPng();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{* parts: [
          { text: 'Describe what is visible in this image. Do not invent anything. Describe colors and split composition.' },
          {
            inlineData: {
              mimeType: 'image/png',
              data: pngBase64
            }
          }
        ]
      }]
    })
  });

  const data = await res.json();
  const txt = data.candidates[0].content.parts[0].text;
  const status = res.status;
  const logMsg = `Status: ${status}\nText: ${txt}`;
  console.log(logMsg);
}
run();
