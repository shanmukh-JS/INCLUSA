const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDirRecursive(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
}

console.log('=== Merging all frontend, backend, database folders into unified root ===\n');

// 1. Merge Frontend
console.log('1. Merging frontend (app, components, context, styles)...');
copyDirRecursive(path.join(root, 'frontend', 'app'), path.join(root, 'app'));
copyDirRecursive(path.join(root, 'frontend', 'components'), path.join(root, 'components'));
copyDirRecursive(path.join(root, 'frontend', 'context'), path.join(root, 'context'));
copyDirRecursive(path.join(root, 'frontend', 'styles'), path.join(root, 'styles'));

// 2. Merge Backend
console.log('2. Merging backend (agents, ai, rules, scoring, types)...');
copyDirRecursive(path.join(root, 'backend', 'agents'), path.join(root, 'lib', 'agents'));
copyDirRecursive(path.join(root, 'backend', 'ai'), path.join(root, 'lib', 'ai'));
copyDirRecursive(path.join(root, 'backend', 'rules'), path.join(root, 'lib', 'rules'));
copyDirRecursive(path.join(root, 'backend', 'scoring'), path.join(root, 'lib', 'scoring'));
copyDirRecursive(path.join(root, 'backend', 'types'), path.join(root, 'types'));

// 3. Merge Database
console.log('3. Merging database (supabase, storage, mock, schema)...');
copyDirRecursive(path.join(root, 'database', 'supabase'), path.join(root, 'lib', 'supabase'));
copyDirRecursive(path.join(root, 'database', 'storage'), path.join(root, 'lib', 'storage'));
copyDirRecursive(path.join(root, 'database', 'mock'), path.join(root, 'lib', 'mock'));

if (fs.existsSync(path.join(root, 'database', 'supabase-schema.sql'))) {
  fs.copyFileSync(path.join(root, 'database', 'supabase-schema.sql'), path.join(root, 'supabase-schema.sql'));
}
if (fs.existsSync(path.join(root, 'database', 'client.ts')) && !fs.existsSync(path.join(root, 'lib', 'supabase', 'client.ts'))) {
  fs.copyFileSync(path.join(root, 'database', 'client.ts'), path.join(root, 'lib', 'supabase', 'client.ts'));
}
if (fs.existsSync(path.join(root, 'database', 'db.ts')) && !fs.existsSync(path.join(root, 'lib', 'supabase', 'db.ts'))) {
  fs.copyFileSync(path.join(root, 'database', 'db.ts'), path.join(root, 'lib', 'supabase', 'db.ts'));
}

// 4. Remove separate folders
console.log('4. Removing separate frontend, backend, and database directories...');
removeDirRecursive(path.join(root, 'frontend'));
removeDirRecursive(path.join(root, 'backend'));
removeDirRecursive(path.join(root, 'database'));

console.log('\n=== UNIFIED MERGE COMPLETE! ===');
