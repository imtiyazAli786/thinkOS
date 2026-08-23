# Dashboard — Product Requirements Document
### Version 1.0 | May 2026 | Confidential

---

## PART 1 — CRAFT PRODUCT ANALYSIS

### 1.1 What Craft Is

Craft is a premium note-taking and document creation app built natively for Apple platforms (Mac, iPhone, iPad, Vision Pro), with Windows and Android support added over 2024–2025. It positions itself as a beautiful, fast, document-first productivity tool — sitting between the simplicity of Apple Notes and the database power of Notion.

Craft has won Mac App of the Year, Apple Design Award Finalist, and three Webby Awards, establishing itself as one of the most design-forward productivity apps in the market.

### 1.2 Core Feature Set (Exhaustive)

#### Editor Features
- Block-based editor: every unit of content (text, image, checklist, code, toggle, table) is a block
- Drag-and-drop block reordering
- Rich text formatting (headings H1–H6, bold, italic, underline, strikethrough, code)
- Inline linking between documents (bidirectional)
- Sub-pages nested inside documents
- Toggle blocks (collapsible content)
- Code blocks with syntax highlighting
- Tables (static and collection-linked)
- Checklists / task blocks
- Callout blocks
- Dividers and spacers
- Custom styles per document
- Publication-ready rendering without manual formatting

#### Workspace & Organization
- Spaces (separate personal and work contexts)
- Folders inside spaces
- Tags (inline, applied to pages, blocks, tasks, collections)
- Starred/pinned documents
- Recents view
- Collections: structured database tables with custom fields
- Daily Notes: auto-created daily journal/planning page

#### AI Features (as of 2026)
- AI writing assistant (summarize, rewrite, translate, expand, shorten)
- Custom AI prompts inside documents
- On-device AI models: Llama 3.2, DeepSeek R1 (private, offline)
- Cloud AI models: Claude Haiku, Claude Sonnet, GPT-4o
- 15 AI credits/month free; 50/month on Plus
- Choice between privacy-first (on-device) and power (cloud) modes

#### Collaboration Features
- Real-time co-editing (document-level, not workspace-level)
- Inline comments and mentions
- Shared Spaces (Family and Team plans)
- Link-sharing (view without account needed)
- Public web publishing (turn any doc into a shareable URL)

#### Planning & Productivity
- Calendar view (integrated daily planning)
- Tasks embedded inside documents
- Reminders
- Daily journal template / journaling mode
- Whiteboards (visual brainstorming and mind-mapping)

#### Organization & Search
- Full-text search
- Tag-based filtering
- Sidebar navigation with folder hierarchy
- Quick Open (command palette / keyboard shortcut search)

#### Media Support
- Image embedding (resize, align, caption)
- Video embedding
- PDF embedding
- Tweet/social card embedding
- Figma file embedding
- Link preview cards (auto-generated from pasted URLs)
- File attachments

#### Platform & Sync
- Native apps: Mac, iPhone, iPad, Vision Pro, Windows, Android (beta → stable Nov 2025)
- Full offline support across all platforms
- Cross-device real-time sync
- End-to-end encryption
- Local storage option

#### Integrations (via "Imagine" platform)
- MCP (Model Context Protocol) connections: Claude, ChatGPT, Claude Code, Cursor, Windsurf, VS Code, Raycast
- API integrations: Apple Shortcuts, Lovable, Replit, Bolt, v0, Codex CLI
- Public REST API (100 requests/min)
- Zapier / automation-ready via API

#### Customization
- Multiple document themes and background styles (18+ premium backgrounds)
- Font customization per document
- Dark / light mode
- App icon customization

#### Pricing
- Free: 1,500 blocks, 1GB storage, 7-day version history, 15 AI credits
- Plus: $4.80/month (billed yearly) — unlimited, 30-day history, 50 AI credits
- Family: $9.00/month — up to 6 Plus accounts, shared Space
- Team: $50/month flat — up to 10 Plus accounts, shared Space, admin controls
- Education: free unlimited plan with school email

### 1.3 Design Philosophy

Craft's design DNA is: native-first, publication-ready, distraction-free. Every document looks like it was designed, not typed. The app feels fast — sub-second page loads, instant sync, smooth animations. The writing experience is prioritized above all: no cluttered toolbars, no database-first mental model required.

