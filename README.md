# AI Craftsman

Your ready-to-use Claude Code workspace. Clone it, open it, start creating.

---

## Quick Start

```bash
git clone https://github.com/JDWorkdog/ai-craftsman.git
cd ai-craftsman
```

Open in VS Code with Claude Code extension, then run any command:

```
/prd
/research
/brainstorm
```

That's it. Your outputs go to the `personal/` folder (or your active project folder).

---

## Available Commands

| Command | What It Does | Default Output |
|---------|--------------|----------------|
| `/prd` | Create a Product Requirements Document | `personal/drafts/` |
| `/research` | Research any topic with sources | `personal/research/` |
| `/prompt` | Build prompts for any AI system | `personal/prompts/` |
| `/extract-style` | Extract brand styles from PowerPoint | `personal/analysis/` |
| `/email` | Draft professional emails | (screen) |
| `/brainstorm` | Generate ideas with frameworks | `personal/brainstorms/` |
| `/add-task` | Quick task capture | `personal/tasks/` |
| `/user-story` | Write user stories with acceptance criteria | `personal/drafts/` |
| `/daily` | Daily journal and task logging | `personal/journal/` |
| `/repo-analysis` | Analyze a repository | `personal/projects/<repo-name>/` |

---

## Project Structure

```
ai-craftsman/
├── .claude/              # Claude Code configuration
│   ├── CLAUDE.md         # Workspace guide
│   └── commands/         # Slash commands
│
├── personal/             # All your work (gitignored)
│   ├── analysis/         # Style guides
│   ├── brainstorms/      # Brainstorming sessions
│   ├── drafts/           # PRDs, user stories
│   ├── journal/          # Daily journal
│   ├── prompts/          # Generated prompts
│   ├── research/         # Research reports
│   ├── tasks/            # Task lists
│   └── projects/         # Project workspaces
│       └── my-app/       #   Each subfolder is a project
│           ├── drafts/   #   Same structure as above
│           ├── research/
│           ├── tasks/
│           └── ...
│
├── temp-files/           # Input staging area (gitignored)
│
├── prompt-templates/     # Reference prompts (Claude/ChatGPT/Gemini)
├── guides/               # Role-based guides
├── resources/            # Getting started docs
├── claude-actions/       # For Claude.ai Projects
└── _examples/            # Sample file formats
```

---

## Features

### Project Workspaces

Organize your work into separate projects inside `personal/projects/`:

1. Create a project folder: `personal/projects/my-app/`
2. Tell Claude you're working on it: *"Let's work on the my-app project"*
3. All command output automatically saves to your project folder

Each project gets the same folder structure as `personal/` (drafts, research, tasks, etc.) - keeping everything for that project together in one place.

When no project is active, commands save to the default `personal/` subfolders.

### Temp Files

The `temp-files/` folder is an **input staging area**:
- Drop files here for Claude to process (PowerPoints, transcripts, data files)
- Contents are gitignored and safe to delete anytime
- Output is never written here - it always goes to `personal/` or your active project folder

### Auto-Journaling
Talk about your day - Claude logs it automatically. No need to run `/daily` explicitly.

### Task Management
Tasks are organized into 4 simple folders:
- `_inbox/` - Quick capture (default)
- `work/` - Work-related tasks
- `personal/` - Personal tasks
- `ideas/` - Someday/maybe items

### Private by Default
Everything in `personal/` and `temp-files/` is gitignored. Your work stays on your machine.

---

## Role-Based Guides

| Role | Guide | Best For |
|------|-------|----------|
| Product Manager | [PM Guide](guides/for-product-managers.md) | PRDs, user stories, release notes |
| Marketer | [Marketing Guide](guides/for-marketers.md) | Research, content, brainstorming |
| Engineer | [Engineering Guide](guides/for-engineers.md) | Prompt engineering, code generation |
| Sales | [Sales Guide](guides/for-sales.md) | Presentations, communication |

---

## What's Inside

### [Prompt Templates](prompt-templates/)
Universal prompts that work across multiple LLMs. Each includes versions for:
- **Claude** - Leveraging Claude's reasoning
- **ChatGPT** - Formatted for OpenAI
- **Gemini** - Adapted for Google

### [Claude Actions](claude-actions/)
Ready-to-use actions for Claude.ai Projects. No VS Code required - copy and paste into your Claude Project.

### [Resources](resources/)
- [Getting Started](resources/getting-started/) - Setup guides
- [Videos](resources/videos.md) - Tutorials
- [Articles](resources/articles.md) - Deep dives
- [Tools](resources/tools.md) - Useful utilities

---

## Upgrading from v1

If you were using the previous folder structure (`output/` and `projects/`), run these commands after pulling:

```bash
git pull

# Move your existing files
mv output/* personal/
mv projects/* personal/projects/

# Clean up old folders
rmdir output projects
```

If you haven't generated any files yet, `git pull` is all you need.

---

## Contributing

Found a great prompt? Have improvements? See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT License - see [LICENSE](LICENSE).

---

Made with AI by [Workdog](https://github.com/JDWorkdog)
