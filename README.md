# AI Workbench

A ready-to-use workspace for AI coding assistants. Clone it, open it in Claude Code or Codex (or both), start creating.

---

## Quick Start

```bash
git clone https://github.com/JDWorkdog/ai-workbench.git
cd ai-workbench
```

Open the folder in your assistant and run:

```
/setup
```

The setup skill asks whether you use Claude Code, Codex, or both, tailors the workspace accordingly, and walks you through local settings and connectors. Then try a command:

```
/prd
/research
/brainstorm
```

Output lands in the gitignored `personal/` folder, so your work stays on your machine.

---

## What's Inside

- **One canonical guide for both runtimes.** `AGENTS.md` holds every workspace rule; Codex reads it natively and Claude Code imports it through `CLAUDE.md`. One home per rule, no drift.
- **20+ slash commands** for PRDs, research, brainstorms, emails, code reviews, repo analysis, and more. The full table lives in [`AGENTS.md`](AGENTS.md).
- **Skills both tools share.** Capabilities are written once under `.claude/skills/` and mirrored to `.agents/skills/` for Codex by `scripts/sync-codex-skills.sh`. Shipped: `setup`, `recall`, `tune-my-harness`.
- **A model-routing layer.** A five-role delegation roster with pinned models (`.claude/agents/` and `.codex/agents/`), a routing table, and a QA policy, so frontier models manage and cheap tiers do the mechanical work. Method in [`guides/model-routing-guide.md`](guides/model-routing-guide.md).
- **A journal that answers questions years later.** Dailies with searchable frontmatter, monthly rollups, entity dossiers, and a scheduled pipeline that writes it all for you. Spec in `personal/journal/SCHEMA.md`, setup in [`guides/journaling-guide.md`](guides/journaling-guide.md), history questions via `/recall`.
- **Project workspaces.** Tell the assistant "I'm working on my-app" and every command's output routes to `personal/projects/my-app/` automatically.
- **Private by default.** Everything in `personal/` and `temp-files/` is gitignored.

---

## Folder Map

```
AGENTS.md          Canonical workspace guide (both runtimes read it)
CLAUDE.md          Thin Claude Code entry point (imports AGENTS.md)
.claude/           Claude Code config (commands, skills, agents, rules, hooks)
.codex/            Codex config (tier profiles, delegation roster)
.agents/skills/    Codex skill mirror (generated; never hand-edit)
scripts/           Harness checks and the skill sync script
personal/          Your work (gitignored except journal/SCHEMA.md)
  journal/           Dailies in year folders, rollups/, SCHEMA.md
  people/ accounts/  Entity dossiers
  projects/          One subfolder per project
temp-files/        Input staging area (gitignored)
guides/            Role guides, model-routing guide, journaling guide
prompt-templates/  Universal prompts for Claude, ChatGPT, Gemini
resources/         Setup docs, learning links, sample formats (_examples/)
claude-actions/    Ready-to-paste actions for Claude.ai Projects
```

---

## Role-Based Guides

| Role | Guide | Best For |
|---|---|---|
| Product Manager | [PM Guide](guides/for-product-managers.md) | PRDs, user stories, release notes |
| Marketer | [Marketing Guide](guides/for-marketers.md) | Research, content, brainstorming |
| Engineer | [Engineering Guide](guides/for-engineers.md) | Prompt engineering, code generation |
| Sales | [Sales Guide](guides/for-sales.md) | Presentations, communication |

Plus the cross-cutting guides: [model routing and delegation](guides/model-routing-guide.md) and [journaling](guides/journaling-guide.md).

---

## Local Customization

Two files are gitignored so you can customize without leaking config:

- `.claude/settings.local.json`: copy from [`.claude/settings.local.example.json`](.claude/settings.local.example.json) and add permission allowlists or env overrides.
- `.mcp.json`: copy from [`.mcp.json.example`](.mcp.json.example) and register your MCP servers.

`/setup` handles both.

---

## Related Resources

- [Onboarding](ONBOARDING.md): the first-week path through this kit
- [Getting started](resources/getting-started/): installing Claude Code and Codex
- [Prompt Templates](prompt-templates/): cross-LLM prompt library (Claude, ChatGPT, Gemini)
- [Claude Actions](claude-actions/): copy-paste instructions for Claude.ai Projects
- [Videos](resources/videos.md), [articles](resources/articles.md), [tools](resources/tools.md)

---

## Contributing

Found a great prompt? Have improvements? See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT, see [LICENSE](LICENSE).

---

Made with AI by [Workdog](https://github.com/JDWorkdog)
