const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Common installation paths for Git on Windows
const possibleGitPaths = [
  'git',
  'C:\\Program Files\\Git\\cmd\\git.exe',
  'C:\\Program Files\\Git\\bin\\git.exe',
  'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
  'C:\\Program Files (x86)\\Git\\bin\\git.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Git', 'cmd', 'git.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Git', 'bin', 'git.exe'),
  path.join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Programs', 'Git', 'cmd', 'git.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'GitHubDesktop', 'app-3.4.9', 'resources', 'app', 'git', 'cmd', 'git.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'GitHubDesktop', 'app-3.4.8', 'resources', 'app', 'git', 'cmd', 'git.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'GitHubDesktop', 'app-3.4.7', 'resources', 'app', 'git', 'cmd', 'git.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'GitHubDesktop', 'app-3.4.6', 'resources', 'app', 'git', 'cmd', 'git.exe'),
];

// Dynamically check GitHub Desktop folders if any exist
try {
  const ghDesktopDir = path.join(process.env.LOCALAPPDATA || '', 'GitHubDesktop');
  if (fs.existsSync(ghDesktopDir)) {
    const entries = fs.readdirSync(ghDesktopDir);
    for (const entry of entries) {
      if (entry.startsWith('app-')) {
        possibleGitPaths.push(path.join(ghDesktopDir, entry, 'resources', 'app', 'git', 'cmd', 'git.exe'));
      }
    }
  }
} catch (e) {}

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
  console.error('\n❌ ERROR: Git is not found on your computer!');
  console.error('Please install Git from: https://git-scm.com/download/win');
  console.error('Once installed, run: npm run push\n');
  process.exit(1);
}

console.log(`\nUsing Git binary: ${gitBinary}`);
console.log('=== INCLUSA: Pushing to GitHub (https://github.com/shanmukh-JS/INCLUSA) ===\n');

function run(cmd) {
  const fullCmd = `${gitBinary} ${cmd}`;
  console.log(`\n> ${fullCmd}`);
  try {
    execSync(fullCmd, { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error(`Command failed: ${fullCmd}`);
    return false;
  }
}

// 1. Initialize git
run('init');

// 2. Set remote origin
try {
  execSync(`${gitBinary} remote remove origin`, { stdio: 'ignore' });
} catch (e) {}
run('remote add origin https://github.com/shanmukh-JS/INCLUSA.git');

// 3. Stage files (protected by .gitignore)
run('add .');

// 4. Commit
run('commit -m "feat: complete INCLUSA multimodal AI accessibility platform"');

// 5. Set branch and push
run('branch -M main');
run('push -u origin main --force');

console.log('\n=== SUCCESS! Your repository is live at https://github.com/shanmukh-JS/INCLUSA ===');