### 1.4 Craft's Weaknesses (Opportunities for Dashboard)

- Collaboration is document-level, not workspace-level — teams outgrow it
- No true Kanban board or Timeline view (Collections are basic tables only)
- No sticky-note / visual thinking canvas beyond basic whiteboards
- No agentic AI (Notion launched custom AI Agents in Feb 2026; Craft has not)
- Android app was late and still considered secondary
- No granular permission system below Team plan
- Sync requires Craft cloud — no iCloud-only option
- AI credits are meager; power users will feel constrained

---

## PART 2 — COMPETITIVE ANALYSIS

| Feature | Craft | Notion | Obsidian | Evernote | Apple Notes | OneNote | **Dashboard Opportunity** |
|---|---|---|---|---|---|---|---|
| Design quality | ★★★★★ | ★★★ | ★★ | ★★ | ★★★ | ★★ | Match Craft's premium feel |
| Editor UX | ★★★★★ | ★★★ | ★★★ | ★★★ | ★★★★ | ★★★ | Block + sticky hybrid |
| AI integration | ★★★ | ★★★★ | ★★ (plugins) | ★★ | ★★ | ★★ | Agentic AI-first |
| Database/views | ★★ | ★★★★★ | ★★ (plugins) | ★ | ✗ | ★★ | Light DB + visual boards |
| Offline support | ★★★★★ | ★★★ | ★★★★★ | ★★★ | ★★★★★ | ★★★★ | Offline-first parity |
| Collaboration | ★★★ | ★★★★★ | ✗ | ★★★ | ★★ | ★★★★ | Doc + workspace-level |
| Sticky notes | ✗ | ✗ | ✗ | ✗ | ✗ | ★★★ | **Differentiator** |
| Pricing | ★★★★ | ★★★ | ★★★★ | ★★ | Free | Free | Freemium aggressive |
| Cross-platform | ★★★★ | ★★★★★ | ★★★ | ★★★★ | Apple-only | ★★★★★ | Full parity from day 1 |

### Key Differentiation Opportunities for Dashboard
1. Sticky-note-first visual thinking layer (no competitor does this well)
2. Agentic AI that acts, not just assists
3. Workspace-level real-time collaboration from the start
4. Hybrid canvas: structured notes + freeform sticky clusters in the same view
5. Faster onboarding than Notion, richer than Apple Notes

---

## PART 3 — DASHBOARD APP PRD

### 3.1 Product Vision

> Dashboard is the thinking OS for modern professionals — a place where notes, ideas, and tasks live together in a beautiful, fast, AI-powered workspace that adapts to how your mind works, not the other way around.

### 3.2 Problem Statement

Knowledge workers today use 3–5 different tools for notes, tasks, ideas, and collaboration. These tools are either too simple (Apple Notes), too complex (Notion), or too old (Evernote). No single app offers the trinity of premium design, sticky-note visual thinking, and intelligent AI-assisted workflows in one coherent product.

Dashboard solves this by unifying fast note capture, visual sticky organization, and proactive AI into one premium, beautiful workspace.

### 3.3 Target Users

**Primary**: Individual knowledge workers, 25–40, who live in their laptop — product managers, designers, researchers, writers, indie hackers, consultants.

**Secondary**: Small teams (2–10 people) who need lightweight collaboration without Notion's complexity.

**Tertiary**: Students and creators who want a premium tool they're proud to use.

### 3.4 User Personas

**"The Thinker" — Arjun, 31, Product Manager**
- Captures meeting notes, builds roadmaps, tracks ideas in flight
- Wants beautiful output without formatting effort
- Uses sticky notes physically to plan sprints; wants the digital equivalent
- Pain: switching between Notion, Miro, and Apple Notes constantly

**"The Creator" — Priya, 27, Freelance Designer**
- Needs mood boards, project briefs, client notes in one place
- Wants visual, not just hierarchical, organization
- Shares documents with clients — presentation matters
- Pain: Notion is too corporate-looking; Apple Notes lacks power

**"The Sprinter" — Marcus, 34, Startup Founder**
- Moves fast, captures ideas everywhere, revisits them later
- Wants AI to surface relevant notes before he thinks to look
- Runs small team needing shared workspace without Notion learning curve
- Pain: Craft is beautiful but AI is too weak; Notion is powerful but ugly

