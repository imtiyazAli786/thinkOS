# ThinkDashboard Reference Guide

A complete, centralized reference guide for thinkOS architecture, UI zones, core features, and safe development practices.

---

## 1. System Overview & Architecture

thinkOS separates **Knowledge Management** from **Action & Scheduling**:

```text
                                  thinkOS
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
             🧠 KNOWLEDGE LAYER               ✅ ACTION LAYER
             • Subjects & Roadmaps           • 🏠 Home (Decision Cockpit)
             • Learning Topics & Curricula   • ✅ Tasks (Execution Workspace)
             • Spaced Recall & Doubts        • 📅 Calendar (7-Day Timeline)
             • Notes & Thoughts Canvas       
```

### Reference Documentation:
- [Home, Tasks & Calendar Reference](file:///Users/personal/Documents/WebApplications/thinkOS/HOME_TASKS_CALENDAR_REFERENCE.md)
- [Sync & Storage Architecture Reference](file:///Users/personal/Documents/WebApplications/thinkOS/SYNC_AND_STORAGE_ARCHITECTURE.md)

---

## 2. Core UI Zones

### 1. Left Sidebar Navigation
- **Top Perspectives**:
  - `🏠 Home` (`__home`): Decision cockpit showing today's focus, overdue alerts, active learning resume, and spaced repetition status.
  - `📚 Subjects` (`__roadmaps`): Structured learning roadmaps and curricula.
  - `✅ Tasks` (`__tasks`): Unified execution workspace for daily queue, upcoming schedule, and inbox.
  - `📅 Calendar` (`__calendar`): 7-day timeline aggregating all date-based tasks across Tasks and Learning Topics.
  - `🎨 Thoughts Canvas` (`__board`): Visual ideation board with draggable cards.
- **Smart Folders & Filters**:
  - `All Notes` (`__all`), `Pinned` (`__pinned`), `Unsorted / Inbox` (`inbox`), `Trash` (`__archived`).
  - Custom user notebook folders with drag-and-drop reordering.

### 2. Main Workspace (`#stickies` / `#craftStickies`)
- Renders responsive views based on active perspective.
- Full-width views (`.craft-view-fullwidth`) for Home, Tasks, Calendar, and Learning Dashboards.
- Grid mode for sticky notes and subject cards.

### 3. Note / Topic Editor Drawer (`#editorDrawer`)
- Slide-over block editor with live markdown parsing, code blocks, checklists, images, and attachments.
- Specialized topic tabs for Learning Topics: `Notes`, `Tasks`, `Revision (Q&A)`, `Doubts`.

---

## 3. The Action Triad: Home, Tasks & Calendar

### 🏠 Home (`renderHomeView`)
- **🌅 Dynamic Greeting**: Live time-of-day greeting, date, and metrics banner.
- **🔴 Needs Attention**: Overdue items across all sources with 1-click "Move to Today".
- **🎯 Focus Today**: Top 3–5 items strictly due today (`dueDate === today`), ranked by focus star (`⭐`) first.
- **▶ Continue Learning**: 1-click spotlight resume to most recent active learning topic.
- **🧠 Revision & ❓ Doubts Cards**: Status of spaced repetition reviews and open doubts.
- **⚡ Quick Access**: Instant jump tiles to Canvas, Subjects, Tasks, and Calendar.

### ✅ Tasks Workspace (`renderTasksWorkspace`)
- **Quick Capture Bar**: `Enter` listener, inline modifier presets (`📥 Inbox`, `📅 Today`, `📅 Tomorrow`, `⭐ Focus`, `🔴 High Priority`), and `#tag` parser.
- **🎯 TODAY**: Divided into `⭐ Focus (Top Priorities)` and `📋 Also Today` + `⚠️ Overdue Tasks` banner.
- **⏳ UPCOMING**: Chronologically grouped date sections. Starred items remain under their scheduled date.
- **📥 INBOX**: Undated captured items waiting for scheduling.
- **✓ COMPLETED**: Collapsible accordion with full history.

### 📅 Calendar View (`renderCalendarView`)
- **7-Day Mon–Sun Grid**: Month switcher (`‹`, `›`, `Today`) and color dot indicators (🔵 Learning, 🟢 Tasks, 🔴 Overdue).
- **Selected Date Agenda**: High Priority vs. Normal grouping, instant completion checkboxes, and `↗` jump links.
- **Upcoming Deadlines**: Chronological preview of approaching commitments.

---

## 4. Key Rules for Developers

1. **Due Date Rule**:
   - `dueDate === today` $\rightarrow$ Today
   - `dueDate > today` $\rightarrow$ Upcoming (even if starred with `⭐ Focus`)
   - `!dueDate` $\rightarrow$ Inbox
   - `dueDate < today` + `!done` $\rightarrow$ Overdue
2. **Single Source of Truth**:
   - General tasks are stored in `type: 'daily-taskboard'` notes (`note.tasks[]`).
   - Learning tasks are stored in `type: 'learning-page'` notes (`note.learningTasks[]`).
   - Home and Calendar dynamically aggregate data without maintaining duplicate arrays.
3. **Storage & Sync Integrity**:
   - Never store raw uncompressed base64 data URLs in `localStorage`. Use `blobStore` (IndexedDB) and `thinking-zone-private_images` Firestore collection.
   - Always call `craftSave()` and `updateNotebookCounts()` after mutating tasks or notes.
