const obsidian = require("obsidian");

const VIEW_TYPE = "bible-view";

const CANONICAL_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const BOOK_ALIASES = {
  "gen": "Genesis", "ge": "Genesis", "gn": "Genesis", "genesis": "Genesis",
  "exod": "Exodus", "ex": "Exodus", "exo": "Exodus", "exodus": "Exodus",
  "lev": "Leviticus", "le": "Leviticus", "lv": "Leviticus", "leviticus": "Leviticus",
  "num": "Numbers", "nu": "Numbers", "nm": "Numbers", "nb": "Numbers", "numbers": "Numbers",
  "deut": "Deuteronomy", "de": "Deuteronomy", "dt": "Deuteronomy", "deuteronomy": "Deuteronomy",
  "josh": "Joshua", "jos": "Joshua", "jsh": "Joshua", "joshua": "Joshua",
  "judg": "Judges", "jdg": "Judges", "jg": "Judges", "jdgs": "Judges", "judges": "Judges",
  "ruth": "Ruth", "rth": "Ruth", "ru": "Ruth",
  "1 sam": "1 Samuel", "1 sm": "1 Samuel", "1 sa": "1 Samuel", "1 s": "1 Samuel", "i sam": "1 Samuel", "1sam": "1 Samuel",
  "2 sam": "2 Samuel", "2 sm": "2 Samuel", "2 sa": "2 Samuel", "2 s": "2 Samuel", "ii sam": "2 Samuel", "2sam": "2 Samuel",
  "1 kings": "1 Kings", "1 kgs": "1 Kings", "1 ki": "1 Kings", "1kgs": "1 Kings", "i kings": "1 Kings",
  "2 kings": "2 Kings", "2 kgs": "2 Kings", "2 ki": "2 Kings", "2kgs": "2 Kings", "ii kings": "2 Kings",
  "1 chron": "1 Chronicles", "1 chr": "1 Chronicles", "1 ch": "1 Chronicles", "1chron": "1 Chronicles", "i chronicles": "1 Chronicles",
  "2 chron": "2 Chronicles", "2 chr": "2 Chronicles", "2 ch": "2 Chronicles", "2chron": "2 Chronicles", "ii chronicles": "2 Chronicles",
  "ezra": "Ezra", "ezr": "Ezra", "nehemiah": "Nehemiah", "neh": "Nehemiah", "esther": "Esther", "est": "Esther",
  "job": "Job", "jb": "Job", "psalms": "Psalms", "ps": "Psalms", "psalm": "Psalms", "psa": "Psalms",
  "proverbs": "Proverbs", "prov": "Proverbs", "prv": "Proverbs", "ecclesiastes": "Ecclesiastes", "ecc": "Ecclesiastes", "qoh": "Ecclesiastes",
  "song of solomon": "Song of Solomon", "song": "Song of Solomon", "sos": "Song of Solomon",
  "isaiah": "Isaiah", "isa": "Isaiah", "jeremiah": "Jeremiah", "jer": "Jeremiah", "lamentations": "Lamentations", "lam": "Lamentations",
  "ezekiel": "Ezekiel", "ezek": "Ezekiel", "daniel": "Daniel", "dan": "Daniel", "hosea": "Hosea", "hos": "Hosea",
  "joel": "Joel", "jl": "Joel", "amos": "Amos", "am": "Amos", "obadiah": "Obadiah", "obad": "Obadiah",
  "jonah": "Jonah", "jnh": "Jonah", "micah": "Micah", "mic": "Micah", "nahum": "Nahum", "nah": "Nahum",
  "habakkuk": "Habakkuk", "hab": "Habakkuk", "zephaniah": "Zephaniah", "zeph": "Zephaniah", "haggai": "Haggai", "hag": "Haggai",
  "zechariah": "Zechariah", "zech": "Zechariah", "malachi": "Malachi", "mal": "Malachi",
  "matthew": "Matthew", "matt": "Matthew", "mt": "Matthew", "mark": "Mark", "mrk": "Mark", "mk": "Mark",
  "luke": "Luke", "luk": "Luke", "lk": "Luke", "john": "John", "joh": "John", "jn": "John",
  "acts": "Acts", "act": "Acts", "ac": "Acts", "romans": "Romans", "rom": "Romans", "ro": "Romans",
  "1 corinthians": "1 Corinthians", "1 cor": "1 Corinthians", "1cor": "1 Corinthians",
  "2 corinthians": "2 Corinthians", "2 cor": "2 Corinthians", "2cor": "2 Corinthians",
  "galatians": "Galatians", "gal": "Galatians", "ephesians": "Ephesians", "eph": "Ephesians",
  "philippians": "Philippians", "phil": "Philippians", "php": "Philippians", "colossians": "Colossians", "col": "Colossians",
  "1 thessalonians": "1 Thessalonians", "1 thess": "1 Thessalonians", "1thess": "1 Thessalonians",
  "2 thessalonians": "2 Thessalonians", "2 thess": "2 Thessalonians", "2thess": "2 Thessalonians",
  "1 timothy": "1 Timothy", "1 tim": "1 Timothy", "1tim": "1 Timothy",
  "2 timothy": "2 Timothy", "2 tim": "2 Timothy", "2tim": "2 Timothy",
  "titus": "Titus", "tit": "Titus", "philemon": "Philemon", "phm": "Philemon",
  "hebrews": "Hebrews", "heb": "Hebrews", "james": "James", "jas": "James",
  "1 peter": "1 Peter", "1 pet": "1 Peter", "1peter": "1 Peter",
  "2 peter": "2 Peter", "2 pet": "2 Peter", "2peter": "2 Peter",
  "1 john": "1 John", "1 jn": "1 John", "1john": "1 John",
  "2 john": "2 John", "2 jn": "2 John", "2john": "2 John",
  "3 john": "3 John", "3 jn": "3 John", "3john": "3 John",
  "jude": "Jude", "revelation": "Revelation", "rev": "Revelation"
};

const SORTED_ALIASES = Object.keys(BOOK_ALIASES).sort((a, b) => b.length - a.length);
const BOOK_PATTERN = SORTED_ALIASES.map(b => b.replace(/\s+/g, '\\s+')).join('|');

