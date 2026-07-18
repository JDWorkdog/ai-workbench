# AI Workbench Workspace

A productivity workspace for AI coding assistants. Slash commands and skills create PRDs, research topics, draft emails, brainstorm ideas, keep a journal that answers questions years later, and route work to the right model tier.

This file is the canonical workspace guide for every assistant that works here. Codex reads it natively; Claude Code reads it through the import in `CLAUDE.md`. Make workspace-rule changes here and only here. New to the workspace? Start with `ONBOARDING.md`, or run `/setup` for a guided first-run configuration.

## Writing Style Rules

- **Never use em dashes or en dashes in any writing or output.** Use commas, colons, parentheses, or restructure the sentence instead. This applies to all drafts, documents, emails, and content. (House rule, enforced by `scripts/check-ai-harness-rules.py` on this file and `CLAUDE.md`. If you want dashes back, delete this rule and stop running the check.)

## Commands and Skills

| Command | Purpose | Default Output |
|---------|---------|----------------|
| `/setup` | First-run setup: pick runtimes, personalize settings, walk the connector checklist (skill) | `personal/docs/` |
| `/prd` | Create Product Requirements Documents | `personal/drafts/` |
| `/user-story` | Write user stories with acceptance criteria | `personal/drafts/` |
| `/research` | Research any topic with sources | `personal/research/` |
| `/brainstorm` | Generate ideas | `personal/brainstorms/` |
| `/prompt` | Build AI prompts | `personal/prompts/` |
| `/email` | Draft professional emails | (screen) |
| `/extract-style` | Extract brand styles from a deck | `personal/analysis/` |
| `/add-task` | Quick task capture | `personal/tasks/` |
| `/daily` | Daily journal | `personal/journal/<year>/` |
| `/meeting-summary` | Summarize meeting transcripts into action items | (screen) |
| `/meeting-journal` | Process a meeting transcript and log key items to the daily journal | `personal/journal/<year>/` |
| `/journal-rollup` | Generate or regenerate a monthly journal rollup | `personal/journal/rollups/` |
| `/recall` | Answer "when did we meet X / what did we promise Y" from dossiers, rollups, and dailies (skill) | (screen) |
| `/handover` | Generate session handover doc for continuity | `personal/docs/HANDOVER.md` |
| `/share-doc` | Convert a markdown file to .docx (or .pdf with `--pdf`) for non-technical readers | Same folder as source `.md` |
| `/code-review` | Deep line-by-line code review with numbered findings | `personal/projects/<name>/` |
| `/harness-review` | Review assistant config (instruction files, rules, hooks) and recommend improvements | `personal/drafts/` |
| `/claude-md-refresh` | Audit and execute a Claude Code config refactor (moves, modernizations) with backups | target project |
| `/tune-my-harness` | Install or upgrade the model-routing and delegation layer in any project (skill) | target project |
| `/ai-news-digest` | Daily AI vendor release digest | `personal/journal/<year>/` |

### Repo Analysis

Run `/repo-analysis` first; the deep dives build on its output.

| Command | Purpose |
|---------|---------|
| `/repo-analysis` | Baseline repository analysis |
| `/repo-features` | Feature-by-feature deep dive (business rules, data model, lifecycles) |
| `/repo-code-review` | Code quality assessment with letter grades |
| `/repo-tech-detailed` | Implementation-depth technical reference |
| `/repo-arch-review` | Architecture fitness assessment |
| `/repo-deep-dive` | Run the four deep dives in parallel via sub-agents |
| `/repo-system-map` | Cross-repo system map |

All repo output goes to `personal/projects/<repo-name>/`.

## Model Routing

The frontier model is the manager, not the typist. A five-role delegation roster with pinned models ships in both runtimes (`.claude/agents/` for Claude Code, `.codex/agents/` plus `--profile luna|terra|sol` for Codex). Route by what failure costs, not by what the task is called, and consult this table before doing expensive work inline:

| Task class | Route to | Claude tier | Codex tier |
|---|---|---|---|
| Fetch, post, download, status checks (no judgment) | fetcher | haiku | gpt-5.6-luna |
| Summarize transcripts, threads, logs, rollups | summarizer | haiku | gpt-5.6-luna |
| Scoped, well-specified change with acceptance criteria | implementer | sonnet | gpt-5.6-terra |
| Review of completed work (standard risk) | qa-reviewer | sonnet | gpt-5.6-terra |
| Design, decomposition, risky diffs, final verification | architect or main session | frontier | gpt-5.6-sol |

Standing rules:

