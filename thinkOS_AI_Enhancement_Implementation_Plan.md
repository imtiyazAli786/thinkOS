# thinkOS — AI Enhancement + File Extraction Implementation Plan

> **For the executing model:** This plan is written to be fully self-contained. You are working on a single-file app at `/Users/personal/Documents/WebApplications/thinkOS/thinkOS.html` (~36,000 lines). The AI section starts around line 14,480 (HTML drawer) and lines 22,700–25,600 (JavaScript logic). All state is in a global `state` object. AI state variables: `aiBusy`, `aiChatTurns`, `askNotesTurns`, `aiAbortController`, `aiPopoverOpen`. Key functions: `getActiveAiProvider()`, `getAiApiKey(provider)`, `getAiModel(provider)`, `_streamWriteResponse(prompt, contextItems)`, `submitAiQuery()`, `askYourNotes()`, `buildAskNotesPrompt()`, `getRelevantNotes()`, `toggleAiPopover()`, `toggleAiPopoverFullscreen()`. Notes are stored in `state.notes[]` — each note has `{id, title, tags[], blocks[], updatedAt, createdAt, archived}`. Blocks have `{id, type, content}`.

---

## Background

thinkOS is a 1.3MB single HTML file (~36,000 lines). The AI drawer section alone spans ~3,000 lines of HTML + CSS + JavaScript, making the file unwieldy. This plan covers two parallel goals:

1. **Extract AI code into a dedicated `thinkos-ai.js` file** to reduce the main file size and allow independent iteration
2. **Implement 7 high-impact missing AI features** that unlock real power for note-taking workflows

---

## Part 1 — File Extraction: Create `thinkos-ai.js`

### Why Extract?

| Problem | Impact |
|---|---|
| Main file is 1.3MB / 36K lines | Editor lag, hard to navigate |
| AI CSS is scattered across 6+ locations | Hard to maintain |
| AI JS spans lines 22,700–25,600+ | Hard to diff, test, or rewrite |
| Mixing concerns | Bug fixes require full-file reload |

### Extraction Strategy

> **Critical:** All functions currently live in a `<script>` tag inside the HTML. They rely on global variables (`state`, `aiBusy`, etc.) defined in the same script scope. The extracted file must be loaded **after** the main script tag using `defer` so it shares the same global scope.

#### Step 1 — Create `/Users/personal/Documents/WebApplications/thinkOS/thinkos-ai.js`

Move the following JS blocks from `thinkOS.html` into `thinkos-ai.js` (preserve exact function signatures):

**Functions to extract (search these names in thinkOS.html):**

```
// Provider & Config
getActiveAiProvider()
getAiApiKey(provider)
getAiModel(provider)
getAiBaseUrl(provider)
onAiProviderChange()
saveApiKeyLocally()
clearApiKeyLocally()
changeAiModelTop(value)
encodeKey(k) / decodeKey(k)

// Drawer UI
toggleAiPopover(open)
toggleAiPopoverFullscreen()
switchAiDrawerTab(tab)
toggleAiSettingsPanel()
clearAiChat()
updateAiContextBadge()

// Chat Bubbles
appendWriteChatBubble(role, content)
appendAskChatBubble(role, content)
insertAiBubbleToNote(btn)
copyAiBubbleText(btn)

// Query execution
executeAiDrawerAction()
submitAiQuery()
askYourNotes()
buildAskQueryWithHistory(userText)
buildAskNotesPrompt(query, relevantNotes, historyTurns)
_streamWriteResponse(prompt, contextItems)
abortAiGeneration()
regenerateLastAiResponse()

// Note retrieval
extractKeywords(text)
getRelevantNotes(query, notes, limit)
findRelevantNotes(text, notes, limit)
getNotePlainText(note)

// Inline AI (existing)
thinkingGenerateWithAi()
thinkingContinueWriting()
thinkingDraftEmail()
generateStickyEmail()

// Formatting
formatAskResponse(text)
callAiEndpoint(endpoint, payload, onChunk)
```

**State variables to keep in `thinkOS.html`** (must remain global for both files):
```js
let aiBusy = false;
let aiAbortController = null;
let lastAiWritePrompt = null;
let lastAiWriteContextItems = [];
const AI_CHAT_MAX_TURNS = 8;
let aiChatTurns = [];
let askNotesTurns = [];
let aiDrawerOpen = false;
let aiPopoverOpen = false;
let activeAiDrawerTab = 'write';
```

