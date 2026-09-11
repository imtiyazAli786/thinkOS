# thinkOS Action Architecture: Home, Tasks & Calendar Reference Guide

> **Document Version:** 1.0  
> **Status:** Production / Stable  
> **Core Concept:** Separation of Knowledge Management from Action & Scheduling

---

## 1. System Philosophy: Knowledge vs. Action

In thinkOS, we strictly separate **Knowledge** from **Action**:

```text
                                  thinkOS
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
             🧠 KNOWLEDGE LAYER               ✅ ACTION LAYER
             • Subjects & Roadmaps           • 🏠 Home (Cockpit)
             • Learning Topics & Curricula   • ✅ Tasks (Daily Queue)
             • Notes, Doubts & Revision      • 📅 Calendar (Timeline)
```

### Why this separation matters:
1. **No Taskboard Multiplications**: You never need to create separate taskboards for every subject, project, or daily context.
2. **Zero Clutter in Knowledge Notes**: Learning topics focus on understanding and retention, while their practice tasks seamlessly roll up into the global Action system.
3. **Calm, High-Leverage Execution**: You only see what needs action today, keeping cognitive overload to zero.

---

## 2. The Action Triad: Quick Comparison

```text
                      🏠 HOME ("What should I do now?")
                               ▲            ▲
                               │            │
                    (Surfaces Focus)    (Aggregates Due)
                               │            │
             ✅ TASKS ─────────┴────────────┴───────── 📅 CALENDAR
       ("What is on my plate?")                  ("When are my deadlines?")
```

| Dimension | 🏠 Home (`__home`) | ✅ Tasks (`__tasks`) | 📅 Calendar (`__calendar`) |
| :--- | :--- | :--- | :--- |
| **Primary Question** | *"What deserves my focus right now?"* | *"What is on my execution plate?"* | *"When are my deadlines scheduled?"* |
| **Nature of View** | Lean Decision Cockpit | Execution & Queue Workspace | 7-Day Timeline Aggregator |
| **Scope of Tasks** | Top 3–5 items strictly due today + Overdue | All general tasks: Today, Upcoming, Inbox, Done | All dated tasks from Tasks & Learning Topics |
| **Direct Quick Capture** | ❌ No (keeps cockpit clean) | ✅ Yes (Full capture bar with presets) | ❌ No (Viewer & status manager) |
| **Undated Inbox** | ❌ No | ✅ Yes (`📥 Inbox` section) | ❌ No |
| **Learning Integration** | ▶ Active Topic Spotlight, 🧠 Recall, ❓ Doubts | ❌ No (General tasks only) | ✅ Yes (🔵 Learning task dots & agenda) |

---

## 3. Individual View Capabilities

### 🏠 Home View (`__home`)

`Home` is a selective decision surface. It helps you decide what to do next without overwhelming you with the full task backlog.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 🌅 Good morning!                         📅 Wednesday, Sep 10          │
│ 3 tasks scheduled today • 2 revision due • 4 subjects                  │
├────────────────────────────────────────────────────────────────────────┤
│ 🔴 NEEDS ATTENTION (Appears only if overdue items exist)               │
│   ☐ Complete STLC Practice (Due Sep 8)         [ 📅 Move to Today ]    │
├────────────────────────────────────────────────────────────────────────┤
│ 🎯 FOCUS TODAY (Top 3–5 items strictly due today)                      │
│   ☐ ⭐ Create 5 BVA test cases        📚 Learning · Manual Testing  ↗  │
│   ☐ ⭐ Submit office testing report   ✅ Tasks · Work               ↗  │
│   ☐ Review sprint backlog             ✅ Tasks                      ↗  │
├────────────────────────────────────────────────────────────────────────┤
│ ▶ CONTINUE LEARNING SPOTLIGHT                                          │
│   Manual Testing → Boundary Value Analysis      [ ▶ Resume Topic ]     │
│   Next: Complete Boundary Value test cases                             │
├────────────────────────────────────────────────────────────────────────┤
│ 🧠 Revision Due (2)                     ❓ Open Doubts (3)             │
│   [ Start Revision → ]                    [ Review Doubts → ]          │
├────────────────────────────────────────────────────────────────────────┤
│ ⚡ QUICK ACCESS                                                        │
│   [ Thoughts Canvas ]   [ Subjects ]   [ Tasks ]   [ Calendar ]        │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Components:
1. **Dynamic Greeting Banner**: Time-of-day greeting (`Good morning / afternoon / evening`), live formatted date, and workspace metrics.
2. **🔴 Needs Attention**: Surfaces overdue tasks (`dueDate < today && !done`) across both Tasks and Learning Topics. Allows 1-click rescheduling to today.
3. **🎯 Focus Today (Top 3–5 Items)**:
   - Contains only tasks where `dueDate === today`.
   - Ranked with starred (`⭐`) items first, followed by High Priority (`🔴 P1`).
   - Checkboxes allow 1-click completion directly from Home.