- **Escalation**: anything touching auth, payments, data deletion, or an action that is hard to reverse goes to the frontier tier regardless of size. When unsure which tier, use the frontier one.
- **No self-certification**: work from a cheaper tier counts as done only after a hard check passes (tests, schema, validator) or a frontier-tier review accepts it.
- **Delegation has overhead**: for a one-shot small task in an already-warm session, doing it inline is often cheaper than spawning a worker. Delegate for bulk, parallelism, context isolation, or a genuinely cheaper tier.
- The full method, including the cross-vendor QA protocol, lives in `guides/model-routing-guide.md`.

## QA Policy

Cross-vendor review (Claude implements, Codex reviews, or the reverse) is off by default; it roughly doubles spend on the reviewed change. Flip a class to `cross-vendor` to require it; the orchestrator checks this table before calling any change in a listed class done.

| Change class | Review level |
|---|---|
| Shipping code (merged to a shared branch or deployed) | same-vendor |
| Customer-facing documents | same-vendor |
| Config and infrastructure changes | same-vendor |
| Internal docs, journals, agendas | none beyond author checks |

`same-vendor` means a qa-reviewer pass in the same tool. `cross-vendor` means the other vendor's reviewer role gets the diff and a review-request note, findings come back numbered, and disagreements are settled by a test, not a third opinion.

## AI Harness Checks

Run these checks after changing workspace instructions or shared skills:

```bash
python3 scripts/check-ai-harness-rules.py
./scripts/sync-codex-skills.sh --check
```

`.claude/skills/` is the canonical home for every skill; `.agents/skills/` is the synchronized Codex mirror. Run `./scripts/sync-codex-skills.sh --write` after editing any skill. Never hand-edit the mirror.

## Personal Folder

All generated content lives in `personal/`. This folder is gitignored so your work stays private.

- `accounts/` - Account dossiers (append-only running record per company or initiative)
- `agendas/` - Meeting agendas
- `analysis/` - Style guides
- `brainstorms/` - Brainstorming sessions
- `docs/` - Plans, handover docs, and other project docs
- `drafts/` - PRDs, user stories, documents
- `journal/` - Daily entries in year folders (`journal/2026/`), monthly `rollups/`, and `SCHEMA.md` (the canonical journal spec)
- `people/` - Person dossiers (meetings, commitments both ways, open threads)
- `prompts/` - Generated AI prompts
- `research/` - Research reports
- `resources/` - Your personal config (`tags.md`, `organization.md`); templates in `resources/_examples/`
- `tasks/` - Task lists (`_inbox/`, `work/`, `personal/`, `ideas/`)
- `projects/` - Project-scoped workspaces (see below)

## Projects

Projects live inside `personal/projects/`, one self-contained subfolder each. When the user establishes a project context ("I'm working on the my-app project"), all command output goes into that project's folder using the same subfolder structure (`drafts/`, `research/`, `tasks/`, `journal/`, and so on). When no project context is set, commands save to the default `personal/` subfolders. Details: `.claude/rules/project-scoping.md`.

## Temp Files Folder

`temp-files/` is an input staging area only: drop files there for processing (decks, transcripts, data). Contents are gitignored and safe to delete. Never write output there; output goes to `personal/` or the active project folder.

## Journaling

When the user talks about their day, log it to the journal automatically; no explicit `/daily` needed (a `UserPromptSubmit` hook reminds the assistant). The journal system (daily schema and frontmatter, year folders, monthly rollups, entity dossiers) is defined in `personal/journal/SCHEMA.md`; that file is the single source of truth for every journal writer and reader. The scheduled pipeline that writes the journal automatically is documented in `guides/journaling-guide.md`. Use `/recall` to answer history questions instead of loading journal files directly.

## File Naming

- Journal: `YYYY-MM-DD-DAY.md` (e.g., `2026-01-15-WED.md`), filed under the matching year folder (`personal/journal/2026/`)
- Other files: `YYYY-MM-DD_topic_type.md` (e.g., `2026-01-15_user-auth_prd.md`)
- Verify dates per `.claude/rules/date-verification.md` before writing any dated file. Never guess dates.

## Core Rules

Detailed rules live in `.claude/rules/`; load them when relevant: `project-scoping.md`, `file-naming.md`, `date-verification.md`, `task-folders.md`, `repo-analysis.md`, `autonomy.md`.

## Permissions and Autonomy

This is a productivity workspace (research, writing, docs). Operate autonomously without pausing to confirm: create and update journal, task, dossier, and temp files without asking; create project subfolders as needed; pick reasonable date scopes and note the assumption. Pause only before destructive actions, outward-facing actions (sending, publishing, pushing), or changes to an external environment.

## Reference Materials

- `guides/` - Role-based starting points, the model-routing guide, and the journaling guide
- `prompt-templates/` - Universal prompts for Claude, ChatGPT, Gemini
- `resources/` - Getting-started docs and sample file formats (`resources/_examples/`)
- `claude-actions/` - Copy-paste actions for Claude.ai Projects (no IDE required)
