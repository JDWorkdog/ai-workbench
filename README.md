# AI Workbench

Your ready-to-use Claude Code workspace. Clone it, open it, start creating.

---

## Quick Start

```bash
git clone https://github.com/JDWorkdog/ai-workbench.git
cd ai-workbench
```

Open in VS Code with the Claude Code extension, then run a command:

```
/prd
/research
/brainstorm
```

Output lands in the gitignored `personal/` folder — your work stays on your machine.

---

## What's Inside

- **~20 slash commands** for PRDs, research, brainstorms, emails, code reviews, repo analysis, release-tracking, and more. See [`.claude/CLAUDE.md`](.claude/CLAUDE.md) for the full command list.
- **Project workspaces** — tell Claude "I'm working on *my-app*" and every command's output routes to `personal/projects/my-app/` automatically.
- **Auto-journaling** — talk about your day and today's journal entry gets updated without you running `/daily`.
- **Private by default** — everything in `personal/` and `temp-files/` is gitignored.
- **Idiomatic Claude Code setup** — rules in `.claude/rules/`, commands in `.claude/commands/`, hooks in `.claude/settings.json`, optional skills/agents folders ready for expansion.

---

## Folder Map

```
.claude/        Claude Code config (commands, rules, hooks, skills, agents)
personal/       Your work (gitignored)
  projects/       One subfolder per project
temp-files/     Input staging area (gitignored)
prompt-templates/  Universal prompts for Claude, ChatGPT, Gemini
guides/         Role-based starting points
resources/      Setup and learning docs
claude-actions/ Ready-to-paste actions for Claude.ai Projects
_examples/      Sample file formats
```

---

## Role-Based Guides

| Role | Guide | Best For |
|---|---|---|
| Product Manager | [PM Guide](guides/for-product-managers.md) | PRDs, user stories, release notes |
| Marketer | [Marketing Guide](guides/for-marketers.md) | Research, content, brainstorming |
| Engineer | [Engineering Guide](guides/for-engineers.md) | Prompt engineering, code generation |
| Sales | [Sales Guide](guides/for-sales.md) | Presentations, communication |

---

## Related Resources

- [Prompt Templates](prompt-templates/) — cross-LLM prompt library (Claude, ChatGPT, Gemini)
- [Claude Actions](claude-actions/) — copy-paste instructions for Claude.ai Projects
- [Resources](resources/) — [getting started](resources/getting-started/), [videos](resources/videos.md), [articles](resources/articles.md), [tools](resources/tools.md)

---

## Local Customization

Two files are gitignored so you can customize without leaking config:

- `.claude/settings.local.json` — copy from [`.claude/settings.local.example.json`](.claude/settings.local.example.json) and add permission allowlists or env overrides.
- `.mcp.json` — copy from [`.mcp.json.example`](.mcp.json.example) and register your MCP servers (Intercom, Slack, Playwright, etc.).

---

## Contributing

Found a great prompt? Have improvements? See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).

---

Made with AI by [Workdog](https://github.com/JDWorkdog)