4. **▶ Continue Learning Spotlight**: Automatically locates your most recent active subject and topic, showing progress percentage, next actionable step, and a **Resume Topic** button.
5. **🧠 Revision Due & ❓ Open Doubts**: Real-time counters for spaced repetition review and unresolved questions.
6. **⚡ Quick Access Grid**: 1-click navigation tiles for Thoughts Canvas, Subjects, Tasks, and Calendar.

---

### ✅ Tasks Workspace (`__tasks`)

`Tasks` is your daily execution powerhouse for general tasks, habit tracking, and quick capturing.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [ Capture a task... e.g. "Prepare test plan #work"  ]  [ + Add Task ]  │
│ Presets: [ 📥 Inbox ] [ 📅 Today ] [ 📅 Tomorrow ] [ ⭐ Focus ] [ 🔴 P1 ] │
├────────────────────────────────────────────────────────────────────────┤
│ 🎯 TODAY (3)                                                           │
│   ⭐ Focus (Top Priorities)                                            │
│     ☐ ⭐ Submit testing report        🔴 High   📅 Today   #work   🗑   │
│     ☐ ⭐ Call electrician                      📅 Today   #home   🗑   │
│   📋 Also Today                                                        │
│     ☐ Pay utility bill                         📅 Today           🗑   │
├────────────────────────────────────────────────────────────────────────┤
│ ⏳ UPCOMING (2)                                                        │
│   📅 Tomorrow (1)                                                      │
│     ☐ Prepare demo deck               🟡 Med   📅 Tomorrow #dev   🗑   │
│   📅 Fri, Sep 12 (1)                                                   │
│     ☐ ⭐ Team sprint review           🔴 High  📅 Sep 12   #work  🗑   │
├────────────────────────────────────────────────────────────────────────┤
│ 📥 INBOX (1)                                                           │
│     ☐ Research Playwright CI integration       📅 Set Date  +#     🗑   │
├────────────────────────────────────────────────────────────────────────┤
│ ✓ Completed (4)                                           [ Show ▼ ]   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Components:
1. **Quick Capture Bar**:
   - `Enter` key triggers instant task creation.
   - Inline modifier presets: `📥 Inbox`, `📅 Today`, `📅 Tomorrow`, `⭐ Focus`, `🔴 High Priority`.
   - Automatic `#tag` extraction (e.g. typing `Buy milk #groceries` extracts `groceries` as the tag).
2. **🎯 TODAY Section**:
   - Contains tasks where `dueDate === today`.
   - Split into **⭐ Focus** (starred top priorities) and **📋 Also Today** (remaining items).
   - If overdue tasks exist, displays a **⚠️ Overdue Callout** with a "Move All to Today" button.
3. **⏳ UPCOMING Section**:
   - Contains future tasks (`dueDate > today`).
   - Grouped chronologically by date (`Tomorrow`, `Fri, Sep 12`, etc.).
   - *Key Rule*: Future tasks with `⭐ Focus` stay under their scheduled date and **never** leak into Today.
4. **📥 INBOX Section**:
   - Holds undated captures (`!dueDate`).
   - Clean triage buttons to assign dates, priorities, or tags.
5. **✓ COMPLETED Section**:
   - Collapsible accordion with full task history, restore, and delete capabilities.
6. **Task Row Controls**:
   - Checkbox: Toggle done (with strikethrough).
   - Star (`⭐ / ☆`): Toggle focus flag.
   - Title: Click to inline-rename.
   - Tag Chip: Click to edit or add `#tag`.
   - Priority Badge: Click to cycle (`None` $\rightarrow$ `🔴 P1 High` $\rightarrow$ `🟡 P2 Med` $\rightarrow$ `🔵 P3 Low`).
   - Date Badge: Click to pick or clear due date.
   - Delete: 1-click deletion with confirmation.

---

### 📅 Calendar View (`__calendar`)

