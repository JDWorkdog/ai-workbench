# AI Workbench Workspace

A productivity workspace for Claude Code. Use slash commands to create PRDs, research topics, draft emails, brainstorm, and more.

## Commands

| Command | Purpose | Default Output |
|---------|---------|----------------|
| `/prd` | Create Product Requirements Documents | `personal/drafts/` |
| `/research` | Research any topic | `personal/research/` |
| `/prompt` | Build AI prompts | `personal/prompts/` |
| `/extract-style` | Extract brand styles | `personal/analysis/` |
| `/email` | Draft professional emails | (screen) |
| `/brainstorm` | Generate ideas | `personal/brainstorms/` |
| `/add-task` | Quick task capture | `personal/tasks/` |
| `/user-story` | Write user stories | `personal/drafts/` |
| `/daily` | Daily journal | `personal/journal/` |
| `/code-review` | Deep line-by-line code review with numbered findings and code snippets | `personal/projects/<name>/` |
| `/meeting-summary` | Summarize meeting transcripts into action items | (screen) |
| `/handover` | Generate session handover doc for continuity | `docs/HANDOVER.md` |
| `/repo-analysis` | Analyze a repository | `personal/projects/<repo-name>/` |
| `/repo-features` | Feature-by-feature deep dive (business rules, data model, state lifecycles) | `personal/projects/<repo-name>/` |
| `/repo-code-review` | Comprehensive code quality assessment with A-F grades | `personal/projects/<repo-name>/` |
| `/repo-tech-detailed` | Implementation-depth technical reference (schemas, APIs, auth flows) | `personal/projects/<repo-name>/` |
| `/repo-arch-review` | Evaluative architecture fitness assessment with recommendations | `personal/projects/<repo-name>/` |
| `/repo-deep-dive` | Run all deep-dive analyses in parallel via sub-agents | `personal/projects/<repo-name>/` |
| `/repo-system-map` | Cross-repo system map showing how repos form one platform | `personal/projects/` |

## Personal Folder

All generated content lives in `personal/`. This folder is gitignored so your work stays private.

- `analysis/` - Style guides
- `brainstorms/` - Brainstorming sessions
- `drafts/` - PRDs, user stories, documents
- `journal/` - Daily entries
- `prompts/` - Generated AI prompts
- `research/` - Research reports
- `tasks/` - Task lists (inbox, work, personal, ideas)
- `projects/` - Project-scoped workspaces (see below)

## Projects

Projects live inside `personal/projects/`. Each subfolder is a self-contained project workspace.

### How It Works

- Create a subfolder for each project: `personal/projects/my-app/`, `personal/projects/client-website/`, etc.
- When working in a project context, **all command output goes into the project folder** instead of the top-level `personal/` subfolders
- Each project folder uses the same subfolder structure (drafts/, research/, tasks/, etc.)

### Project-Scoped Output Rule

**When the user establishes a project context** (e.g., "I'm working on the my-app project" or "let's work in personal/projects/my-app"), save all command output to that project's folder:

- `/prd` → `personal/projects/my-app/drafts/YYYY-MM-DD_feature_prd.md`
- `/research` → `personal/projects/my-app/research/YYYY-MM-DD_topic_research.md`
- `/brainstorm` → `personal/projects/my-app/brainstorms/YYYY-MM-DD_topic_brainstorm.md`
- `/add-task` → `personal/projects/my-app/tasks/[folder]/tasks.md`
- `/daily` → `personal/projects/my-app/journal/YYYY-MM-DD-DAY.md`
- `/prompt` → `personal/projects/my-app/prompts/YYYY-MM-DD_topic_prompt.md`
- `/user-story` → `personal/projects/my-app/drafts/YYYY-MM-DD_feature_user-stories.md`
- `/extract-style` → `personal/projects/my-app/analysis/[company]-style-guide.json`

**When no project context is set**, commands save to the default `personal/` subfolders.

### Creating a New Project

Create the project folder and subfolders are created automatically as needed when commands run. Example:
```
personal/projects/my-app/
├── drafts/           # PRDs, user stories
├── research/         # Research reports
├── prompts/          # Generated prompts
├── brainstorms/      # Brainstorming sessions
├── tasks/            # Task lists
├── journal/          # Daily journal for this project
└── analysis/         # Style guides
```

### Repo Analysis Projects

When `/repo-analysis` is run, create a project folder named after the repository (e.g., `personal/projects/<repo-name>/`) and save the output there.

The deep-dive commands (`/repo-features`, `/repo-code-review`, `/repo-tech-detailed`, `/repo-arch-review`) build on existing analysis docs. Run `/repo-analysis` first, then either run deep-dive commands individually or use `/repo-deep-dive` to run all 4 in parallel via sub-agents. Each command saves its output alongside the original docs in the same project folder. The `/repo-system-map` command maps across multiple repos and saves to `personal/projects/system-map.md`.

## Temp Files Folder

The `temp-files/` folder is an **input staging area only**:

- Drop files here for Claude to process (e.g., a PowerPoint for `/extract-style`, a transcript for `/meeting-summary`)
- Contents are gitignored and safe to delete anytime
- Claude can read from this folder without asking
- **Do NOT write output files here** — all output goes to `personal/` or the active project folder
- Clean up periodically - nothing here is permanent

## Task Folders

Tasks are organized into 4 simple folders (inside `personal/tasks/` or `personal/projects/<name>/tasks/`):
- `_inbox/` - Quick capture, sort later (default)
- `work/` - Work-related tasks
- `personal/` - Personal tasks
- `ideas/` - Someday/maybe items

## Auto-Journaling

When you talk about your day - accomplishments, tasks, plans - Claude automatically logs it to your journal. You don't need to run `/daily` explicitly. Journal entries go to the active project's journal folder if a project context is set, otherwise to `personal/journal/`.

## File Naming

- Journal: `YYYY-MM-DD-DAY.md` (e.g., `2025-01-15-WED.md`)
- Other files: `YYYY-MM-DD_topic_type.md` (e.g., `2025-01-15_user-auth_prd.md`)

## Permissions

Claude can create and update journal, task, and temp files without asking. Claude can also create project subfolders as needed. This keeps the flow smooth for daily capture.

## Autonomy Override

This is a productivity workspace (research, writing, docs). Operate autonomously without pausing to confirm unless noted below.

- **Environment mismatches**: When reading or analyzing external codebases (e.g., `/repo-*` commands), proceed without asking about environment differences. Only pause and ask if you are about to **make changes** to an external environment (installs, config edits, deployments).
- **Date/time scopes**: Do not confirm date ranges before running queries. Use the most reasonable scope and note your assumption.
- **File paths**: Write output to the appropriate `personal/` subfolder (or active project folder) without asking. Follow the file naming and project-scoped output rules above.

## Reference Materials

- `/prompt-templates/` - Universal prompts for Claude, ChatGPT, Gemini
- `/guides/` - Role-based starting points
- `/resources/` - Getting started docs
- `/_examples/` - Sample file formats
