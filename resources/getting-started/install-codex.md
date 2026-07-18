# Installing Codex

Codex is OpenAI's coding agent. It runs as a terminal CLI, inside the ChatGPT desktop app, and as an IDE extension. This workbench is dual-runtime: Codex reads `AGENTS.md` natively and discovers the same skills Claude Code uses through the `.agents/skills/` mirror.

Install and auth details move fast; when in doubt, follow the official docs at https://developers.openai.com/codex. The steps below are the stable path as of mid-2026.

## Prerequisites

- A ChatGPT account (Plus, Pro, Team, or Enterprise) or an OpenAI API key. ChatGPT sign-in is the usual choice for interactive daily use.
- For the npm install: Node 18+.

## 1. Install the CLI

macOS (Homebrew):

```bash
brew install codex
```

Or via npm:

```bash
npm install -g @openai/codex
```

Verify:

```bash
codex --version
```

## 2. Sign in

Run `codex` and pick "Sign in with ChatGPT" (or configure an API key per the docs). 

## 3. Open the workbench

```bash
cd ai-workbench
codex
```

On first open, Codex asks whether to trust the folder. Once trusted:

- Workspace rules load from `AGENTS.md` (the same canonical file Claude Code imports).
- Skills load from `.agents/skills/`. That folder is a generated mirror of `.claude/skills/`; edit skills on the canonical side and run `./scripts/sync-codex-skills.sh --write`.
- The delegation roster lives in `.codex/agents/` (fetcher, summarizer, implementer, qa-reviewer, architect) with pinned model tiers.

## 4. Use the tier profiles

`.codex/config.toml` ships three profiles matching the routing table in `AGENTS.md`:

```bash
codex --profile luna    # cheap tier: mechanical, high-volume work
codex --profile terra   # balanced default: scoped implementation, review
codex --profile sol     # frontier: design, risky diffs, final verification
```

One-shot scripted runs: `codex exec -m gpt-5.6-luna "..."`. Use the exact model IDs the runtime exposes; generic family IDs can be rejected.

## Notes for dual-runtime users

- Never maintain a separate Codex instruction file; `AGENTS.md` is the one home for workspace rules.
- Codex loads skill names and descriptions under a bounded discovery budget: keep skill descriptions short and selection-oriented.
- The cross-vendor QA protocol (one tool implements, the other reviews) is described in [`guides/model-routing-guide.md`](../../guides/model-routing-guide.md), including the official Codex bridge plugin for Claude Code.
