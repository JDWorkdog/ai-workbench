# Installing Claude Code

Claude Code is Anthropic's coding agent. It runs as a terminal CLI, a desktop app (Mac/Windows), a web app, and IDE extensions for VS Code and JetBrains. For this workbench you want the CLI or IDE extension for daily work, plus the desktop app if you plan to use scheduled tasks (the journaling pipeline runs on them).

Current install and auth details move fast; when in doubt, follow the official docs at https://code.claude.com/docs. The steps below are the stable path as of mid-2026.

## Prerequisites

- A Claude account (Pro or Max) or an Anthropic Console account with API billing. Subscription accounts are the usual choice for interactive daily use.

## 1. Install the CLI

macOS/Linux:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Alternative via npm (requires Node 18+):

```bash
npm install -g @anthropic-ai/claude-code
```

Verify:

```bash
claude --version
```

## 2. Sign in

Run `claude` in any folder and follow the sign-in flow (or use `/login` inside a session). Choose your Claude subscription account or Console account when prompted.

## 3. IDE extension (optional but recommended)

Install the "Claude Code" extension from the VS Code marketplace (or the JetBrains plugin). It gives you the same agent with inline diffs, file mentions, and a sidebar UI. Sign-in carries over from the CLI.

## 4. Desktop app (needed for scheduled tasks)

Download the Claude Code desktop app from https://claude.com/claude-code. The desktop app can run scheduled tasks while your editor is closed; the journaling pipeline in [`guides/journaling-guide.md`](../../guides/journaling-guide.md) depends on this. Add this workbench folder as a project in the app.

## 5. Open the workbench

```bash
cd ai-workbench
claude
```

Then run `/setup` and follow the prompts. Slash commands (`/prd`, `/research`, `/daily`) come from `.claude/commands/`, skills from `.claude/skills/`, and the workspace rules from `AGENTS.md` via `CLAUDE.md`.

## Troubleshooting

- **Command not found after npm install**: your npm global bin directory is not on PATH. `npm config get prefix` and add its `bin/` to PATH.
- **Permission prompts feel constant**: copy `.claude/settings.local.example.json` to `.claude/settings.local.json` and extend the permission allowlist deliberately.
- **Corporate proxy issues**: see the official docs for proxy and enterprise configuration.