`Calendar` is a unified timeline aggregator for all date-based commitments across the entire system.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ SEPTEMBER 2026                 [ ‹ ] [ › ] [ Today ]    (5 Dated Tasks)│
├────────────────────────────────────────────────────────────────────────┤
│   MON       TUE       WED       THU       FRI       SAT       SUN      │
│   7         8         9         10        11        12        13       │
│             🔴                  🔵🟢                🔵                 │
├────────────────────────────────────────────────────────────────────────┤
│ 📅 TODAY — WED, SEP 10                                                 │
│   🔴 HIGH PRIORITY                                                     │
│   ☐ Submit office testing report                                ↗     │
│     ✅ Tasks · Work              🔴 High Priority                      │
│                                                                        │
│   🟡 NORMAL                                                            │
│   ☐ Complete 5 BVA test cases                                   ↗     │
│     📚 Learning · Manual Testing → BVA   🟡 Normal Priority            │
├────────────────────────────────────────────────────────────────────────┤
│ UPCOMING DEADLINES                                                     │
│   📅 Fri, Sep 12                                                       │
│   ☐ STLC practice quiz                                          ↗     │
│     📚 Learning · Manual Testing → STLC                                │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Components:
1. **7-Day Mon–Sun Grid**:
   - Standard Monday-to-Sunday layout.
   - Month switcher (`‹`, `›`, `Today`).
   - Indicator Dots on day cells:
     - 🔵 **Cyan / Blue Dot**: Learning Topic task due on that date.
     - 🟢 **Green Dot**: General Task due on that date.
     - 🔴 **Red Dot**: Overdue task on that date.
2. **Selected Date Agenda**:
   - **Primary**: Prominent task title.
   - **Secondary**: Breadcrumb badge showing origin (`📚 Learning · Subject → Topic` or `✅ Tasks · Work`).
   - **Priority Split**: Clear grouping into `🔴 High Priority` and `🟡 Normal`.
   - **Instant Checkbox**: Mark tasks complete directly from the agenda.
   - **Jump Arrow (`↗`)**: Opens the underlying source note or topic with the Tasks tab active.
3. **Upcoming Deadlines Timeline**:
   - Chronological preview of all approaching deadlines.

---

## 4. The 4 Invariable Connection Rules

```text
                             [ USER CREATES TASK ]
                                       │
                  ┌────────────────────┴────────────────────┐
                  ↓                                         ↓
         📚 Learning Topics                            ✅ Tasks
      (Stored in topic note)                   (Stored in primary Tasks storage)
                  │                                         │
                  │ (Has explicit dueDate)                  │ (Has explicit dueDate)
                  └────────────────────┬────────────────────┘
                                       │
                                       ↓
                             📅 CALENDAR TIMELINE
                            (Aggregates all dated)
                                       │
                                       │ (dueDate === today || Overdue)
                                       ↓
                                  🏠 HOME VIEW
                           (Focus Today & Overdue alert)
```

### Rule 1: Single Source of Truth (Zero Duplication)
- General tasks live inside the primary `daily-taskboard` note.
- Learning tasks live inside their respective `learning-page` topic notes.
- Home and Calendar do **not** store separate task copies; they query the single source dynamically.

### Rule 2: Due Date Determines *When*; Focus Determines *What to Prioritize*
| Task State | Where it appears |
| :--- | :--- |
| `dueDate === today` + `⭐ Starred` | **Tasks** (Today $\rightarrow$ ⭐ Focus), **Home** (🎯 Focus Today), **Calendar** (Today). |
| `dueDate === today` (Unstarred) | **Tasks** (Today $\rightarrow$ 📋 Also Today), **Home** (🎯 Focus Today), **Calendar** (Today). |
| `dueDate > today` + `⭐ Starred` | **Tasks** (⏳ Upcoming on its date), **Calendar** (Future Date). *Never appears in Today or Home.* |
| `!dueDate` (Undated) | **Tasks** (📥 Inbox). *Never appears in Calendar, Today, or Home.* |
| `dueDate < today` + `!done` | **Home** (🔴 Needs Attention), **Tasks** (⚠️ Overdue Banner), **Calendar** (🔴 Red dot). |

### Rule 3: Real-Time Bidirectional Synchronization
- Checking a task complete in **Home**, **Tasks**, or **Calendar** updates `task.done` and `task.doneHistory[todayKey]`, saves to local and cloud storage, and immediately refreshes all views and sidebar badge counts.
- Rescheduling an overdue task from **Home** immediately places it into **Today** in Tasks and updates the Calendar.

### Rule 4: Contextual Ownership & Jump Links (`↗`)
- Learning tasks maintain their association with their parent subject and topic. Clicking a jump link on Home or Calendar opens the topic drawer directly with the **Tasks** tab active.

---

## 5. Task Object Data Schema

