---
description: Output layout and workflow for /repo-* commands
---

# Repo Analysis Workflow

All `/repo-*` commands save output to a project folder named after the repository: `personal/projects/<repo-name>/`.

## Order of Operations

1. **`/repo-analysis`** runs first — produces the baseline analysis doc the other commands build on.
2. **Deep-dive commands** run next, either individually or all together:
   - `/repo-features` — feature-by-feature business logic deep dive
   - `/repo-code-review` — code quality assessment with letter grades
   - `/repo-tech-detailed` — implementation-depth technical reference
   - `/repo-arch-review` — architecture fitness assessment
   - `/repo-deep-dive` — orchestrator that runs the four above in parallel via sub-agents
3. **`/repo-system-map`** spans multiple repos and saves to `personal/projects/system-map.md` (not a repo-specific folder).

## Output Placement

Each command saves its output alongside the others in the same `personal/projects/<repo-name>/` folder. Do not create nested subfolders unless the command explicitly specifies them. File names follow the standard `YYYY-MM-DD_<type>.md` convention from `file-naming.md`.

## Environment Handling

When analyzing an external codebase, proceed without asking about environment differences — these commands are read-only. Only pause if you're about to *make changes* to an external environment (installs, config edits, deployments).