### 3.5 Product Goals

1. Become the go-to note-taking app for professionals who care about design
2. Win the "sticky note + structured note" hybrid use case no competitor owns
3. Make AI feel like a collaborator, not a toolbar button
4. Launch with full cross-platform parity (Web, iOS, Android, Desktop)
5. Reach 10,000 active users within 6 months of launch

### 3.6 Core Value Propositions

- **Beautiful by default** — every note looks designed
- **Think visually** — sticky note canvas + structured docs in the same workspace
- **AI that works for you** — proactive, agentic, always relevant
- **Capture without friction** — quick notes that get smarter over time

---

## PART 4 — FEATURE SPECIFICATION

### 4.1 MVP Features (v1.0)

#### Notes & Editor
- [ ] Block-based rich text editor
- [ ] Drag-and-drop blocks
- [ ] Headings, bold, italic, checklists, code blocks, toggles, dividers
- [ ] Inline document linking
- [ ] Sub-notes (nested pages)
- [ ] Image upload and embedding
- [ ] Link preview cards (auto-generated)
- [ ] Templates (5–10 starter templates)

#### Sticky Note System (Differentiator)
- [ ] Sticky note canvas view alongside document view
- [ ] Create sticky notes from any block (right-click → "Add to Board")
- [ ] Color-coded sticky notes (6 standard colors)
- [ ] Free-position and drag sticky notes on canvas
- [ ] Group sticky notes into clusters
- [ ] Convert sticky note back to document block
- [ ] Board view with zoom-in/zoom-out

#### Organization
- [ ] Collections (note groups / folders)
- [ ] Tags (inline, applied to notes and blocks)
- [ ] Starred / pinned notes
- [ ] Recents view
- [ ] Full-text search with instant results

#### AI (Basic)
- [ ] AI rewrite / improve writing
- [ ] AI summarize selected text or full note
- [ ] AI generate from prompt (inside a note)
- [ ] AI extract tasks from note content
- [ ] AI suggest tags based on note content

#### Collaboration (Basic)
- [ ] Share note via link (view-only, no account needed)
- [ ] Real-time co-editing (document-level)
- [ ] Comments on blocks

#### Platform
- [ ] Web app (PWA)
- [ ] iOS native app
- [ ] Android native app
- [ ] Offline support (read + write, sync on reconnect)
- [ ] Cross-device real-time sync

#### Customization
- [ ] Light and dark mode
- [ ] 3 document themes (clean, paper, minimal)
- [ ] Font size preferences

### 4.2 Version 2.0 Features

- [ ] Workspace-level collaboration with roles (viewer / editor / admin)
- [ ] Agentic AI workflows (see Section 6)
- [ ] Daily Note (auto-created journal/planner page)
- [ ] Calendar integration (Google Calendar, Apple Calendar)
- [ ] Advanced search (semantic / AI-powered)
- [ ] Collections as databases (custom fields, filter, sort)
- [ ] Public web publishing (shareable pages with Dashboard branding)
- [ ] Version history (30 days on paid)
- [ ] Whiteboard canvas with freehand drawing
- [ ] 10+ additional themes and backgrounds
- [ ] API access (REST)

### 4.3 Version 3.0 / Future

- [ ] Voice notes with AI transcription
- [ ] Web clipper (browser extension)
- [ ] Integrations hub (Notion import, Evernote import, Google Drive sync)
- [ ] Custom AI prompts (save and reuse)
- [ ] Team analytics (activity, contribution heatmaps)
- [ ] On-device AI model (privacy mode)
- [ ] Apple Watch / widget support

---

## PART 5 — AI & AGENTIC FEATURES

### 5.1 AI Assistant (Inline)
- Rewrite, summarize, expand, translate
- Tone adjustment (formal, casual, direct)
- Grammar and clarity check
- "Continue writing" from cursor position
- Extract action items from meeting notes
- Generate document from outline prompt

### 5.2 Smart Organization
- Auto-suggest tags when saving a note
- Auto-group similar notes into a suggested Collection
- Flag duplicate or near-duplicate content
- Surface related notes when writing ("Looks like you have notes on this topic")
- Smart Daily Digest: "Here's what's on your board today + 3 related notes you haven't seen in a while"

