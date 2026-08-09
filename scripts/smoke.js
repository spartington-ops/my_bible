#!/usr/bin/env node
/**
 * Smoke check — load every Bible JSON in the vault and verify shape.
 * Catches schema drift and missing files without needing to launch Obsidian.
 *
 * Usage:   npm run lint
 * Source:  ~/Documents/Bible Notes/bibles/
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const BIBLES_DIR = path.join(os.homedir(), 'Documents', 'Bible Notes', 'bibles');

if (!fs.existsSync(BIBLES_DIR)) {
  console.error(`❌ Bibles folder not found: ${BIBLES_DIR}`);
  process.exit(1);
}

const translations = fs.readdirSync(BIBLES_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let totalBooks = 0;
let totalChapters = 0;
const errors = [];
const skipped = ['wlc', 'hebrew', 'sblgnt', 'greek'];

console.log(`Found ${translations.length} translation(s) in ${BIBLES_DIR}\n`);

for (const trans of translations) {
  const isOriginal = skipped.includes(trans.toLowerCase());
  const transDir = path.join(BIBLES_DIR, trans);
  const allFiles = fs.readdirSync(transDir).filter(f => f.endsWith('.json'));
  const meta = allFiles.find(f => f.toLowerCase() === 'metadata.json');
  if (meta) {
    try {
      const m = JSON.parse(fs.readFileSync(path.join(transDir, meta), 'utf8'));
      if (!m.id || !Array.isArray(m.books)) errors.push(`${trans}/${meta}: missing 'id' or 'books'`);
    } catch (e) { errors.push(`${trans}/${meta}: ${e.message}`); }
  }
  const files = allFiles.filter(f => f.toLowerCase() !== 'metadata.json');

  let okBooks = 0;
  let okChapters = 0;

  for (const file of files) {
    const fp = path.join(transDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      if (!data.book) errors.push(`${trans}/${file}: missing 'book'`);
      if (!data.chapters) errors.push(`${trans}/${file}: missing 'chapters'`);
      else {
        const chapterKeys = Object.keys(data.chapters);
        // Spot-check first chapter has blocks
        const firstCh = data.chapters[chapterKeys[0]];
        if (!firstCh.blocks) errors.push(`${trans}/${file}: first chapter missing 'blocks'`);
        else okChapters += chapterKeys.length;
      }
      okBooks++;
    } catch (e) {
      errors.push(`${trans}/${file}: ${e.message}`);
    }
  }

  totalBooks += okBooks;
  totalChapters += okChapters;
  const tag = isOriginal ? ' [original]' : '';
  console.log(`  ✓ ${trans.padEnd(8)} ${okBooks} book(s), ${okChapters} chapter(s)${tag}`);
}

console.log(`\nTotal: ${totalBooks} books, ${totalChapters} chapters across ${translations.length} translations.`);

if (errors.length) {
  console.error(`\n❌ ${errors.length} issue(s):\n`);
  errors.slice(0, 20).forEach(e => console.error(`  ${e}`));
  if (errors.length > 20) console.error(`  ... and ${errors.length - 20} more`);
  process.exit(1);
}

console.log('\n✅ All Bible JSONs parse cleanly.');