# Task Organization

Copy this file to one of these locations and customize the keyword lists to match how you actually categorize work:

- `personal/resources/organization.md` — applies to every session in this workbench
- `personal/projects/<name>/resources/organization.md` — applies only when that project context is active (takes precedence over the top-level file)

Commands like `/meeting-journal` (and optionally `/add-task` in the future) use this file to route action items to the right folder based on keyword matches. If no `organization.md` exists, commands fall back to the four-folder default and prompt the user when the folder is ambiguous.

The folder list below matches the four-folder default in [`.claude/rules/task-folders.md`](../../.claude/rules/task-folders.md). Add more folders as your workflow grows.

---

## Task Folders

### `tasks/_inbox/`
Quick capture when the category isn't clear. Default when no keyword matches.
**Keywords:** inbox, unsorted, triage

### `tasks/work/`
Work-related tasks.
**Keywords:** work, job, office, project, deadline, meeting, deliverable, client

### `tasks/personal/`
Home, errands, personal life.
**Keywords:** personal, home, errand, doctor, appointment, family, bill

### `tasks/ideas/`
Someday / maybe / exploratory.
**Keywords:** idea, someday, maybe, explore, concept, what-if, worth-trying

## Filing Rules

1. **Default to `_inbox/`** when no keyword matches. Sorting later is fine.
2. **First match wins** when a task's description hits keywords from multiple folders. Scan folders in the order listed above.
3. **Explicit user override always applies** — if the user names a folder (e.g., "add a work task"), skip keyword matching.
4. **Ask when genuinely ambiguous** — borderline items with strong signals in two categories warrant a quick clarifying question rather than a guess.

## Naming Conventions

- **Journal files:** `YYYY-MM-DD-DAY.md` (e.g., `2026-04-21-TUE.md`)
- **Task IDs:** `TASK-###` (zero-padded, sequential within each folder)
- **Task detail files (optional):** `tasks/<folder>/_details/TASK-###.md` — used when a task description outgrows its line in `tasks.md`

## Project-Scoped Overrides

When working in a project (`personal/projects/<name>/`), a project-specific `organization.md` in that project's folder takes precedence over the top-level one. Useful when a project needs different folders or keyword rules (e.g., a client engagement with its own task taxonomy).

## Adding Folders

To add a new folder — say, `tasks/followups/` for items that need a nudge later:

1. Add a new section under **Task Folders** with its purpose and keyword list.
2. Create the folder in `personal/tasks/` (or `personal/projects/<name>/tasks/`).
3. Add a `.gitkeep` file inside it so the folder persists in version control even when empty.

No other configuration is needed — commands read this file dynamically.