### 5.3 Agentic AI Workflows (v2.0)
These are AI agents that complete multi-step tasks autonomously:

**Meeting Debrief Agent**
Trigger: "Process my meeting notes"
Action: Extracts action items → assigns to tasks → drafts follow-up email → suggests calendar block for follow-up

**Research Agent**
Trigger: "Research [topic] and build me a summary note"
Action: Searches the web → extracts key information → creates a structured note with sources → suggests related notes in workspace

**Project Kickoff Agent**
Trigger: "I'm starting a project called [X]"
Action: Creates a Collection → generates starter documents (brief, task list, notes template) → sets up a board with initial sticky notes for planning phases

**Weekly Review Agent**
Trigger: Every Monday or manual
Action: Summarizes notes from last week → surfaces incomplete tasks → suggests priorities for the week → generates a weekly summary note

**Email Draft Agent**
Trigger: "Draft an email from this note"
Action: Reads note context → generates email with appropriate tone → populates subject line → offers 2-3 tone variations

### 5.4 Smart Search
- Semantic search (find notes by meaning, not just keyword)
- Natural language queries: "Find my notes about the Q3 product roadmap"
- "Ask your notes" chat interface: AI answers questions using your note content as context
- Search across note text, tags, comments, and sticky note content

### 5.5 Voice Interaction (v3.0)
- Voice-to-note (speech recognition with AI cleanup)
- Voice command: "Create a note titled [X] with the following..."
- Voice query: "What did I write about the design review last week?"

---

## PART 6 — UX/UI RECOMMENDATIONS

### 6.1 App Structure

```
App Shell
├── Sidebar (collapsible)
│   ├── Search bar
│   ├── Quick Create button
│   ├── Starred
│   ├── Today / Daily Note
│   ├── Collections
│   │   ├── [Collection 1]
│   │   └── [Collection 2]
│   ├── Tags
│   └── Trash
├── Main Content Area
│   ├── Note Editor view
│   ├── Board (Sticky Note Canvas) view
│   └── Collection (List/Grid) view
└── AI Panel (slide-in from right)
    ├── Ask AI
    ├── Suggested Actions
    └── Recent AI outputs
```

### 6.2 Navigation Flow

- **Landing on open**: Show "Today" view with Daily Note + recent notes
- **Creating a note**: Click `+` anywhere → instantly open blank note → start typing
- **Switch to sticky view**: Toggle in top-right of any Collection
- **AI access**: `Cmd/Ctrl + J` or floating AI button in editor
- **Quick capture**: Global shortcut even when app is in background

### 6.3 Note Editor Design Principles
- Single-column, centered content (max ~700px wide) for focused writing
- Toolbar appears contextually on text selection — not always visible
- Block handle appears on hover (left side) — not always visible
- `/` command palette for inserting any block type
- `@` to mention/link another note
- `#` to add a tag inline
- AI suggestions appear as ghost text or floating prompts — subtle, not intrusive

### 6.4 Sticky Note Canvas Design
- Notes appear as cards with a subtle paper texture
- Colors: yellow (default), blue, green, pink, purple, white
- Resize by dragging corners
- Double-click to edit
- Pinch-to-zoom on mobile / scroll-to-zoom on desktop
- Cluster by dragging notes near each other — auto-group visual
- Toolbar at bottom of canvas (not top) for cleaner visual space
- "Link to Note" button on each sticky — connects to a full note

### 6.5 Design Language
- **Typography**: One clean sans-serif system font family (Inter or system-default)
- **Colors**: Warm neutral backgrounds (not pure white, not gray — warm paper tones in light mode; warm charcoal in dark mode)
- **Spacing**: Generous, breathing whitespace — Craft-level polish
- **Animations**: Subtle, purposeful (block transitions, panel slides, AI response reveals)
- **Icons**: Consistent outline style (Tabler or Lucide)
- **Empty states**: Illustrated, inviting, not generic

---

## PART 7 — FUNCTIONAL REQUIREMENTS

### 7.1 Note System
- FR-001: A note contains one or more blocks of type: text, heading, list, checklist, toggle, image, code, divider, link-preview, sub-note
- FR-002: Any block can be promoted to a sticky note
- FR-003: Notes are contained within Collections or at workspace root
- FR-004: Notes have metadata: created, modified, tags, linked notes, word count
- FR-005: Inline linking between notes creates a bidirectional backlink

