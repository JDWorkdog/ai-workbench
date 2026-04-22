# AI Workbench Workspace

A productivity workspace for Claude Code. Slash commands generate PRDs, research, emails, brainstorms, code reviews, and more. All output lands in `personal/` (gitignored) or the active project folder.

## Commands

### Productivity
| Command | Purpose | Default output |
|---|---|---|
| `/prd` | Product Requirements Documents | `personal/drafts/` |
| `/user-story` | User stories with acceptance criteria | `personal/drafts/` |
| `/research` | Research any topic with sources | `personal/research/` |
| `/brainstorm` | Generate ideas with frameworks | `personal/brainstorms/` |
| `/prompt` | Build/refine AI prompts | `personal/prompts/` |
| `/email` | Draft professional emails | (screen) |
| `/extract-style` | Extract brand styles from PowerPoint | `personal/analysis/` |
| `/add-task` | Quick task capture | `personal/tasks/` |
| `/daily` | Daily journal entry | `personal/journal/` |
| `/meeting-summary` | Summarize a meeting transcript | (screen) |
| `/meeting-journal` | Log meeting items to today's journal | `personal/journal/` |
| `/morning-sync` | Pull overnight activity from Gmail/Calendar/Granola/Slack and update today's journal | `personal/journal/` |
| `/evening-sync` | Wrap today — log meetings, outgoing email, Slack activity, pending for tomorrow | `personal/journal/` |
| `/handover` | Session handover doc for continuity | `personal/docs/HANDOVER.md` |

### Repo Analysis
Run `/repo-analysis` first. Then use any deep-dive individually, or `/repo-deep-dive` to run them all in parallel.

| Command | Purpose |
|---|---|
| `/repo-analysis` | Baseline repository analysis |
| `/repo-features` | Feature-by-feature deep dive |
| `/repo-code-review` | Code quality assessment with letter grades |
| `/repo-tech-detailed` | Implementation-depth technical reference |
| `/repo-arch-review` | Architecture fitness assessment |
| `/repo-deep-dive` | Runs the four deep-dives in parallel via sub-agents |
| `/repo-system-map` | Cross-repo system map |

### Claude Code / AI Ops
| Command | Purpose | Default output |
|---|---|---|
| `/claude-md-review` | Audit a project's Claude Code config and report findings | `personal/drafts/` |
| `/claude-md-refresh` | Audit **and** execute a config refactor (moves, modernizations, cleanups) with backups | target project |
| `/ai-news-digest` | Daily Anthropic/OpenAI/Google release digest + draft X posts | `personal/journal/` |
| `/claude-code-news` | Claude Code–specific release check (last 24h) | `personal/journal/` |

## personal/ Folder

All generated content lives here. Gitignored. Subfolders:

- `agendas/` — meeting agendas
- `analysis/` — style guides
- `brainstorms/` — brainstorm sessions
- `docs/` — plans, handover docs
- `drafts/` — PRDs, user stories
- `journal/` — daily entries
- `projects/` — project-scoped workspaces (see `.claude/rules/project-scoping.md`)
- `prompts/`, `research/`, `tasks/` — self-explanatory

## Core Rules

Detailed rules live in `.claude/rules/` so this file stays lean. Load them when relevant:

- **`project-scoping.md`** — how command output routes when a project context is active
- **`file-naming.md`** — `YYYY-MM-DD-DAY.md` for journals, `YYYY-MM-DD_topic_type.md` for everything else
- **`task-folders.md`** — `_inbox/`, `work/`, `personal/`, `ideas/`
- **`repo-analysis.md`** — `/repo-*` output layout and ordering
- **`autonomy.md`** — what to do without asking; when to pause

Optional user-configurable files (templates in [`_examples/`](../_examples/)):

- **`personal/tags.md`** — auto-hashtag rules + people/customers/projects for `[[wiki-links]]`. Used by `/meeting-journal`. Without it, only `#meeting` is applied and names stay plain.
- **`personal/organization.md`** — keyword-to-task-folder routing. Used by `/meeting-journal`. Without it, action items default to `tasks/_inbox/`.

## Automation

- **Auto-journaling** runs as a `UserPromptSubmit` hook (`.claude/hooks/auto-journal-detect.sh`). When your prompt reads like day-talk, Claude gets a reminder to append to today's journal — you don't need to run `/daily` explicitly.
- **Scheduled journaling** — `/morning-sync` and `/evening-sync` can be scheduled via Claude Code Desktop to keep the journal current automatically. See [`resources/getting-started/setup-scheduled-journaling.md`](../resources/getting-started/setup-scheduled-journaling.md).
- **Temp files** (`temp-files/`, gitignored) are an *input* staging area for files to process (PowerPoints, transcripts). Never write output there.

## Reference

- `prompt-templates/` — universal prompts for Claude, ChatGPT, Gemini
- `guides/` — role-based starting points
- `resources/` — getting-started docs
- `_examples/` — sample file formats
