# My Bible — Obsidian Plugin

A custom Obsidian Bible sidecar that reads local JSON Bible files. Supports ESV,
CSB, NASB, NIV, NKJV, NLT, NET, LSB, plus WLC (Hebrew OT) and SBLGNT (Greek NT).
Click verses to select them; selected verses copy to your clipboard as formatted
callouts. Footnotes appear as tooltips, and cross-references open in stacked,
resizable panes inside the same view.

## Quick start (development)

```bash
# Install nothing — pure CommonJS, no build step.
# Edit files in this repo, then sync to your live Obsidian plugin folder:
npm run sync

# Or auto-sync on every save:
npm run watch

# Then in Obsidian: Settings → Community plugins → toggle My Bible off/on (or Ctrl+R)
# to reload the latest code.
```

The sync script copies `main.js`, `manifest.json`, and `styles.css` to:

```
~/Documents/Bible Notes/.obsidian/plugins/My-Bible/
```

Override the destination with the `SYNC_DEST` env var if your vault lives
elsewhere:

```bash
SYNC_DEST="/path/to/your/vault/.obsidian/plugins/My-Bible" npm run sync
```

## Project layout

```
.
├── main.js          # Plugin code (BibleSidecarPlugin, BibleView, settings tab)
├── styles.css       # Plugin styles
├── manifest.json    # Obsidian plugin manifest (id, name, version)
├── scripts/
│   ├── sync.js      # Copies source files into the live plugin folder
│   └── smoke.js     # Sanity check: loads each Bible JSON and reports shape
└── README.md
```

## Bible data format

Each translation lives under `Bible Notes/bibles/<TRANSLATION>/<Book>.json`.
Example shape:

```json
{
  "book": "Genesis",
  "chapters": {
    "1": {
      "footnotes": { "a": "Genesis 1:6 Or _a canopy_; also verses 7, 8..." },
      "crossrefs": { "x": "John 1:3" },
      "blocks": [
        { "type": "heading", "text": "The Creation of the World" },
        { "type": "prose_paragraph", "verses": [
          { "number": 1, "text": "In the beginning, God created..." },
          { "number": 2, "text": "..." }
        ]},
        { "type": "poetry_stanza", "lines": [
          { "verse": 27, "text": "...", "indent": 0 }
        ]}
      ]
    }
  }
}
```

## Notes

- No build step. Pure CommonJS so Obsidian loads it directly.
- Source of truth for plugin code is **this folder**, not the live plugin
  folder. Edit here, sync, reload Obsidian.
- The live plugin folder (`Bible Notes/.obsidian/plugins/My-Bible/`) is treated
  as a deploy artifact, not an edit target.

## What this plugin does well today

- Multi-translation reading with side-by-side cross-reference panes
- Click-to-select verses, multi-select, formatted clipboard output
- Hebrew/Greek mode that auto-routes OT to WLC and NT to SBLGNT
- DOM windowing for fast scrolling through long books
- Footnote tooltips with cross-ref click-through
- Center-position restore across layout changes