> These must **stay in thinkOS.html** (before the `thinkos-ai.js` `<script>` tag) so they are initialized first.

#### Step 2 — Add Script Tag in `thinkOS.html`

Find the closing `</body>` tag and add **before it**:
```html
<script src="thinkos-ai.js" defer></script>
```

> Place it **after** the main `<script>` block so global state is already defined.

#### Step 3 — Move AI CSS into `thinkos-ai.css`

Create `/Users/personal/Documents/WebApplications/thinkOS/thinkos-ai.css` and move all CSS blocks that start with `#aiPopover`, `.ai-drawer-*`, `.ai-bubble-container`, `.ai-response-content`, `.ai-shortcut-chip`, `.ai-shortcuts-guide`, `.ai-popover-fullscreen`, `body.ai-fullscreen-mode`, `.ai-cursor-blink`.

In `thinkOS.html` `<head>`, add:
```html
<link rel="stylesheet" href="thinkos-ai.css">
```

#### Step 4 — Extract AI HTML Drawer

The entire `<div id="aiPopover">` block (currently around line 14,480–14,736) can be moved into a separate HTML template string inside `thinkos-ai.js` and injected via:

```js
// In thinkos-ai.js, at the bottom:
document.addEventListener('DOMContentLoaded', () => {
  const aiDrawerHtml = `...full aiPopover HTML...`;
  document.body.insertAdjacentHTML('beforeend', aiDrawerHtml);
  // Re-run icon init
  if (window.lucide) window.lucide.createIcons();
  initAiDrawer(); // new init function
});
```

#### Verification After Extraction
- Open thinkOS.html in browser — AI drawer should open/close with ⌘J
- Test Write & Think tab — streaming response should work
- Test Ask Your Notes tab — citations should be clickable
- Test fullscreen expand — should cover full page
- Test Insert to Note — should strip thinking block

---

## Part 2 — High-Impact AI Feature Implementations

---

### Feature 1: Dynamic Context-Aware Prompt Chips

**What:** Replace the 3 hardcoded prompt chips with AI-generated, context-aware chips based on the currently open note and recent activity.

**Where:** `thinkos-ai.js` — `switchAiDrawerTab()` and `toggleAiPopover()` functions.

**Implementation:**

```js
// New function: generateContextChips()
function generateContextChips() {
  const activeNote = findStickyById(expandedStickyId || selectedStickyId);
  const chips = [];

  if (activeNote) {
    const title = activeNote.title || 'this note';
    // Context-specific chips
    chips.push(`Summarize "${title}" in 5 bullet points`);
    chips.push(`What are the action items in "${title}"?`);
    chips.push(`Improve the writing quality of "${title}"`);
    chips.push(`Generate follow-up questions from "${title}"`);
    // Check for todos in blocks
    const hasTodos = (activeNote.blocks || []).some(b => b.type === 'todo');
    if (hasTodos) chips.push(`Which tasks in "${title}" are incomplete?`);
  } else {
    // Global chips when no note open
    chips.push(`What did I work on this week?`);
    chips.push(`List all my incomplete todos across notes`);
    chips.push(`Find notes related to [topic]`);
    chips.push(`Summarize my most recent meeting notes`);
    chips.push(`What are my main themes and projects?`);
  }
  return chips.slice(0, 4); // Max 4 chips
}

// Call generateContextChips() when:
// 1. AI drawer opens (toggleAiPopover)
// 2. Tab switches (switchAiDrawerTab)
// 3. A note is opened/selected (hook into openNoteEditor)
```

**HTML structure for chips container:**
- Each tab's welcome screen has a `<div class="ai-chip-row">` 
- Clear and re-render chips when context changes
- Chips for "Ask Your Notes" tab pull from `state.notes` tags/titles

---

### Feature 2: `/ai` Inline Editor Command

**What:** When user types `/ai` in a note block, show an inline AI popup where they can type a command. AI replaces/inserts content directly into the block.

**Where:** Block editor keydown handler (around line 19,000 in thinkOS.html) + new function in `thinkos-ai.js`.

**Implementation:**

