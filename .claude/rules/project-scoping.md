---
description: How command output routes to project folders when a project context is active
---

# Project-Scoped Output

Projects live inside `personal/projects/`. Each subfolder is a self-contained project workspace.

## The Rule

When the user establishes a project context (e.g., "I'm working on the my-app project" or "let's work in `personal/projects/my-app`"), save all command output to that project's folder instead of the top-level `personal/` subfolders.

| Command | Project-scoped output path |
|---|---|
| `/prd` | `personal/projects/<name>/drafts/YYYY-MM-DD_feature_prd.md` |
| `/research` | `personal/projects/<name>/research/YYYY-MM-DD_topic_research.md` |
| `/brainstorm` | `personal/projects/<name>/brainstorms/YYYY-MM-DD_topic_brainstorm.md` |
| `/add-task` | `personal/projects/<name>/tasks/<folder>/tasks.md` |
| `/daily` | `personal/projects/<name>/journal/YYYY-MM-DD-DAY.md` |
| `/prompt` | `personal/projects/<name>/prompts/YYYY-MM-DD_topic_prompt.md` |
| `/user-story` | `personal/projects/<name>/drafts/YYYY-MM-DD_feature_user-stories.md` |
| `/extract-style` | `personal/projects/<name>/analysis/<company>-style-guide.json` |
| `/handover` | `personal/projects/<name>/docs/HANDOVER.md` |

When no project context is set, commands save to the default `personal/` subfolders.

## Creating a New Project

Subfolders are created automatically as needed when commands run. The standard layout mirrors `personal/` itself:

```
personal/projects/<name>/
├── analysis/
├── brainstorms/
├── docs/
├── drafts/
├── journal/
├── prompts/
├── research/
└── tasks/
```

## Repo Analysis Projects

When `/repo-analysis` is run, create a project folder named after the repository (e.g., `personal/projects/<repo-name>/`) and save the output there. Deep-dive commands (`/repo-features`, `/repo-code-review`, `/repo-tech-detailed`, `/repo-arch-review`) build on existing analysis docs — run `/repo-analysis` first, then those individually or via `/repo-deep-dive` in parallel. The `/repo-system-map` command maps across multiple repos and saves to `personal/projects/system-map.md`.