const DEFAULT_SETTINGS = {
  bibleVersion: "ESV",
  referenceTemplate: "[[{book} {chapter}]]:{verses}",
  copyFormat: "plain",
  showFootnoteMarkers: false,
  showHeadings: true,
  showParagraphs: true
};

class BibleSidecarPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new BibleSidecarSettingsTab(this.app, this));

    this.clipboardTimer = null;
    this.registerView(VIEW_TYPE, (leaf) => new BibleView(leaf, this));

    this.addRibbonIcon("book-open-text", "Bible", () => this.createNewBibleTab());
    this.addCommand({
      id: "open-bible-tab",
      name: "Open New Bible Tab",
      callback: () => this.createNewBibleTab(),
      icon: "book-open-text"
    });

    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(leaf => {
          if (leaf.view instanceof BibleView && leaf.view.viewMode === "reader") {
            leaf.view.restoreCenterPosition();
          }
        });
      })
    );

    // Clears selections on paste without destroying system clipboard content
    this.registerEvent(
      this.app.workspace.on("editor-paste", () => {
        this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(leaf => {
          if (leaf.view instanceof BibleView) leaf.view.clearSelections();
        });
      })
    );
  }

  setClipboardClearTimer(delayMs = 30000) {
    if (this.clipboardTimer) clearTimeout(this.clipboardTimer);
    this.clipboardTimer = setTimeout(async () => {
      try {
        await navigator.clipboard.writeText("");
        new obsidian.Notice("Clipboard cleared.");
      } catch (e) {}
      this.clipboardTimer = null;
    }, delayMs);
  }

  async createNewBibleTab() {
    const leaf = this.app.workspace.getLeaf('split', 'vertical');
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(leaf => {
      if (leaf.view instanceof BibleView) leaf.view.updateSettings(this.settings);
    });
  }

  async getBiblesDirectory() {
    const adapter = this.app.vault.adapter;
    const vaultDir = obsidian.normalizePath("bibles");
    if (await adapter.exists(vaultDir)) return vaultDir;
    const hiddenVaultDir = obsidian.normalizePath(".bibles");
    if (await adapter.exists(hiddenVaultDir)) return hiddenVaultDir;
    return obsidian.normalizePath(`${this.manifest.dir}/bibles`);
  }
}