```js
// In block keydown handler, add:
if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
  // After short debounce, check if content is "/ai"
  setTimeout(() => {
    const el = document.activeElement;
    if (el && el.textContent.trim() === '/ai') {
      e.preventDefault();
      el.textContent = ''; // Clear the /ai
      showInlineAiPopup(el, note, block);
    }
  }, 0);
}

// New function:
function showInlineAiPopup(anchorEl, note, block) {
  // Remove any existing inline AI popup
  document.getElementById('inlineAiPopup')?.remove();
  
  const rect = anchorEl.getBoundingClientRect();
  const popup = document.createElement('div');
  popup.id = 'inlineAiPopup';
  popup.innerHTML = `
    <div class="inline-ai-popup">
      <div class="inline-ai-header">
        <i data-lucide="sparkles"></i>
        <span>AI Command</span>
      </div>
      <div class="inline-ai-chips">
        <button onclick="runInlineAi('Continue writing', '${block.id}', '${note.id}')">✏️ Continue writing</button>
        <button onclick="runInlineAi('Fix grammar and spelling', '${block.id}', '${note.id}')">✅ Fix grammar</button>
        <button onclick="runInlineAi('Make it more concise', '${block.id}', '${note.id}')">✂️ Make concise</button>
        <button onclick="runInlineAi('Make it more formal', '${block.id}', '${note.id}')">👔 More formal</button>
        <button onclick="runInlineAi('Translate to English', '${block.id}', '${note.id}')">🌐 Translate</button>
      </div>
      <div class="inline-ai-input-row">
        <input id="inlineAiInput" placeholder="Or type a custom instruction..." />
        <button onclick="runInlineAiCustom('${block.id}', '${note.id}')">→</button>
      </div>
    </div>
  `;
  popup.style.cssText = `position:fixed; top:${rect.bottom + 8}px; left:${rect.left}px; z-index:99999;`;
  document.body.appendChild(popup);
  document.getElementById('inlineAiInput').focus();
  
  // Close on outside click
  setTimeout(() => document.addEventListener('click', closeInlineAiPopup, { once: true }), 100);
}

// runInlineAi(instruction, blockId, noteId):
// 1. Find the block by ID in the note
// 2. Get surrounding context (previous 2 blocks as context)
// 3. Build prompt: "Given this note context: [prev blocks]\nBlock content: [block text]\nInstruction: [instruction]\nRespond with only the replacement text."
// 4. Stream response into block content directly
// 5. Call renderBlockEditor(note) + craftSave() when done
```

**CSS needed** (add to `thinkos-ai.css`):
```css
.inline-ai-popup {
  background: var(--card);
  border: 1px solid var(--accent-border);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  min-width: 320px;
}
```

---

### Feature 3: Smart Note Summarization on Open

**What:** When a note is opened in the editor panel, if it has more than 300 words, show a subtle "AI Summary" chip at the top of the note. Clicking it expands a collapsible AI-generated summary.

**Where:** `openNoteEditor()` function + new function in `thinkos-ai.js`.

**Implementation:**

```js
// Hook into openNoteEditor() — after the note editor renders, call:
function maybeShowNoteSummary(note) {
  const wordCount = getNotePlainText(note).split(/\s+/).filter(Boolean).length;
  if (wordCount < 300) return; // Only for longer notes
  
  const summaryBar = document.getElementById('noteSummaryBar');
  if (!summaryBar) return;
  
  summaryBar.innerHTML = `
    <button class="note-summary-trigger" onclick="generateNoteSummary('${note.id}')">
      <i data-lucide="sparkles"></i>
      AI Summary <span class="note-word-count">${wordCount} words</span>
    </button>
  `;
  summaryBar.classList.remove('hidden');
}

async function generateNoteSummary(noteId) {
  const note = findStickyById(noteId);
  if (!note || aiBusy) return;
  
  const btn = document.querySelector('.note-summary-trigger');
  if (btn) btn.textContent = 'Generating summary...';
  
  const text = getNotePlainText(note);
  const prompt = `Summarize this note in 3 concise bullet points. Be specific, not generic. Note title: "${note.title}"\n\nContent:\n${text.slice(0, 3000)}\n\nRespond with exactly 3 bullet points using "•" character. No intro text.`;
  
  // Use existing streaming infrastructure
  // Inject summary into a collapsible above the note title
}
```

**HTML:** Add `<div id="noteSummaryBar" class="hidden"></div>` just above the sticky panel title input (around line ~14,150).

---

### Feature 4: Daily Digest Panel (in Fullscreen Mode)

