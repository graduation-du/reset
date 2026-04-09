/**
 * Build script — copies production files to /dist for deployment.
 * Run: node build.js
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');

// Files & folders to include in the build
const COPY_FILES = [
  'server.js',
  'package.json',
  'package-lock.json',
  'ecosystem.config.js',
  '.env.example'
];

const COPY_DIRS = [
  'views',
  'public'
];

// --- Helpers ---

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyFileSync(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// --- Build ---

console.log('Building production dist...\n');

// 1. Clean dist/
cleanDir(DIST);
console.log('  Cleaned dist/');

// 2. Copy individual files
for (const file of COPY_FILES) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    copyFileSync(src, path.join(DIST, file));
    console.log(`  Copied ${file}`);
  }
}

// 3. Copy directories
for (const dir of COPY_DIRS) {
  const src = path.join(__dirname, dir);
  if (fs.existsSync(src)) {
    copyDirSync(src, path.join(DIST, dir));
    const count = fs.readdirSync(src, { recursive: true }).length;
    console.log(`  Copied ${dir}/ (${count} items)`);
  }
}

// 4. Write a production .env from the example
const envExample = path.join(__dirname, '.env.example');
const envDist = path.join(DIST, '.env');
if (fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envDist);
  console.log('  Created .env from .env.example');
}

// 5. Create logs directory
fs.mkdirSync(path.join(DIST, 'logs'), { recursive: true });
fs.writeFileSync(path.join(DIST, 'logs', '.gitkeep'), '');
console.log('  Created logs/');

// 6. Strip dev script from package.json in dist
const pkgPath = path.join(DIST, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
delete pkg.scripts.dev;
pkg.scripts.build = undefined;
// Clean up undefined keys
const cleanPkg = JSON.parse(JSON.stringify(pkg));
fs.writeFileSync(pkgPath, JSON.stringify(cleanPkg, null, 2) + '\n');
console.log('  Cleaned package.json (removed dev scripts)');

console.log('\n  Build complete! Output: dist/');
console.log('\n  To deploy:');
console.log('    1. Upload the dist/ folder to your server');
console.log('    2. cd dist && npm install --production');
console.log('    3. Edit .env if needed');
console.log('    4. pm2 start ecosystem.config.js');
console.log('');
