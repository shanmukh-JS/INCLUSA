const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const possibleGitPaths = [
  'C:\\Program Files\\Git\\cmd\\git.exe',
  'C:\\Program Files\\Git\\bin\\git.exe',
  'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Git', 'cmd', 'git.exe'),
  'git',
];

let gitBinary = null;
for (const p of possibleGitPaths) {
  if (p === 'git') {
    try {
      execSync('git --version', { stdio: 'ignore' });
      gitBinary = 'git';
      break;
    } catch (e) {}
  } else if (fs.existsSync(p)) {
    gitBinary = `"${p}"`;
    break;
  }
}

if (!gitBinary) {
  console.error('Git not found');
  process.exit(1);
}

function run(cmd) {
  const fullCmd = `${gitBinary} ${cmd}`;
  console.log(`> ${fullCmd}`);
  try {
    execSync(fullCmd, { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error(`Command failed: ${fullCmd}`);
    return false;
  }
}

run('init');
try { execSync(`${gitBinary} remote remove origin`, { stdio: 'ignore' }); } catch (e) {}
run('remote add origin https://github.com/shanmukh-JS/INCLUSA.git');
run('add .');
run('commit --amend -m "feat: complete INCLUSA multimodal AI accessibility platform with grounded Gemini 3.6 engine"');
run('branch -M main');
run('push -u origin main --force');
console.log('\n=== SUCCESS! Pushed to https://github.com/shanmukh-JS/INCLUSA ===');