**What:** In the expanded fullscreen AI view, add a third tab "Daily Digest" that shows an AI-generated summary of: notes edited today, open todos, and key themes. Refreshes once per session.

**Where:** AI drawer HTML + `thinkos-ai.js`.

**New Tab HTML** (add after "Ask Your Notes" tab button):
```html
<button id="aiTabDigest" class="ai-drawer-tab" onclick="switchAiDrawerTab('digest')">
  Daily Digest
</button>
```

**New Panel HTML:**
```html
<div id="aiDigestPanel" style="display:none; flex-direction:column; flex:1; min-height:0; overflow-y:auto; padding:24px;">
  <div id="aiDigestContent">
    <button onclick="generateDailyDigest()" class="digest-generate-btn">
      ✨ Generate Today's Digest
    </button>
  </div>
</div>
```

**Implementation:**
```js
async function generateDailyDigest() {
  if (aiBusy) return;
  
  const today = new Date();
  const todayStr = today.toDateString();
  
  // Find notes modified today
  const todayNotes = (state.notes || []).filter(n => {
    const d = new Date(n.updatedAt || n.createdAt);
    return d.toDateString() === todayStr && !n.archived;
  });
  
  // Find all incomplete todos across all notes
  const allTodos = [];
  (state.notes || []).filter(n => !n.archived).forEach(n => {
    (n.blocks || []).forEach(b => {
      if (b.type === 'todo' && !b.checked) {
        allTodos.push({ noteTitle: n.title || 'Untitled', task: getPlainTextContent(b.content) });
      }
    });
  });
  
  // Get recent notes for context (last 7 days)
  const recentNotes = [...(state.notes || [])]
    .filter(n => !n.archived)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 8);
  
  const notesContext = recentNotes.map(n => 
    `${n.title}: ${getNotePlainText(n).slice(0, 200)}`
  ).join('\n\n');
  
  const prompt = `You are analyzing a user's notes app. Today is ${todayStr}.

Notes modified today: ${todayNotes.map(n => n.title).join(', ') || 'None'}

Open todos (${allTodos.length} total): ${allTodos.slice(0,10).map(t => `• ${t.task} (from "${t.noteTitle}")`).join('\n')}

Recent note context:
${notesContext}

Generate a personal daily digest with these sections (use markdown):
## 📅 Today's Activity
(What they worked on today)

## ✅ Open Tasks  
(Top 5 most important-looking incomplete todos)

## 💡 Key Themes
(2-3 dominant themes/topics across recent notes)

## 🎯 Suggested Next Action
(One concrete suggestion based on their notes)

Be personal, specific, and concise.`;

  await _streamWriteResponse(prompt, [], 'digest'); // new 3rd param for target panel
}
```

---

### Feature 5: Smarter Note Retrieval (Expanded Limit + Recency Boost)

**What:** Improve `getRelevantNotes()` with TF-IDF-style scoring, recency boost, and raise the limit from 5 to 10 notes for Ask Your Notes queries.

**Where:** Replace `getRelevantNotes()` in `thinkos-ai.js`.

**New Implementation:**

```js
function getRelevantNotes(query, notes, limit = 10) { // raised from 5 to 10
  const kws = extractKeywords(query);
  const now = Date.now();
  const ONE_DAY = 86400000;
  
  if (kws.length === 0) {
    // Return most recently modified
    return [...notes]
      .filter(n => !n.archived)
      .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
      .slice(0, limit);
  }
  
  const scored = notes
    .filter(n => !n.archived)
    .map(n => {
      const title = (n.title || '').toLowerCase();
      const tags = (n.tags || []).join(' ').toLowerCase();
      const body = n.blocks 
        ? n.blocks.map(b => getPlainTextContent(b.content || '')).join(' ').toLowerCase()
        : '';
      
      let score = 0;
      const bodyWords = body.split(/\s+/).length || 1;
      
      kws.forEach(kw => {
        // Title match is very high value
        if (title === kw) score += 30;
        else if (title.includes(kw)) score += 15;
        // Tag match
        if (tags.includes(kw)) score += 8;
        // TF (term frequency in body)
        const bodyMatches = (body.match(new RegExp(kw, 'g')) || []).length;
        score += Math.min(bodyMatches * 2 / bodyWords * 100, 10); // TF-capped at 10
      });
      
      // Recency boost: notes modified within 7 days get a bonus
      const ageMs = now - (n.updatedAt || n.createdAt || 0);
      const ageDays = ageMs / ONE_DAY;
      if (ageDays < 1) score += 5;
      else if (ageDays < 7) score += 3;
      else if (ageDays < 30) score += 1;
      
      return { note: n, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  if (scored.length === 0) {
    return [...notes]
      .filter(n => !n.archived)
      .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
      .slice(0, limit);
  }
  return scored.slice(0, limit).map(item => item.note);
}
```

