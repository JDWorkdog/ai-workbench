---
name: setup
description: First-run workspace setup. Use when the user says "set up this workbench", "run setup", or asks how to get started in a fresh clone, to pick runtimes (Claude Code, Codex, or both), personalize local settings, and walk the connector checklist.
---

# Setup

Tailor a fresh clone of the AI Workbench to its owner. One repo serves Claude Code users, Codex users, and people who run both; this skill configures (or prunes) accordingly so nobody carries files for a tool they do not use. Everything destructive is approval-gated: propose, list exactly what would change, apply only what the user approves.

## Step 1: Detect state

- If `personal/docs/setup-receipt.md` exists, this is a re-run: read it, say what was configured before, and ask what to change.
- Note what exists: `.claude/settings.local.json`, `.mcp.json`, existing `personal/` content. Never treat a workspace with journal or draft content as fresh; skip anything already done.

## Step 2: Ask which runtimes

Ask once: **Claude Code only, Codex only, or both?**

Then tailor:

- **Both** (the shipped default): change nothing structural. Remind: `.claude/skills/` is canonical, `.agents/skills/` is the mirror, and `./scripts/sync-codex-skills.sh --write` runs after any skill edit.
- **Claude Code only**: propose removing the Codex surface: `.codex/` and `.agents/`. Also update `AGENTS.md`: drop the sync-script line from AI Harness Checks and the Codex tier column from the routing table. `AGENTS.md` itself stays; it is the canonical guide that `CLAUDE.md` imports.
- **Codex only**: `AGENTS.md` and `.agents/skills/` are what Codex reads, so the workspace works as-is. Offer (do not push) a prune of the Claude-specific surface: `.claude/commands/`, `.claude/agents/`, `.claude/hooks/`, `.claude/settings*.json`, and `CLAUDE.md`. If pruning, first make `.agents/skills/` canonical: copy `.claude/skills/` over it, then retire the sync script and update `AGENTS.md` to match. Note honestly that the slash-command workflows in `.claude/commands/` have no direct Codex equivalent; the durable capabilities live in skills.

List every path before removing anything, get an explicit yes, and use `git rm` so the change is reviewable and reversible.

## Step 3: Personalize local settings

- Copy `.claude/settings.local.example.json` to `.claude/settings.local.json` (gitignored) and set `USER_NAME`. Walk through the permission allowlist and prune it to what the user actually wants.
- If the user has MCP servers to register, copy `.mcp.json.example` to `.mcp.json` (gitignored) and fill in theirs.
- Codex users: point at `.codex/config.toml` for the tier profiles (`--profile luna|terra|sol`) and note that trust and personal defaults live in `~/.codex/config.toml`, not in the repo.

## Step 4: Connector checklist

The journal pipeline and several commands read external sources. Ask which of these the user has, and have them connect the ones they want in their assistant's connector settings:

- Calendar (schedule section of the journal)
- Email (conversations, promises)
- Chat (Slack or Teams)
- Meeting transcription (Granola, Fireflies, or similar)

Missing connectors are fine; everything degrades gracefully. Record what was connected in the receipt.

## Step 5: Offer the journaling pipeline

Ask whether they want the scheduled journal (the workbench's flagship habit). If yes, walk them through `guides/journaling-guide.md`: two scheduled tasks in Claude Code Desktop, prompts pasted from the guide, Sonnet-tier model. If no, note that `/daily` and auto-journaling still work manually and the guide is there when they want it.

## Step 6: Verify and leave a receipt

1. Run `python3 scripts/check-ai-harness-rules.py`. If Codex is in play and skills were touched, run `./scripts/sync-codex-skills.sh --check`.
2. Write `personal/docs/setup-receipt.md`: date, runtime choice, files removed (if any), settings personalized, connectors configured, journaling decision. This file is the re-run anchor for Step 1.
3. Close with the two-line orientation: outputs land in `personal/` (gitignored), and `AGENTS.md` is where the workspace rules live.

## Boundaries

- Never touch git remotes, never commit or push, and never delete anything under `personal/` or `temp-files/`.
- Do not edit `~/.claude/` or `~/.codex/` user-level config beyond what the user explicitly asks for.
- If the user declines every option, that is a valid outcome; write the receipt saying so.
