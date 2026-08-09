#!/usr/bin/env node
/**
 * Sync plugin source files into the live Obsidian plugins folder.
 *
 * Usage:
 *   npm run sync          one-time copy
 *   npm run watch         copy + re-copy when source files change
 *
 * The destination path defaults to ~/Documents/Bible Notes/.obsidian/plugins/My-Bible/
 * Override with: SYNC_DEST="/path/to/plugin" npm run sync
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const FILES = ['main.js', 'manifest.json', 'styles.css'];

const DEFAULT_DEST = path.join(
  os.homedir(),
  'Documents',
  'Bible Notes',
  '.obsidian',
  'plugins',
  'My-Bible'
);

const dest = process.env.SYNC_DEST || DEFAULT_DEST;

if (!fs.existsSync(dest)) {
  console.error(`\n❌ Destination not found: ${dest}`);
  console.error(`   Set SYNC_DEST=/your/path npm run sync to override.\n`);
  process.exit(1);
}

function copy() {
  const stamp = new Date().toLocaleTimeString();
  FILES.forEach(f => {
    const src = path.join(__dirname, '..', f);
    const tgt = path.join(dest, f);
    if (!fs.existsSync(src)) return;
    fs.copyFileSync(src, tgt);
  });
  console.log(`[${stamp}] synced → ${dest}`);
}

if (process.argv.includes('--watch')) {
  console.log('Watching for changes (Ctrl+C to stop)...');
  copy();
  FILES.forEach(f => {
    const src = path.join(__dirname, '..', f);
    fs.watchFile(src, { interval: 500 }, copy);
  });
} else {
  copy();
}