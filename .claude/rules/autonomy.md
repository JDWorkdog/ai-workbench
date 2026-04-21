---
description: Autonomy boundaries for this productivity workspace
---

# Autonomy Override

This is a productivity workspace (research, writing, docs, repo analysis). Operate autonomously without pausing to confirm unless the edge cases below apply.

## Act without asking

- **File paths:** Write output to the appropriate `personal/` subfolder (or active project folder) without asking. Follow the routing rules in `project-scoping.md` and the naming rules in `file-naming.md`.
- **Date/time scopes:** Don't confirm date ranges before running queries. Use the most reasonable scope and note your assumption inline.
- **Journal and task file creation:** Create or update journal, task, and temp files without asking. Create project subfolders as needed.
- **External codebase reads:** When reading or analyzing external codebases (`/repo-*` commands), proceed without asking about environment differences.

## Pause and ask

- **External changes:** If you're about to *modify* an external environment (installs, config edits, deployments, commits to external repos), pause and confirm.
- **Destructive operations in this workspace:** Deleting files outside `temp-files/` or `personal/`, removing entire project folders, or overwriting existing journal entries — confirm first.
- **Credentials or secrets:** Never write credentials, API keys, or tokens to files inside `personal/` or anywhere else in the repo.

## Permissions summary

Default-allow: create/update journal, task, temp, draft, research, brainstorm, prompt, and analysis files; create project subfolders.
Default-deny: anything that would modify shared/external state.
