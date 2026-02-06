# AI Craftsman Workspace

A productivity workspace for Claude Code. Use slash commands to create PRDs, research topics, draft emails, brainstorm, and more.

## Commands

| Command | Purpose | Default Output |
|---------|---------|----------------|
| `/prd` | Create Product Requirements Documents | `output/drafts/` |
| `/research` | Research any topic | `output/research/` |
| `/prompt` | Build AI prompts | `output/prompts/` |
| `/extract-style` | Extract brand styles | `output/analysis/` |
| `/email` | Draft professional emails | (screen) |
| `/brainstorm` | Generate ideas | `output/brainstorms/` |
| `/add-task` | Quick task capture | `output/tasks/` |
| `/user-story` | Write user stories | `output/drafts/` |
| `/daily` | Daily journal | `output/journal/` |

## Output Folder

All generated content lives in `output/` by default. This folder is gitignored so your work stays private.

- `research/` - Research reports
- `drafts/` - PRDs, user stories, documents
- `prompts/` - Saved AI prompts
- `brainstorms/` - Brainstorming sessions
- `tasks/` - Task lists (inbox, work, personal, ideas)
- `journal/` - Daily entries
- `analysis/` - Style guides

## Projects Folder

The `projects/` folder organizes work into separate project workspaces. Each subfolder is a self-contained project.

### How It Works

- Create a subfolder for each project: `projects/my-app/`, `projects/client-website/`, etc.
- When working in a project context, **all command output goes into the project folder** instead of the top-level `output/` folder
- Each project folder uses the same subfolder structure as `output/` (drafts/, research/, tasks/, etc.)

### Project-Scoped Output Rule

**When the user establishes a project context** (e.g., "I'm working on the my-app project" or "let's work in projects/my-app"), save all command output to that project's folder:

- `/prd` → `projects/my-app/drafts/YYYY-MM-DD_feature_prd.md`
- `/research` → `projects/my-app/research/YYYY-MM-DD_topic_research.md`
- `/brainstorm` → `projects/my-app/brainstorms/YYYY-MM-DD_topic_brainstorm.md`
- `/add-task` → `projects/my-app/tasks/[folder]/tasks.md`
- `/daily` → `projects/my-app/journal/YYYY-MM-DD-DAY.md`
- `/prompt` → `projects/my-app/prompts/YYYY-MM-DD_topic_prompt.md`
- `/user-story` → `projects/my-app/drafts/YYYY-MM-DD_feature_user-stories.md`
- `/extract-style` → `projects/my-app/analysis/[company]-style-guide.json`

**When no project context is set**, commands save to the default `output/` folder as usual.

### Creating a New Project

Create the project folder and subfolders are created automatically as needed when commands run. Example:
```
projects/my-app/
├── drafts/           # PRDs, user stories
├── research/         # Research reports
├── prompts/          # Generated prompts
├── brainstorms/      # Brainstorming sessions
├── tasks/            # Task lists
├── journal/          # Daily journal for this project
└── analysis/         # Style guides
```

## Temp Files Folder

The `temp-files/` folder is a staging area for temporary files:

- Drop files here for Claude to process (e.g., a PowerPoint for `/extract-style`, a transcript for `/meeting-summary`)
- Contents are gitignored and safe to delete anytime
- Claude can read from and write to this folder without asking
- Clean up periodically - nothing here is permanent

## Task Folders

Tasks are organized into 4 simple folders (inside `output/tasks/` or `projects/<name>/tasks/`):
- `_inbox/` - Quick capture, sort later (default)
- `work/` - Work-related tasks
- `personal/` - Personal tasks
- `ideas/` - Someday/maybe items

## Auto-Journaling

When you talk about your day - accomplishments, tasks, plans - Claude automatically logs it to your journal. You don't need to run `/daily` explicitly. Journal entries go to the active project's journal folder if a project context is set, otherwise to `output/journal/`.

## File Naming

- Journal: `YYYY-MM-DD-DAY.md` (e.g., `2025-01-15-WED.md`)
- Other files: `YYYY-MM-DD_topic_type.md` (e.g., `2025-01-15_user-auth_prd.md`)

## Permissions

Claude can create and update journal, task, and temp files without asking. Claude can also create project subfolders as needed. This keeps the flow smooth for daily capture.

## Reference Materials

- `/prompts/` - Universal prompts for Claude, ChatGPT, Gemini
- `/guides/` - Role-based starting points
- `/resources/` - Getting started docs
- `/_examples/` - Sample file formats