Also update `buildAskNotesPrompt()` to include **note metadata** (created date, word count) to help AI prioritize:
```js
notesContext += `CREATED: ${new Date(n.createdAt).toLocaleDateString()}\n`;
notesContext += `LAST MODIFIED: ${new Date(n.updatedAt).toLocaleDateString()}\n`;
notesContext += `WORD COUNT: ${wordCount}\n`;
```

---

### Feature 6: Auto-Tag Suggestions After Note Edit

**What:** After a user saves/edits a note (debounced 5 seconds), silently run AI in the background to suggest up to 3 tags. Show a subtle chip strip below the note title: "Suggested tags: #meeting #Q3 #action-item — Add all / Dismiss".

**Where:** Hook into `craftSave()` + new function in `thinkos-ai.js`.

**Implementation:**

```js
let autoTagTimer = null;

// Call this from craftSave() when a note is modified:
function scheduleAutoTagSuggestion(noteId) {
  if (autoTagTimer) clearTimeout(autoTagTimer);
  autoTagTimer = setTimeout(() => suggestTagsForNote(noteId), 5000); // 5s debounce
}

async function suggestTagsForNote(noteId) {
  const note = findStickyById(noteId);
  if (!note || aiBusy) return;
  const text = getNotePlainText(note);
  if (text.split(/\s+/).length < 50) return; // Only for notes with some content
  
  const existingTags = (note.tags || []).join(', ');
  const prompt = `Suggest 1-3 concise tags for this note. Return ONLY the tags as a comma-separated list, no explanation, no # symbol.
Title: ${note.title || 'Untitled'}
Existing tags: ${existingTags || 'none'}
Content: ${text.slice(0, 1000)}
Tags:`;
  
  // Use a lightweight non-streaming call for tag suggestion
  // Parse response as comma-separated tags
  // Show suggestion UI in note editor header
}

// Suggestion UI (inject into note editor header area):
function showTagSuggestions(noteId, suggestedTags) {
  const container = document.getElementById('noteSummaryBar'); // reuse this area
  container.innerHTML = `
    <div class="tag-suggestion-bar">
      <span>✨ Suggested tags:</span>
      ${suggestedTags.map(t => `<span class="suggested-tag-chip">#${t}</span>`).join('')}
      <button onclick="applyAllSuggestedTags('${noteId}', ${JSON.stringify(suggestedTags)})">Add all</button>
      <button onclick="this.closest('.tag-suggestion-bar').remove()">Dismiss</button>
    </div>
  `;
}
```

---

### Feature 7: Thumbs Up/Down Feedback on Responses

**What:** Add 👍 👎 buttons on each AI assistant bubble. Thumbs down opens a quick-feedback dropdown (Too long / Wrong / Not helpful / Other). Feedback is stored locally and shown as a toast. Future: use feedback to adjust prompt style.

**Where:** `appendWriteChatBubble()` and `appendAskChatBubble()` in `thinkos-ai.js` — add feedback buttons to the action bar at the bottom of each assistant bubble.

**Implementation:**

Add to the bubble action bar HTML (currently has "Insert to Note" and "Copy"):
```html
<div class="bubble-feedback">
  <button onclick="aiFeedback(this,'good')" title="Good response">👍</button>
  <button onclick="aiFeedback(this,'bad')" title="Bad response">👎</button>
</div>
```