### General Task (`note.tasks[]` inside `daily-taskboard`):
```typescript
interface GeneralTask {
  id: string;             // e.g. "task_c9f28a7e-..."
  label: string;          // e.g. "Submit weekly testing report"
  dueDate?: string;       // "YYYY-MM-DD" or undefined (Inbox)
  priority?: string;      // "" | "p1" | "p2" | "p3"
  focus?: boolean;        // true = starred focus target
  tag?: string;           // e.g. "work", "personal"
  done: boolean;          // true if completed
  doneHistory: {          // Daily completion tracking
    [dateKey: string]: boolean;
  };
  createdAt: number;      // Unix timestamp in ms
}
```

### Learning Task (`note.learningTasks[]` inside `learning-page`):
```typescript
interface LearningTask {
  id: string;             // e.g. "task_e4a19b02-..."
  text: string;           // e.g. "Complete 5 BVA test cases"
  dueDate?: string;       // "YYYY-MM-DD" or undefined
  priority?: string;      // "" | "p1" | "p2" | "p3"
  done: boolean;          // true if completed
}
```

---

## 6. JavaScript API Reference (`thinkOS.html`)

| Function Name | Parameters | Description |
| :--- | :--- | :--- |
| `renderHomeView(grid)` | `grid: HTMLElement` | Renders the lean Home decision cockpit into `#stickies`. |
| `renderTasksWorkspace(grid)` | `grid: HTMLElement` | Renders the full unified Tasks execution workspace. |
| `renderCalendarView(grid)` | `grid: HTMLElement` | Renders the 7-day month calendar timeline and selected date agenda. |
| `getAllGeneralTasks()` | *none* | Returns all tasks across unarchived `daily-taskboard` notes with normalized fields. |
| `getAllDatedTasks()` | *none* | Aggregates all tasks with valid `dueDate` across Tasks and Learning Topics. |
| `getPrimaryTaskNote()` | *none* | Returns the primary `daily-taskboard` note (auto-creates if missing). |
| `captureUnifiedTask(...)` | `(label, dueDate, priority, isFocus, tag)` | Captures a new task into the primary taskboard with auto `#tag` parsing. |
| `toggleUnifiedTaskDone(...)` | `(boardId, taskId)` | Toggles task completion, updating `task.done` and `doneHistory`. |
| `toggleUnifiedTaskFocus(...)` | `(boardId, taskId)` | Toggles `⭐ Focus` flag on a task. |
| `setUnifiedTaskDueDate(...)` | `(boardId, taskId, dateStr)` | Sets, updates, or clears the task due date. |
| `cycleUnifiedTaskPriority(...)` | `(boardId, taskId)` | Cycles task priority between `None` $\rightarrow$ `P1 High` $\rightarrow$ `P2 Med` $\rightarrow$ `P3 Low`. |
| `editUnifiedTaskLabel(...)` | `(boardId, taskId)` | Prompts to rename the task. |
| `editUnifiedTaskTag(...)` | `(boardId, taskId)` | Prompts to edit or add a category tag (`#tag`). |
| `deleteUnifiedTask(...)` | `(boardId, taskId)` | Deletes the task after user confirmation. |
| `toggleCalendarTask(...)` | `(sourceType, sourceId, taskId, dateKey)` | Completes or uncompletes a task from Calendar or Home, syncing back to source. |
| `rescheduleOverdueTaskToToday(...)` | `(sourceType, sourceId, taskId)` | Moves a specific overdue task's due date to today. |
| `rescheduleAllOverdueToToday()` | *none* | Moves all overdue general tasks to today in 1 click. |
| `jumpFromCalendarToSource(...)` | `(sourceType, sourceId)` | Deep-links directly to the topic note (with Tasks tab active) or taskboard note. |
| `updateNotebookCounts()` | *none* | Recalculates and updates sidebar badge counts for all views. |

---

## 7. Daily Workflow Best Practice Guide

1. **Morning (5 minutes in 🏠 Home)**:
   - Check **🔴 Needs Attention**: Reschedule any overdue tasks to Today with 1 click.
   - Review **🎯 Focus Today**: Pick 3–5 core targets for the day.
   - Check **▶ Continue Learning**: Identify your learning topic for the day.

2. **Throughout the Day (in ✅ Tasks & 🧠 Learning)**:
   - Capture incoming tasks into `Tasks` using the quick capture bar (or send them to `📥 Inbox` if unscheduled).
   - Check off items in **🎯 Today** as you complete them.
   - When learning a subject, add practice exercises inside the topic's **Tasks** tab with a due date.

3. **Weekly / Scheduled Planning (in 📅 Calendar)**:
   - Open **📅 Calendar** to visualize deadline distributions across the month.
   - Ensure upcoming deadlines are evenly spaced to prevent end-of-week pileups.
