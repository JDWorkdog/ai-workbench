---
description: Four-folder task organization for /add-task
---

# Task Folders

Tasks are organized into four folders inside `personal/tasks/` (or `personal/projects/<name>/tasks/` when a project context is active):

| Folder | Purpose |
|---|---|
| `_inbox/` | Quick capture — default when the type isn't clear. Sort later. |
| `work/` | Work-related tasks |
| `personal/` | Personal tasks |
| `ideas/` | Someday/maybe items |

When invoked without a folder hint, `/add-task` writes to `_inbox/tasks.md`. Match the existing `tasks.md` format in the target folder — don't create new file structures inside these folders.