```js
function aiFeedback(btn, type) {
  const bubble = btn.closest('.ai-bubble-container');
  const rawMd = bubble?.dataset.rawMd || '';
  const turn = aiChatTurns[aiChatTurns.length - 1] || {};
  
  // Store feedback locally
  const feedbackLog = JSON.parse(localStorage.getItem('ai_feedback_log') || '[]');
  feedbackLog.push({
    ts: Date.now(),
    type, // 'good' | 'bad'
    prompt: (turn.user || '').slice(0, 100),
    provider: getActiveAiProvider(),
  });
  if (feedbackLog.length > 100) feedbackLog.splice(0, feedbackLog.length - 100);
  localStorage.setItem('ai_feedback_log', JSON.stringify(feedbackLog));
  
  if (type === 'good') {
    btn.textContent = '✅';
    btn.disabled = true;
    showThinkingToast('Thanks for the feedback!');
  } else {
    // Show quick dropdown
    showFeedbackDropdown(btn, bubble);
  }
}

function showFeedbackDropdown(btn, bubble) {
  const menu = document.createElement('div');
  menu.className = 'feedback-dropdown';
  menu.innerHTML = `
    <button onclick="submitDetailedFeedback(this.closest('.ai-bubble-container'), 'too_long')">Too long</button>
    <button onclick="submitDetailedFeedback(this.closest('.ai-bubble-container'), 'wrong')">Factually wrong</button>
    <button onclick="submitDetailedFeedback(this.closest('.ai-bubble-container'), 'not_helpful')">Not helpful</button>
    <button onclick="submitDetailedFeedback(this.closest('.ai-bubble-container'), 'off_topic')">Off topic</button>
  `;
  btn.parentElement.appendChild(menu);
}
```

---

## Execution Order

Execute in this order to minimize risk:

```
Phase 1 (File Extraction — do first, no new features):
  [ ] Create thinkos-ai.css — move all AI CSS blocks
  [ ] Create thinkos-ai.js — move all AI JS functions
  [ ] Remove moved code from thinkOS.html
  [ ] Add <link> and <script> tags to thinkOS.html
  [ ] Verify: all existing AI features work identically

Phase 2 (Quick wins — low risk):
  [ ] Feature 7: Thumbs up/down feedback buttons
  [ ] Feature 5: Improved getRelevantNotes() with recency boost + limit=10
  [ ] Feature 1: Dynamic context-aware prompt chips

Phase 3 (Medium complexity):
  [ ] Feature 3: Smart note summarization chip on open
  [ ] Feature 6: Auto-tag suggestions after edit

Phase 4 (High complexity):
  [ ] Feature 2: /ai inline editor command
  [ ] Feature 4: Daily Digest tab in fullscreen
```

---

## Key File Locations (for executing model)

| What | Location in thinkOS.html |
|---|---|
| AI state variables | ~Line 15,587 |
| AI drawer HTML (`#aiPopover`) | ~Line 14,480–14,736 |
| AI CSS (drawer base) | ~Line 7,801–8,160 |
| AI CSS (fullscreen) | ~Line 12,311–12,430 |
| Provider functions | ~Line 22,727 |
| `toggleAiPopover()` | ~Line 17,275 |
| `toggleAiPopoverFullscreen()` | ~Line 23,037 |
| `clearAiChat()` | ~Line 22,997 |
| `switchAiDrawerTab()` | ~Line 23,943 |
| `executeAiDrawerAction()` | ~Line 23,988 |
| `extractKeywords()` | ~Line 24,004 |
| `getRelevantNotes()` | ~Line 24,014 |
| `buildAskNotesPrompt()` | ~Line 24,046 |
| `askYourNotes()` | ~Line 24,222 |
| `_streamWriteResponse()` | ~Line 25,200 |
| `submitAiQuery()` | ~Line 25,356 |
| `appendWriteChatBubble()` | ~Line 25,400 |

---

## Verification Checklist (run after each phase)

- [ ] AI drawer opens with ✨ button and ⌘J keyboard shortcut
- [ ] Write & Think tab sends message and streams response
- [ ] Ask Your Notes tab retrieves relevant notes and shows citations
- [ ] Source citation pills open the correct note
- [ ] Insert to Note works (no thinking tags in note)
- [ ] Expand button covers full page (z-index 999999, body.ai-fullscreen-mode)
- [ ] Collapse button returns to drawer state
- [ ] Provider switching (Gemini → OpenAI → etc.) works
- [ ] API key saving/loading works
- [ ] Clear chat button works
- [ ] Stop generation button works
- [ ] No JS console errors on page load

---

> **Note on model switching:** This plan is intentionally detailed so it can be picked up by **Gemini 2.5 Flash** or any other model without context loss. Line numbers are approximate — always `grep` for the function name first before editing. Never edit thinkOS.html blindly by line number alone.
