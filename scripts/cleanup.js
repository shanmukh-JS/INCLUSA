const fs = require('fs');
const files = fs.readdirSync('.');
files.forEach((f) => {
  if (f.startsWith('console.log') || f.startsWith('{') || f === '0' || f.includes('(')) {
    try {
      fs.unlinkSync(f);
      console.log(`Deleted stray file: ${f}`);
    } catch (e) {}
  }
});
