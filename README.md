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

That's it. Your outputs go to the `output/` folder (or your active project folder).

---

## Available Commands

| Command | What It Does | Default Output |
|---------|--------------|----------------|
| `/prd` | Create a Product Requirements Document | `output/drafts/` |
| `/research` | Research any topic with sources | `output/research/` |
| `/prompt` | Build prompts for any AI system | `output/prompts/` |
| `/extract-style` | Extract brand styles from PowerPoint | `output/analysis/` |
| `/email` | Draft professional emails | (screen) |
| `/brainstorm` | Generate ideas with frameworks | `output/brainstorms/` |
| `/add-task` | Quick task capture | `output/tasks/` |
| `/user-story` | Write user stories with acceptance criteria | `output/drafts/` |
| `/daily` | Daily journal and task logging | `output/journal/` |

---

## Project Structure

```
ai-craftsman/
├── .claude/              # Claude Code configuration
│   ├── CLAUDE.md         # Workspace guide
│   └── commands/         # Slash commands
│
├── output/               # Your work (gitignored)
│   ├── research/         # Research reports
│   ├── drafts/           # PRDs, user stories
│   ├── prompts/          # Generated prompts
│   ├── brainstorms/      # Brainstorming sessions
│   ├── tasks/            # Task lists
│   ├── journal/          # Daily journal
│   └── analysis/         # Style guides
│
├── projects/             # Project workspaces (gitignored)
│   └── my-app/           # Example: each subfolder is a project
│       ├── drafts/       #   Same structure as output/
│       ├── research/
│       ├── tasks/
│       └── ...
│
├── temp-files/           # Temporary staging area (gitignored)
│
├── prompts/              # Reference prompts (Claude/ChatGPT/Gemini)
├── guides/               # Role-based guides
├── resources/            # Getting started docs
├── claude-actions/       # For Claude.ai Projects
└── _examples/            # Sample file formats
```

---

## Features

### Project Workspaces

Organize your work into separate projects inside the `projects/` folder:

1. Create a project folder: `projects/my-app/`
2. Tell Claude you're working on it: *"Let's work on the my-app project"*
3. All command output automatically saves to your project folder

Each project gets the same folder structure as `output/` (drafts, research, tasks, etc.) - keeping everything for that project together in one place.

When no project is active, commands save to the default `output/` folder as usual.

### Temp Files

The `temp-files/` folder is a staging area for temporary files:
- Drop files here for Claude to process (PowerPoints, transcripts, data files)
- Contents are gitignored and safe to delete anytime
- Nothing here is permanent - clean up whenever you want

### Auto-Journaling
Talk about your day - Claude logs it automatically. No need to run `/daily` explicitly.

### Task Management
Tasks are organized into 4 simple folders:
- `_inbox/` - Quick capture (default)
- `work/` - Work-related tasks
- `personal/` - Personal tasks
- `ideas/` - Someday/maybe items

### Private by Default
Everything in `output/`, `projects/`, and `temp-files/` is gitignored. Your work stays on your machine.

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

### [Prompts](prompts/)
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

## Contributing

Found a great prompt? Have improvements? See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT License - see [LICENSE](LICENSE).

---

Made with AI by [Workdog](https://github.com/JDWorkdog)
