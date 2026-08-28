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

console.log('=== Reorganizing INCLUSA into clean [frontend, backend, database] ===\n');

// 1. Move Frontend assets into frontend/
console.log('1. Migrating Frontend assets (app, components, context, styles)...');
copyDirRecursive(path.join(root, 'app'), path.join(root, 'frontend', 'app'));
copyDirRecursive(path.join(root, 'components'), path.join(root, 'frontend', 'components'));
copyDirRecursive(path.join(root, 'context'), path.join(root, 'frontend', 'context'));
copyDirRecursive(path.join(root, 'styles'), path.join(root, 'frontend', 'styles'));

// 2. Move Backend assets into backend/
console.log('2. Migrating Backend assets (agents, ai, rules, scoring, types)...');
copyDirRecursive(path.join(root, 'lib', 'agents'), path.join(root, 'backend', 'agents'));
copyDirRecursive(path.join(root, 'lib', 'ai'), path.join(root, 'backend', 'ai'));
copyDirRecursive(path.join(root, 'lib', 'rules'), path.join(root, 'backend', 'rules'));
copyDirRecursive(path.join(root, 'lib', 'scoring'), path.join(root, 'backend', 'scoring'));
copyDirRecursive(path.join(root, 'types'), path.join(root, 'backend', 'types'));

// 3. Move Database assets into database/
console.log('3. Migrating Database assets (supabase, storage, mock, schema)...');
copyDirRecursive(path.join(root, 'lib', 'supabase'), path.join(root, 'database', 'supabase'));
copyDirRecursive(path.join(root, 'lib', 'storage'), path.join(root, 'database', 'storage'));
copyDirRecursive(path.join(root, 'lib', 'mock'), path.join(root, 'database', 'mock'));
if (fs.existsSync(path.join(root, 'supabase-schema.sql'))) {
  fs.copyFileSync(path.join(root, 'supabase-schema.sql'), path.join(root, 'database', 'supabase-schema.sql'));
}

// 4. Clean up root loose directories
console.log('4. Removing loose root directories...');
removeDirRecursive(path.join(root, 'app'));
removeDirRecursive(path.join(root, 'components'));
removeDirRecursive(path.join(root, 'context'));
removeDirRecursive(path.join(root, 'lib'));
removeDirRecursive(path.join(root, 'styles'));
removeDirRecursive(path.join(root, 'types'));
if (fs.existsSync(path.join(root, 'supabase-schema.sql'))) {
  fs.unlinkSync(path.join(root, 'supabase-schema.sql'));
}

console.log('\n=== REORGANIZATION COMPLETE! ===');
console.log('Your root Explorer now ONLY contains: [frontend, backend, database, scripts]');