class BibleView extends obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.settings = plugin.settings;
    
    this.currentTranslation = this.settings.bibleVersion;
    this.installedTranslations = [];
    this.dropdownOptions = [];
    
    this.activeBook = null;
    this.viewMode = "dashboard"; 
    this.selectedVerses = [];
    
    this.activeChapter = null;
    this.targetScrollChapter = null;
    this.targetScrollVerse = null;

    this.crPanes = [];
    this.bookContexts = {};

    this.chapterObserver = null;
    this.activeTooltip = null;
    this.tooltipTimeout = null;
    this.savedCenterVerse = null;
  }

  getViewType() { return VIEW_TYPE; }
  getIcon() { return "book-open-text"; }

  getDisplayText() {
    if (this.viewMode === "reader" && this.activeBook && this.activeChapter) {
        return `${this.activeBook} ${this.activeChapter} (${this.currentTranslation})`;
    }
    if (this.viewMode === "chapters" && this.activeBook) {
        return `${this.activeBook} (${this.currentTranslation})`;
    }
    return `Bible (${this.currentTranslation})`;
  }

  updateHeaderUI() {
    const title = this.getDisplayText();
    const headerTitle = this.containerEl.querySelector('.view-header-title');
    if (headerTitle) headerTitle.innerText = title;
    if (this.leaf && this.leaf.tabHeaderInnerTitleEl) {
        this.leaf.tabHeaderInnerTitleEl.innerText = title;
    }
  }

  clearSelections() {
    this.selectedVerses = [];
    if (this.contentEl) {
      this.contentEl.querySelectorAll('.active-verse').forEach(el => el.classList.remove('active-verse'));
    }
  }

  getState() {
    const state = super.getState() || {};
    state.viewMode = this.viewMode;
    state.activeBook = this.activeBook;
    state.currentTranslation = this.currentTranslation;

    if (this.viewMode === "reader" && this.contentEl) {
      const wrapper = this.contentEl.querySelector('.main-bible-wrapper');
      const center = this.getCenterVerse(wrapper);
      if (center) {
        state.activeChapter = center.chapter;
        state.targetScrollVerse = center.verse;
        this.savedCenterVerse = center;
      } else {
        state.activeChapter = this.activeChapter;
        state.targetScrollVerse = this.targetScrollVerse;
      }
    } else {
      state.activeChapter = this.activeChapter;
      state.targetScrollVerse = this.targetScrollVerse;
    }
    return state;
  }

  async setState(state, result) {
    if (state.viewMode) this.viewMode = state.viewMode;
    if (state.activeBook) this.activeBook = state.activeBook;
    if (state.currentTranslation) this.currentTranslation = state.currentTranslation;
    if (state.activeChapter) {
      this.activeChapter = state.activeChapter;
      this.targetScrollChapter = state.activeChapter;
    }
    if (state.targetScrollVerse) {
      this.targetScrollVerse = state.targetScrollVerse;
      this.savedCenterVerse = { chapter: state.activeChapter, verse: state.targetScrollVerse };
    }
    await super.setState(state, result);
    this.renderView();
  }

  restoreCenterPosition() {
    if (this.viewMode !== "reader" || !this.contentEl) return;
    const wrapper = this.contentEl.querySelector('.main-bible-wrapper');
    const target = this.savedCenterVerse || { chapter: this.activeChapter, verse: this.targetScrollVerse };
    if (wrapper && target && target.chapter) {
      this.scrollToVerse(wrapper, target.chapter, target.verse, "center", 0);
    }
  }

  updateSettings(newSettings) {
    this.settings = newSettings;
    if (this.viewMode === "reader") this.renderView();
  }

  async onOpen() {
    await this.loadAvailableTranslations();

    this.addAction("book", "Books Library", async () => {
      this.clearSelections();
      this.activeChapter = null;
      this.targetScrollChapter = null;
      const state = this.getState();
      state.viewMode = "dashboard";
      await this.leaf.setViewState({ type: VIEW_TYPE, state: state }, { history: true });
    });

    this.addAction("languages", "Change Translation", (event) => this.showTranslationMenu(event));
    this.renderView();
  }

  showTranslationMenu(event, onSelect) {
    const menu = new obsidian.Menu();
    this.dropdownOptions.forEach(t => {
      menu.addItem((item) => {
        item.setTitle(t)
          .setChecked(this.currentTranslation === t)
          .onClick(async () => {
            if (onSelect) {
              onSelect(t);
            } else {
              this.currentTranslation = t;
              this.clearSelections();
              if (this.viewMode === "reader" && this.contentEl) {
                const wrapper = this.contentEl.querySelector('.main-bible-wrapper');
                const center = this.getCenterVerse(wrapper);
                if (center) {
                  this.activeChapter = center.chapter;
                  this.targetScrollChapter = center.chapter;
                  this.targetScrollVerse = center.verse;
                  this.savedCenterVerse = center;
                }
              }
              const state = this.getState();
              state.currentTranslation = this.currentTranslation;
              await this.leaf.setViewState({ type: VIEW_TYPE, state: state }, { history: true });
            }
          });
      });
    });
    menu.showAtMouseEvent(event);
  }

  async loadAvailableTranslations() {
    const adapter = this.app.vault.adapter;
    const biblesDir = await this.plugin.getBiblesDirectory();
    this.installedTranslations = [];
    if (await adapter.exists(biblesDir)) {
      const folders = await adapter.list(biblesDir);
      for (const folder of folders.folders) {
        this.installedTranslations.push(folder.split("/").pop());
      }
    }
    
    const hasHebrew = this.installedTranslations.some(t => ["wlc", "hebrew"].includes(t.toLowerCase()));
    const hasGreek = this.installedTranslations.some(t => ["sblgnt", "greek"].includes(t.toLowerCase()));
    
    this.dropdownOptions = this.installedTranslations.filter(t => !["wlc", "sblgnt", "hebrew", "greek"].includes(t.toLowerCase()));
    if (hasHebrew && hasGreek) this.dropdownOptions.unshift("Hebrew / Greek");
    if (!this.dropdownOptions.includes(this.currentTranslation) && this.dropdownOptions.length > 0) {
      this.currentTranslation = this.dropdownOptions[0];
    }
  }

  async fetchBookData(translation, book) {
    const adapter = this.app.vault.adapter;
    const biblesDir = await this.plugin.getBiblesDirectory();
    let targetTranslation = translation;
    
    if (translation === "Hebrew / Greek") {
      const isOT = CANONICAL_BOOKS.indexOf(book) < 39;
      targetTranslation = isOT 
        ? this.installedTranslations.find(t => ["wlc", "hebrew"].includes(t.toLowerCase()))
        : this.installedTranslations.find(t => ["sblgnt", "greek"].includes(t.toLowerCase()));
    }

    if (!targetTranslation) return null;
    const transDir = obsidian.normalizePath(`${biblesDir}/${targetTranslation}`);
    if (!(await adapter.exists(transDir))) return null;

    const transList = await adapter.list(transDir);
    const targetFile = transList.files.find(filePath => filePath.split("/").pop().toLowerCase() === `${book.toLowerCase()}.json`);

    if (targetFile && (await adapter.exists(targetFile))) {
      const bookRaw = await adapter.read(targetFile);
      const isRTL = ["wlc", "hebrew"].includes(targetTranslation.toLowerCase());
      return { data: JSON.parse(bookRaw), isRTL };
    }
    return null;
  }

  parseFnMarkdown(str, contextBook, contextChapter) {
    if (!str) return "";
    let formatted = str
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/_([^_]+)_|\*([^*]+)\*/g, (m, g1, g2) => `<i>${g1 || g2}</i>`);

    const bookRegexStr = `\\b(?:${BOOK_PATTERN})\\.?\\s+`;
    const chRegexStr = `\\b(?:ch|chapter)s?\\.?\\s+`;
    const verRegexStr = `\\b(?:v|ver|verse)s?\\.?\\s+`;
    const numRegexStr = `\\d+(?:-\\d+)?(?::\\d+(?:-\\d+)?)?`;
    const sepRegexStr = `\\s*(?:[,;]|\\band\\b|\\balso\\s+see\\b|\\bsee\\b|\\bcf\\.?\\b)\\s*`;

    const startPattern = `(?:(?:${bookRegexStr}|${chRegexStr}|${verRegexStr})${numRegexStr}|\\b\\d+(?:-\\d+)?:\\d+(?:-\\d+)?)`;
    const continuation = `(?:(?:${sepRegexStr})(?:(?:${bookRegexStr}|${chRegexStr}|${verRegexStr})?${numRegexStr}))`;
    
    const fullBlockRegex = new RegExp(`(${startPattern})(?:${continuation})*`, 'gi');
    const partRegex = new RegExp(`(${sepRegexStr})?(?:(${bookRegexStr})|(${chRegexStr})|(${verRegexStr}))?(\\d+(?:-\\d+)?)(?::(\\d+(?:-\\d+)?))?`, 'gi');

    return formatted.replace(fullBlockRegex, (blockMatch) => {
      let currentBook = contextBook;
      let currentChapter = contextChapter;
      
      return blockMatch.replace(partRegex, (match, sep, bookStr, chStr, verStr, num1, num2) => {
          let isNewBook = false;
          if (bookStr) {
              const aliasKey = bookStr.toLowerCase().replace(/[.\s]+/g, ' ').trim();
              currentBook = BOOK_ALIASES[aliasKey] || currentBook;
              isNewBook = true;
          }
          
          let targetChapter, targetVerse;
          if (chStr) {
              targetChapter = num1; currentChapter = targetChapter; if (num2) targetVerse = num2;
          } else if (verStr) {
              targetChapter = currentChapter; targetVerse = num1;
          } else if (num2) {
              targetChapter = num1; currentChapter = targetChapter; targetVerse = num2;
          } else {
              if (isNewBook || (sep && sep.includes(';'))) {
                  targetChapter = num1; currentChapter = targetChapter;
              } else {
                  targetChapter = currentChapter; targetVerse = num1;
              }
          }
          
          let sepStr = sep || '';
          let refStr = match.substring(sepStr.length);
          if (currentBook && targetChapter) {
              return `${sepStr}<a class="mb-crossref-link" data-book="${currentBook}" data-chapter="${targetChapter}" ${targetVerse ? `data-verse="${targetVerse}"` : ''}>${refStr}</a>`;
          }
          return match;
      });
    });
  }

  getCenterVerse(container) {
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    if (rect.height === 0) return null; 
    
    const centerY = rect.top + (rect.height / 2);
    const verses = Array.from(container.querySelectorAll('.verse'));
    let closestVerse = null, minDistance = Infinity;

    for (const v of verses) {
      const vRect = v.getBoundingClientRect();
      if (vRect.bottom < rect.top || vRect.top > rect.bottom) continue;
      const distance = Math.abs((vRect.top + vRect.height / 2) - centerY);
      if (distance < minDistance) {
        minDistance = distance;
        closestVerse = v;
      }
    }

    return closestVerse ? {
      chapter: closestVerse.closest('.mb-chapter-wrapper').getAttribute('data-chapter'),
      verse: closestVerse.getAttribute('data-num')
    } : null;
  }

  /* Universal scrolling utility that forces windowing hydration BEFORE positioning */
  scrollToVerse(container, chapter, verse, align = "center", level = 0) {
    if (!container || !chapter) return;

    // Ensure the target chapter and its neighbors are hydrated first
    this.updateWindowing(chapter, container, level);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const chapEl = container.querySelector(`[data-chapter="${chapter}"]`);
        if (!chapEl) return;

        if (verse) {
          const targetNum = String(verse).includes('-') ? String(verse).split('-')[0] : verse;
          const verseEl = chapEl.querySelector(`[data-num="${targetNum}"]`);
          if (verseEl) {
            verseEl.scrollIntoView({ behavior: "instant", block: align });
            return;
          }
        }
        chapEl.scrollIntoView({ behavior: "instant", block: "start" });
      });
    });
  }

  formatFootnotesAndMarkdown(text, chapData, book, chNum) {
    if (!text) return "";
    let rawText = text.replace(/--/g, "—").replace(/_([^_]+)_/g, "<i>$1</i>");
    return rawText.replace(/\[\^?([a-zA-Z0-9]+)\]/g, (match, fnKey) => {
      let fnText = chapData.footnotes?.[fnKey] || chapData.crossrefs?.[fnKey] || "Footnote text not found";
      return `<sup class="mb-footnote-marker" data-book="${book}" data-chapter="${chNum}" data-key="${fnKey}" data-fn="${encodeURIComponent(fnText)}">[${fnKey}]</sup>`;
    });
  }

  hydrateChapter(chapWrapper, chapData, book, chNum, highlightChapter, highlightVerse, isRTL) {
    chapWrapper.createEl("h2", { text: `${book} ${chNum}`, cls: "mb-chapter-heading" });
    
    let startHighlight = null, endHighlight = null;
    if (highlightChapter && String(chNum) === String(highlightChapter) && highlightVerse) {
      if (String(highlightVerse).includes('-')) {
        const parts = String(highlightVerse).split('-');
        startHighlight = parseInt(parts[0], 10); endHighlight = parseInt(parts[1], 10);
      } else {
        startHighlight = parseInt(highlightVerse, 10); endHighlight = startHighlight;
      }
    }

    const isParagraphMode = this.settings.showParagraphs;
    const isVerseSelected = (vNum) => this.selectedVerses.some(v => v.book === book && String(v.chapter) === String(chNum) && String(v.num) === String(vNum));

    const toggleVerseSelection = (evt, verseNum) => {
      if (evt.target.closest(".mb-footnote-marker") || evt.target.closest(".mb-crossref-link")) return;
      const allVerseEls = Array.from(chapWrapper.querySelectorAll(`.verse[data-num="${verseNum}"]`));
      if (allVerseEls.length === 0) return;
      
      const willBeActive = !allVerseEls[0].classList.contains("active-verse");
      allVerseEls.forEach(el => el.classList.toggle("active-verse", willBeActive));
      
      let fullVerseText = "";
      chapData.blocks.forEach(b => {
        if (b.type === "poetry_stanza") b.lines.forEach(l => { if (l.verse === verseNum) fullVerseText += l.text + " "; });
        else if (b.type === "prose_paragraph") b.verses.forEach(v => { if (v.number === verseNum) fullVerseText += v.text + " "; });
      });
      
      this.handleMultiVerseCopy(book, chNum, verseNum, fullVerseText.trim(), willBeActive);
    };

    (chapData.blocks || []).forEach(block => {
      if (block.type === "heading" && this.settings.showHeadings) {
        chapWrapper.createEl("h3", { text: block.text, cls: "mb-section-heading" });
      } else if (block.type === "poetry_stanza") {
        const blockEl = chapWrapper.createDiv({ cls: isParagraphMode ? "mb-poetry-stanza" : "mb-verse-line" });
        let prevVerse = null;

        block.lines.forEach(lineObj => {
          const verseEl = blockEl.createSpan({ cls: "verse", attr: { 'data-num': lineObj.verse } });
          if (startHighlight !== null && lineObj.verse >= startHighlight && lineObj.verse <= endHighlight) verseEl.classList.add("highlight-target");
          if (isVerseSelected(lineObj.verse)) verseEl.classList.add("active-verse");

          verseEl.createEl("sup", { text: lineObj.verse !== prevVerse ? lineObj.verse.toString() : "", cls: lineObj.verse !== prevVerse ? "vnum" : "vnum-spacer" });
          prevVerse = lineObj.verse;

          let formattedText = this.formatFootnotesAndMarkdown(lineObj.text, chapData, book, chNum);

          if (isParagraphMode) {
            const lineSpan = verseEl.createSpan({ cls: `vtext ${lineObj.indent > 0 ? "mb-poetic-indent" : "mb-poetic-line"}` });
            if (lineObj.indent > 0) lineSpan.style[isRTL ? 'paddingRight' : 'paddingLeft'] = `${lineObj.indent * 1.5}em`;
            lineSpan.innerHTML = formattedText.trim();
            verseEl.createSpan({ cls: "vspace", text: " " });
            blockEl.createEl("br");
          } else {
            verseEl.createSpan({ cls: "vtext" }).innerHTML = formattedText.trim();
            verseEl.createSpan({ cls: "vspace", text: " " });
          }

          verseEl.addEventListener("click", (evt) => toggleVerseSelection(evt, lineObj.verse));
        });
      } else if (block.type === "prose_paragraph") {
        const blockEl = chapWrapper.createEl(isParagraphMode ? "p" : "div", { cls: isParagraphMode ? "mb-prose-paragraph" : "mb-verse-line" });

        block.verses.forEach(vObj => {
          const verseEl = blockEl.createSpan({ cls: "verse", attr: { 'data-num': vObj.number } });
          if (startHighlight !== null && vObj.number >= startHighlight && vObj.number <= endHighlight) verseEl.classList.add("highlight-target");
          if (isVerseSelected(vObj.number)) verseEl.classList.add("active-verse");

          verseEl.createEl("sup", { text: vObj.number.toString(), cls: "vnum" });
          verseEl.createSpan({ cls: "vtext" }).innerHTML = this.formatFootnotesAndMarkdown(vObj.text, chapData, book, chNum).trim();
          verseEl.createSpan({ cls: "vspace", text: " " });

          if (!isParagraphMode) blockEl.createEl("br");
          verseEl.addEventListener("click", (evt) => toggleVerseSelection(evt, vObj.number));
        });
      }
    });
  }

  updateWindowing(activeChStr, container, level) {
      const context = this.bookContexts[level];
      if (!context) return;
      
      const active = parseInt(activeChStr, 10);
      const windowRange = [active-2, active-1, active, active+1, active+2];
      
      container.querySelectorAll('.mb-chapter-wrapper').forEach(el => {
          const ch = parseInt(el.getAttribute('data-chapter'), 10);
          if (windowRange.includes(ch)) {
              if (el.classList.contains('dehydrated') || el.innerHTML === '') {
                  const oldHeight = el.getBoundingClientRect().height;
                  el.classList.remove('dehydrated');
                  el.style.height = 'auto';
                  el.innerHTML = '';
                  this.hydrateChapter(el, context.data.chapters[ch], context.book, ch, context.highlightChapter, context.highlightVerse, context.isRTL);
                  
                  const newHeight = el.getBoundingClientRect().height;
                  if (ch < active && container) {
                      container.scrollTop += (newHeight - oldHeight);
                  }
              }
          } else if (!el.classList.contains('dehydrated')) {
              el.style.height = `${el.getBoundingClientRect().height}px`;
              el.innerHTML = '';
              el.classList.add('dehydrated');
          }
      });
  }

  async renderBookIntoContainer(book, translation, container, scrollChapter, scrollVerse, highlightChapter, highlightVerse, level) {
      container.empty();
      const payload = await this.fetchBookData(translation, book);
      if (!payload) {
          container.createEl("p", { text: "Could not load book data." });
          return;
      }

      const { data, isRTL } = payload;
      const chapters = Object.keys(data.chapters).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

      this.bookContexts[level] = { data, book, highlightChapter, highlightVerse, isRTL };
      const readerContainer = container.createDiv({ cls: `reader-container ${isRTL ? 'is-rtl' : ''}` });
      
      const observer = new IntersectionObserver((entries) => {
          let activeCh = null;
          entries.forEach(entry => { if (entry.isIntersecting) activeCh = entry.target.getAttribute("data-chapter"); });
          if (activeCh) {
              if (level === 0) {
                  this.activeChapter = activeCh;
                  this.updateHeaderUI();
                  this.updateWindowing(activeCh, readerContainer, level);
              } else {
                  const paneObj = this.crPanes[level - 1];
                  if (paneObj && paneObj.titleEl) {
                      paneObj.titleEl.innerText = `${book} ${activeCh} (${paneObj.translation})`;
                      paneObj.activeChapter = activeCh;
                      this.updateWindowing(activeCh, paneObj.contentEl, level);
                  }
              }
          }
      }, { root: container, rootMargin: "-20% 0px -75% 0px" });

      if (level > 0 && this.crPanes[level - 1]) this.crPanes[level - 1].observer = observer;
      else this.chapterObserver = observer;

      readerContainer.style.opacity = "0";
      chapters.forEach(chNum => {
          const chapWrapper = readerContainer.createDiv({ cls: "mb-chapter-wrapper dehydrated", attr: { 'data-chapter': chNum } });
          chapWrapper.style.height = "1500px";
          observer.observe(chapWrapper);
      });

      this.setupTooltipDelegation(container, level);
      const targetCh = scrollChapter || "1";

      this.scrollToVerse(readerContainer, targetCh, scrollVerse, "center", level);
      setTimeout(() => { readerContainer.style.opacity = "1"; }, 50);
  }

  setupResizer(resizerEl, paneWrapper) {
      let isResizing = false, startY = 0, startHeight = 0;
      const activeDoc = resizerEl.ownerDocument;
      const getClientY = (e) => (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;

      const onStart = (e) => {
          isResizing = true;
          startY = getClientY(e);
          startHeight = paneWrapper.getBoundingClientRect().height;
          activeDoc.body.style.cursor = "row-resize";
          if (e.cancelable) e.preventDefault();
      };

      const onMove = (e) => {
          if (!isResizing) return;
          const dy = startY - getClientY(e);
          const newHeight = startHeight + dy;
          const containerHeight = this.contentEl.getBoundingClientRect().height;
          if (newHeight > 60) paneWrapper.style.height = (newHeight >= containerHeight - 10) ? "100%" : `${newHeight}px`;
          if (e.cancelable) e.preventDefault();
      };

      const onEnd = () => {
          if (!isResizing) return;
          isResizing = false;
          activeDoc.body.style.cursor = "";
          activeDoc.removeEventListener("mousemove", onMove);
          activeDoc.removeEventListener("mouseup", onEnd);
          activeDoc.removeEventListener("touchmove", onMove);
          activeDoc.removeEventListener("touchend", onEnd);
      };

      resizerEl.addEventListener("mousedown", (e) => { onStart(e); activeDoc.addEventListener("mousemove", onMove); activeDoc.addEventListener("mouseup", onEnd); });
      resizerEl.addEventListener("touchstart", (e) => { onStart(e); activeDoc.addEventListener("touchmove", onMove, { passive: false }); activeDoc.addEventListener("touchend", onEnd); }, { passive: false });
  }

  closeCrossrefPanesFrom(level) {
      while (this.crPanes.length >= level) {
          const popped = this.crPanes.pop();
          if (popped.paneWrapper) popped.paneWrapper.remove();
          if (popped.observer) popped.observer.disconnect();
          delete this.bookContexts[popped.level];
      }
  }

  async openCrossrefPane(book, chapter, verse, sourceLevel) {
      const newLevel = sourceLevel + 1;
      this.closeCrossrefPanesFrom(newLevel);

      const paneWrapper = this.contentEl.createDiv({ cls: "mb-pane-wrapper" });
      paneWrapper.style.height = "45%";
      paneWrapper.style.zIndex = `${100 + newLevel}`;

      const resizerEl = paneWrapper.createDiv({ cls: "mb-resizer" });
      const paneEl = paneWrapper.createDiv({ cls: "crossref-pane" });
      const crHeader = paneEl.createDiv({ cls: "crossref-header" });
      const titleGroup = crHeader.createDiv({ cls: "cr-title-group" });
      
      const closeBtn = titleGroup.createEl("button", { cls: "crossref-close-btn", title: "Close Reference" });
      closeBtn.innerHTML = `✕`;
      closeBtn.addEventListener("click", () => this.closeCrossrefPanesFrom(newLevel));
      
      let defaultTrans = (sourceLevel > 0) ? this.crPanes[sourceLevel - 1].translation : this.currentTranslation;
      const titleEl = titleGroup.createEl("div", { cls: "crossref-title", text: `${book} ${chapter} (${defaultTrans})` });

      const returnBtn = titleGroup.createEl("button", { cls: "crossref-return-btn", title: "Recenter on Target Verse" });
      returnBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>`;

      const transBtn = titleGroup.createEl("button", { cls: "crossref-trans-btn", title: "Change Translation" });
      obsidian.setIcon(transBtn, "languages");

      const contentEl = paneEl.createDiv({ cls: "crossref-content bible-wrapper", attr: { 'data-level': newLevel } });
      if (!this.settings.showFootnoteMarkers) contentEl.classList.add("hide-footnotes");

      const paneObj = { level: newLevel, book, translation: defaultTrans, activeChapter: chapter, targetChapter: chapter, targetVerse: verse, paneWrapper, paneEl, resizerEl, titleEl, contentEl, observer: null };
      this.crPanes.push(paneObj);

      transBtn.addEventListener("click", (e) => {
        this.showTranslationMenu(e, (newTrans) => {
          paneObj.translation = newTrans;
          const center = this.getCenterVerse(paneObj.contentEl);
          this.renderBookIntoContainer(paneObj.book, paneObj.translation, paneObj.contentEl, center ? center.chapter : paneObj.activeChapter, center ? center.verse : null, paneObj.targetChapter, paneObj.targetVerse, newLevel);
        });
      });

      this.setupResizer(resizerEl, paneWrapper);
      returnBtn.addEventListener("click", () => this.scrollToVerse(paneObj.contentEl, paneObj.targetChapter, paneObj.targetVerse, "center", newLevel));

      await this.renderBookIntoContainer(book, defaultTrans, contentEl, chapter, verse, chapter, verse, newLevel);
  }

  showTooltip(marker, container, level) {
      this.cancelHideTooltip();
      if (this.activeTooltip && this.activeTooltip.dataset.marker === marker.dataset.key) return;

      if (this.activeTooltip) {
        this.activeTooltip.remove();
        this.activeTooltip = null;
      }

      const rawFnText = decodeURIComponent(marker.getAttribute("data-fn") || "");
      if (!rawFnText) return;

      let contextBook = marker.getAttribute("data-book") || this.activeBook;
      let contextChapter = marker.getAttribute("data-chapter") || this.activeChapter;
      if (level > 0 && this.crPanes[level - 1]) {
        contextBook = marker.getAttribute("data-book") || this.crPanes[level - 1].book;
        contextChapter = marker.getAttribute("data-chapter") || this.crPanes[level - 1].activeChapter;
      }

      const tooltip = this.contentEl.createDiv({ cls: "mb-floating-tooltip" });
      tooltip.dataset.marker = marker.dataset.key;
      tooltip.innerHTML = this.parseFnMarkdown(rawFnText, contextBook, contextChapter);
      this.activeTooltip = tooltip;

      tooltip.addEventListener("mouseenter", () => this.cancelHideTooltip());
      tooltip.addEventListener("mouseleave", () => this.scheduleHideTooltip());

      tooltip.addEventListener("click", (evt) => {
        evt.stopPropagation();
        const link = evt.target.closest(".mb-crossref-link");
        if (link) {
          if (this.activeTooltip) { this.activeTooltip.remove(); this.activeTooltip = null; }
          this.openCrossrefPane(link.getAttribute("data-book"), link.getAttribute("data-chapter"), link.getAttribute("data-verse"), level);
          return;
        }

        navigator.clipboard.writeText(rawFnText.replace(/[*_]/g, "").replace(/[\[\]]/g, ""));
        this.plugin.setClipboardClearTimer(30000);
        new obsidian.Notice("Copied footnote to clipboard.");
      });

      const markerRect = marker.getBoundingClientRect();
      const containerRect = this.contentEl.getBoundingClientRect();
      tooltip.style.maxWidth = `${Math.min(280, containerRect.width - 20)}px`;

      const tooltipRect = tooltip.getBoundingClientRect();
      let left = (markerRect.left - containerRect.left) + (markerRect.width / 2) - (tooltipRect.width / 2);
      left = Math.max(10, Math.min(left, containerRect.width - tooltipRect.width - 10));

      let top = (markerRect.top - containerRect.top) - tooltipRect.height - 6;
      if (top < 10) top = (markerRect.bottom - containerRect.top) + 6;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
  }

  scheduleHideTooltip() {
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = setTimeout(() => {
        if (this.activeTooltip) { this.activeTooltip.remove(); this.activeTooltip = null; }
      }, 400);
  }

  cancelHideTooltip() {
      if (this.tooltipTimeout) { clearTimeout(this.tooltipTimeout); this.tooltipTimeout = null; }
  }

  setupTooltipDelegation(container, level) {
    let currentHoverNum = null, currentHoverChap = null;

    container.addEventListener("click", (e) => {
      const link = e.target.closest(".mb-crossref-link");
      if (link) {
        e.stopPropagation();
        if (this.activeTooltip) { this.activeTooltip.remove(); this.activeTooltip = null; }
        this.openCrossrefPane(link.getAttribute("data-book"), link.getAttribute("data-chapter"), link.getAttribute("data-verse"), level);
        return;
      }

      const marker = e.target.closest(".mb-footnote-marker");
      if (marker) {
        e.stopPropagation();
        if (!this.activeTooltip || this.activeTooltip.dataset.marker !== marker.dataset.key) {
          this.showTooltip(marker, container, level);
        }
        return;
      }

      if (this.activeTooltip && !e.target.closest(".mb-floating-tooltip")) {
        this.activeTooltip.remove(); this.activeTooltip = null;
      }
    });

    container.addEventListener("mouseover", (e) => {
      const verseEl = e.target.closest(".verse");
      if (verseEl) {
        const num = verseEl.getAttribute("data-num");
        const chapWrapper = verseEl.closest(".mb-chapter-wrapper");
        if (chapWrapper && (currentHoverNum !== num || currentHoverChap !== chapWrapper)) {
          if (currentHoverChap) currentHoverChap.querySelectorAll(".verse-hover").forEach(el => el.classList.remove("verse-hover"));
          currentHoverNum = num; currentHoverChap = chapWrapper;
          chapWrapper.querySelectorAll(`.verse[data-num="${num}"]`).forEach(el => el.classList.add("verse-hover"));
        }
      }
      const marker = e.target.closest(".mb-footnote-marker");
      if (marker) this.showTooltip(marker, container, level);
    });

    container.addEventListener("mouseout", (e) => {
      const verseEl = e.target.closest(".verse");
      if (verseEl && currentHoverChap) {
        const related = e.relatedTarget ? e.relatedTarget.closest(".verse") : null;
        if (!related || related.getAttribute("data-num") !== currentHoverNum) {
          currentHoverChap.querySelectorAll(".verse-hover").forEach(el => el.classList.remove("verse-hover"));
          currentHoverNum = null; currentHoverChap = null;
        }
      }
      const marker = e.target.closest(".mb-footnote-marker");
      if (marker) this.scheduleHideTooltip();
    });
  }

  async renderView() {
    this.contentEl.empty();
    this.crPanes = [];
    
    this.contentEl.style.display = "flex";
    this.contentEl.style.flexDirection = "column";
    this.contentEl.style.overflow = "hidden";
    this.contentEl.style.padding = "0";
    this.contentEl.style.position = "relative"; 

    this.containerEl.classList.add("mb-native-integration");
    this.updateHeaderUI();
    
    this.layoutContainer = this.contentEl.createDiv({ cls: "main-layout-container" });
    const wrapperClasses = ["bible-wrapper", "main-bible-wrapper"];
    if (!this.settings.showFootnoteMarkers) wrapperClasses.push("hide-footnotes");
    
    const wrapper = this.layoutContainer.createDiv({ cls: wrapperClasses.join(" "), attr: { 'data-level': "0" } });

    if (this.chapterObserver) this.chapterObserver.disconnect();

    if (this.viewMode === "dashboard") {
      this.renderDashboard(wrapper);
    } else if (this.viewMode === "chapters") {
      await this.renderChapterSelector(wrapper);
    } else if (this.viewMode === "reader") {
      await this.renderBookIntoContainer(this.activeBook, this.currentTranslation, wrapper, this.targetScrollChapter, this.targetScrollVerse, null, null, 0);
      this.targetScrollChapter = null;
      this.targetScrollVerse = null;
    }
  }

  renderDashboard(wrapper) {
    const chapterContainer = wrapper.createDiv({ cls: "chapter-container" });
    chapterContainer.createEl("h4", { text: "Old Testament", cls: "book-divider" });
    for (let idx = 0; idx < 39; idx++) {
      const book = CANONICAL_BOOKS[idx];
      chapterContainer.createEl("button", { text: book, cls: "chapter-button" }).addEventListener("click", async () => {
        const state = this.getState();
        state.viewMode = "chapters"; state.activeBook = book;
        await this.leaf.setViewState({ type: VIEW_TYPE, state }, { history: true });
      });
    }

    chapterContainer.createEl("hr", { cls: "book-divider" });
    chapterContainer.createEl("h4", { text: "New Testament", cls: "book-divider" });
    for (let idx = 39; idx < CANONICAL_BOOKS.length; idx++) {
      const book = CANONICAL_BOOKS[idx];
      chapterContainer.createEl("button", { text: book, cls: "chapter-button" }).addEventListener("click", async () => {
        const state = this.getState();
        state.viewMode = "chapters"; state.activeBook = book;
        await this.leaf.setViewState({ type: VIEW_TYPE, state }, { history: true });
      });
    }
  }

  async renderChapterSelector(wrapper) {
    const payload = await this.fetchBookData(this.currentTranslation, this.activeBook);
    if (!payload) {
      wrapper.createEl("p", { text: "Could not load book data." });
      return;
    }
    
    const chapterContainer = wrapper.createDiv({ cls: "chapter-container" });
    Object.keys(payload.data.chapters).forEach(ch => {
      chapterContainer.createEl("button", { text: ch, cls: "chapter-button" }).addEventListener("click", async () => {
        const state = this.getState();
        state.viewMode = "reader"; state.activeChapter = ch; state.targetScrollChapter = ch;
        this.selectedVerses = [];
        await this.leaf.setViewState({ type: VIEW_TYPE, state }, { history: true });
      });
    });
  }

  cleanVerseText(str) {
    return str ? str.replace(/\[\^?[a-zA-Z0-9_\-]+\]/g, "").replace(/\s+/g, " ").trim() : "";
  }

  handleMultiVerseCopy(book, chapter, verseNum, rawText, isAdding) {
    if (isAdding) {
      this.selectedVerses.push({ book, chapter: parseInt(chapter, 10), num: parseInt(verseNum, 10), text: rawText });
    } else {
      this.selectedVerses = this.selectedVerses.filter(v => !(v.book === book && v.chapter === parseInt(chapter, 10) && v.num === parseInt(verseNum, 10)));
    }

    if (this.selectedVerses.length === 0) return;
    this.selectedVerses.sort((a, b) => (a.chapter !== b.chapter) ? a.chapter - b.chapter : a.num - b.num);

    const { referenceTemplate, copyFormat } = this.settings;
    const grouped = {};
    this.selectedVerses.forEach(v => {
      if (!grouped[v.chapter]) grouped[v.chapter] = [];
      grouped[v.chapter].push(v);
    });

    let output = "";
    Object.keys(grouped).forEach(ch => {
        const verses = grouped[ch];
        const uniqueVerses = [];
        verses.forEach(v => {
          const existing = uniqueVerses.find(uv => uv.num === v.num);
          if (existing) existing.text += " " + v.text;
          else uniqueVerses.push({ ...v });
        });

        let ranges = [], rangeStart = uniqueVerses[0].num, prevNum = rangeStart;
        for (let i = 1; i < uniqueVerses.length; i++) {
            let currNum = uniqueVerses[i].num;
            if (currNum === prevNum + 1) prevNum = currNum;
            else {
                ranges.push(rangeStart === prevNum ? `${rangeStart}` : `${rangeStart}-${prevNum}`);
                rangeStart = currNum; prevNum = currNum;
            }
        }
        ranges.push(rangeStart === prevNum ? `${rangeStart}` : `${rangeStart}-${prevNum}`);

        let refString = referenceTemplate.replace("{book}", book).replace("{chapter}", ch).replace("{verses}", ranges.join(", "));

        const formatMap = {
          "callout-open": `> [!quote]+ ${refString}\n`,
          "callout-closed": `> [!quote]- ${refString}\n`,
          "foldable-callout": `> [!quote]- ${refString}\n`,
          "callout": `> [!quote] ${refString}\n`
        };

        const prefix = formatMap[copyFormat] || `${refString}\n`;
        const linePrefix = copyFormat.startsWith("callout") ? "> " : "";
        
        output += prefix;
        uniqueVerses.forEach(v => {
          output += `${linePrefix}${this.convertToSuperscript(v.num)} ${this.cleanVerseText(v.text)}\n`;
        });
        output += `\n`;
    });

    navigator.clipboard.writeText(output.trim());
    this.plugin.setClipboardClearTimer(30000);
    if (this.selectedVerses.length === 1 && isAdding) new obsidian.Notice(`Copied reference to clipboard.`);
  }

  convertToSuperscript(number) {
    const map = { "0": "\u2070", "1": "\xB9", "2": "\xB2", "3": "\xB3", "4": "\u2074", "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079" };
    return String(number).split("").map(d => map[d] || d).join("");
  }
}

class BibleSidecarSettingsTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.availableTranslations = [];
  }
  
  async getAvailableTranslations() {
    const adapter = this.app.vault.adapter;
    const biblesDir = await this.plugin.getBiblesDirectory();
    let translations = [];
    if (await adapter.exists(biblesDir)) {
      const folders = await adapter.list(biblesDir);
      for (const folder of folders.folders) translations.push(folder.split("/").pop());
    }
    const hasHebrew = translations.some(t => ["wlc", "hebrew"].includes(t.toLowerCase()));
    const hasGreek = translations.some(t => ["sblgnt", "greek"].includes(t.toLowerCase()));
    translations = translations.filter(t => !["wlc", "sblgnt", "hebrew", "greek"].includes(t.toLowerCase()));
    if (hasHebrew && hasGreek) translations.unshift("Hebrew / Greek");
    return translations;
  }

  async display() {
    const { containerEl } = this;
    containerEl.empty();
    this.availableTranslations = await this.getAvailableTranslations();

    new obsidian.Setting(containerEl)
      .setName("Default Translation")
      .setDesc("The translation that loads when you first open the sidecar.")
      .addDropdown(dd => {
        this.availableTranslations.forEach(t => dd.addOption(t, t));
        dd.setValue(this.plugin.settings.bibleVersion);
        dd.onChange(async (val) => { this.plugin.settings.bibleVersion = val; await this.plugin.saveSettings(); });
      });

    new obsidian.Setting(containerEl)
      .setName("Reference Format Template")
      .setDesc("Available variables: {book}, {chapter}, {verses}. Example: [[{book} {chapter}]]:{verses}")
      .addText(text => text.setValue(this.plugin.settings.referenceTemplate)
        .onChange(async (val) => { this.plugin.settings.referenceTemplate = val; await this.plugin.saveSettings(); })
      );

    new obsidian.Setting(containerEl)
      .setName("Copy Style")
      .addDropdown(dd => {
        dd.addOption("plain", "Plain Text");
        dd.addOption("callout", "Standard Callout ([!quote])");
        dd.addOption("callout-open", "Collapsible Callout - Open ([!quote]+)");
        dd.addOption("callout-closed", "Collapsible Callout - Closed ([!quote]-)");
        dd.setValue(this.plugin.settings.copyFormat);
        dd.onChange(async (val) => { this.plugin.settings.copyFormat = val; await this.plugin.saveSettings(); });
      });

    new obsidian.Setting(containerEl)
      .setName("Show Footnotes")
      .setDesc("Display inline footnote markers (e.g., [a]) in the text.")
      .addToggle(t => t.setValue(this.plugin.settings.showFootnoteMarkers)
        .onChange(async (val) => { this.plugin.settings.showFootnoteMarkers = val; await this.plugin.saveSettings(); })
      );
      
    new obsidian.Setting(containerEl)
      .setName("Show Headings")
      .setDesc("Display section headings within the biblical text.")
      .addToggle(t => t.setValue(this.plugin.settings.showHeadings)
        .onChange(async (val) => { this.plugin.settings.showHeadings = val; await this.plugin.saveSettings(); })
      );

    new obsidian.Setting(containerEl)
      .setName("Show Paragraphs")
      .setDesc("Format text with paragraph breaks instead of a single block.")
      .addToggle(t => t.setValue(this.plugin.settings.showParagraphs)
        .onChange(async (val) => { this.plugin.settings.showParagraphs = val; await this.plugin.saveSettings(); })
      );
  }
}

module.exports = BibleSidecarPlugin;