### 7.2 Sticky Note Canvas
- FR-010: A Collection can have both a List view and a Board (canvas) view
- FR-011: Sticky notes can exist independently or be linked to a full note
- FR-012: Canvas supports infinite scroll (not fixed dimensions)
- FR-013: Sticky notes persist position per user device

### 7.3 AI
- FR-020: All AI actions must have a visible confidence/source indicator
- FR-021: AI operations on a note must be reversible (undo)
- FR-022: Users can choose AI provider (cloud vs on-device when available)
- FR-023: AI credits usage must be visible and predictable in UI

### 7.4 Sync & Offline
- FR-030: All writes must be stored locally first, synced to cloud on reconnect
- FR-031: Sync conflicts must be surfaced to user with a diff view, not silently overwritten
- FR-032: Last-modified timestamp used for conflict resolution by default

### 7.5 Collaboration
- FR-040: Shared note shows live presence indicators (avatar dots)
- FR-041: Comments are block-level, not document-level
- FR-042: Shared links have optional password protection
- FR-043: Workspace admin can revoke access to any shared link

---

## PART 8 — NON-FUNCTIONAL REQUIREMENTS

- NFR-001: Time to first interactive on mobile ≤ 1.5 seconds
- NFR-002: Note save latency ≤ 100ms (local write)
- NFR-003: Search results appear ≤ 300ms after last keystroke
- NFR-004: AI inline response begins streaming ≤ 1 second after request
- NFR-005: App must function fully offline for all core note and sticky operations
- NFR-006: 99.9% uptime SLA for cloud sync service
- NFR-007: All user data encrypted at rest (AES-256) and in transit (TLS 1.3)
- NFR-008: GDPR and CCPA compliant from launch
- NFR-009: Accessibility: WCAG 2.1 AA minimum
- NFR-010: App bundle size ≤ 25MB (mobile)

---

## PART 9 — TECHNICAL ARCHITECTURE

### 9.1 Frontend Stack
- **Web**: React 18 + TypeScript, TanStack Query for server state, Zustand for local state
- **iOS**: Swift / SwiftUI (native for performance and platform feel)
- **Android**: Kotlin + Jetpack Compose
- **Desktop (Mac/Windows)**: Electron wrapper for web app OR Tauri (lighter, Rust-based)
- **Editor engine**: Custom block editor built on ProseMirror or Tiptap (proven, extensible)
- **Canvas/Board**: Konva.js or custom HTML5 Canvas renderer

### 9.2 Backend Stack
- **API layer**: Node.js (Fastify) or Go — low latency, high throughput
- **Auth**: Clerk or Supabase Auth (OAuth + email, passkey-ready)
- **Real-time sync**: Yjs (CRDT-based) via WebSocket — the gold standard for collaborative note-taking
- **File storage**: Cloudflare R2 (cost-effective, fast)
- **Search**: Meilisearch (self-hostable, fast full-text) + pgvector for semantic search
- **Queue**: BullMQ (Redis-backed) for async AI operations

### 9.3 Database Design
- **Primary DB**: PostgreSQL (notes, users, collections, tags, permissions)
- **Document content**: JSONB column storing block tree (flexible, queryable)
- **Vector store**: pgvector extension for semantic search embeddings
- **Cache**: Redis for session data, search result caching, AI credit tracking
- **CRDT state**: Yjs document states stored per note for offline merge

### 9.4 AI Integration Architecture
```
User Action → AI Request Router
    ├── On-device: Llama / Phi via WebAssembly (privacy mode)
    ├── Anthropic Claude API (default cloud)
    └── OpenAI GPT-4o (optional)

Agentic Layer:
    User Intent → Intent Classifier → Agent Selector
        ├── Tool calls: search notes, create note, create task, send email
        ├── Memory: user preferences, recent context (last 20 notes)
        └── Output: streamed back to UI with progress indicators
```

### 9.5 Sync Architecture (Offline-First)
```
Local State (SQLite / IndexedDB)
    ↕ (background sync)
Sync Server (Yjs WebSocket server)
    ↕
Cloud DB (PostgreSQL)

Conflict resolution: CRDT merging via Yjs (automatic, no user prompts for text)
Structural conflicts (note deleted vs edited): surface to user with diff
```

---

## PART 10 — MONETIZATION

### 10.1 Freemium Model

**Free tier** (generous to drive adoption):
- Unlimited notes and blocks
- 5GB storage
- 7-day version history
- 3 Collections
- AI: 20 credits/month
- Share via link (view-only)
- 2 devices

**Pro — $8/month ($6/month yearly)**:
- Unlimited Collections
- Unlimited storage
- 30-day version history
- AI: 200 credits/month
- Workspace collaboration (up to 3 users)
- Custom themes + backgrounds
- Agentic AI workflows
- API access
- Priority support

**Team — $15/user/month ($12 yearly)**:
- Everything in Pro
- Unlimited workspace members
- Workspace-level permissions and roles
- Admin dashboard
- Shared Collections
- Team analytics
- SSO (SAML)
- 90-day version history
- Dedicated support

**Enterprise (custom pricing)**:
- On-premise deployment option
- On-device AI models (full privacy)
- Custom data retention
- SLA + dedicated CSM
- Audit logs

### 10.2 AI Usage Model
- Credits are consumed per AI action (1 credit = ~1,000 tokens)
- Free: 20 credits/month
- Pro: 200 credits/month (covers daily use comfortably)
- Add-on credits: $5 for 100 extra credits (à la carte)
- Agentic workflows: 5–10 credits per run (metered, shown before running)

### 10.3 Additional Revenue
- Template marketplace (50/50 revenue share with creators, launch Year 2)
- Education plan (free for verified students, $4/month for institutions with volume)
- Referral program: 1 free month per referred paying user

---

## PART 11 — PRIORITIZED ROADMAP

### Phase 1 — Foundation (Months 1–4)
- Core block editor (ProseMirror/Tiptap)
- Basic note CRUD with collections and tags
- Sticky note canvas (MVP: color, position, link to note)
- Web app + iOS app
- Offline-first sync (Yjs)
- Basic AI (summarize, rewrite, task extraction)
- Free and Pro tiers

### Phase 2 — Growth (Months 5–8)
- Android app
- Real-time collaboration (Yjs multiplayer)
- AI semantic search
- Agentic workflows (Meeting Debrief, Research Agent)
- Daily Notes
- Public link sharing + web publishing
- Version history
- Mac desktop app (Electron/Tauri)

### Phase 3 — Scale (Months 9–14)
- Team plan + workspace permissions
- Advanced Collections (custom fields, Kanban view)
- Voice notes + transcription
- Web clipper (browser extension)
- Integrations hub (import from Notion, Evernote)
- Template marketplace (beta)
- On-device AI model
- API (public) launch

### Phase 4 — Enterprise (Month 15+)
- SSO + SAML
- Enterprise tier
- Audit logs
- On-premise option
- Custom AI model fine-tuning
- White-label option

---

## PART 12 — ACCESSIBILITY REQUIREMENTS

- All interactive elements accessible via keyboard navigation
- Screen reader compatible (ARIA labels on all custom components)
- Minimum 4.5:1 color contrast ratio for body text (WCAG AA)
- 3:1 contrast for large text and UI components
- Sticky note canvas accessible via keyboard (tab to next note, arrow keys to move)
- AI responses include text alternatives for any generated visual content
- Reduced motion mode (respect system `prefers-reduced-motion`)
- Font size scalable (system font size settings respected)
- Text input supports all IMEs (CJK, Devanagari, Arabic)

---

## PART 13 — SUCCESS METRICS

### Product KPIs
| Metric | 3-Month Target | 6-Month Target | 12-Month Target |
|---|---|---|---|
| Monthly Active Users | 1,000 | 10,000 | 50,000 |
| Paying Users (conversion) | 5% | 8% | 12% |
| Day-7 Retention | 35% | 45% | 55% |
| Day-30 Retention | 20% | 30% | 40% |
| Notes created per active user/month | 15 | 25 | 35 |
| Sticky notes used (% of users) | 30% | 50% | 65% |
| AI actions per active user/month | 5 | 15 | 30 |
| NPS Score | 40 | 50 | 60+ |

---

*Document prepared by: Senior PM / Product Strategy*
*Last updated: May 2026*
*Next review: August 2026*
