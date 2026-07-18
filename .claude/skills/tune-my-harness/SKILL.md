---
name: tune-my-harness
description: Install or upgrade a model-routing and delegation layer in the current project. Use when the user says "tune my harness", "add model routing", "set up delegation", or after a harness cleanup, to add pinned-model agent rosters, a routing table, and QA policy to an existing Claude Code or Codex project.
---

# Tune My Harness

Where the cleanup kits prune, this skill installs. It audits how the current project routes work between model tiers and proposes the missing pieces: a delegation roster with pinned models, a routing table in the instructions file, Codex tier profiles, and a QA policy. Nothing is written without the user approving the numbered proposal.

The method and rationale live in `guides/model-routing-guide.md` (in the AI Workbench; read it if available). Reference roster definitions to copy from: `~/.claude/agents/` and `~/.codex/agents/` (fetcher, summarizer, implementer, qa-reviewer, architect).

## Step 1: Inventory (read-only)

Establish what exists before proposing anything:

1. Instruction files: `AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md`. Note which is canonical, whether a routing table or QA policy already exists.
2. Rosters: `.claude/agents/` and `~/.claude/agents/` (frontmatter `model:` per agent); `.codex/agents/` and `~/.codex/agents/`; `[profiles.*]` in `~/.codex/config.toml`.
3. Commands and skills: any `model:` frontmatter, any skill descriptions long enough to strain Codex's discovery budget (keep descriptions to roughly two sentences about when to select).
4. Which runtimes this project actually uses (presence of `.claude/`, `.codex/`, `.agents/`, or ask once).

## Step 2: Propose (numbered, nothing applied)

Present a numbered proposal covering only the gaps found:

1. **Roster**: which of the five roles to install, at which level (user level covers all projects and is the default; project level only when the project needs different tools or models). Never create a same-named agent at both levels.
2. **Routing table**: the task-class table plus escalation rule for the canonical instructions file, with tiers matched to the runtimes in use.
3. **QA policy**: change classes with review levels, cross-vendor off by default.
4. **Codex profiles**: `[profiles.luna|terra|sol]` if Codex is used and they are absent.
5. **Skill description tightening**: any descriptions to shorten for the discovery budget.

For each item: what changes, why, and how to reverse it. Recommend, do not pad; a project that already routes well should get a short "nothing to install" report.

## Step 3: Apply approved items only

- Back up every file before touching it (state where the backups are).
- Copy roster definitions from the reference roster, adjusting tools and stack references to this project. Keep each description selection-oriented: what the role is for and what it must not be used for.
- Insert the routing table and QA policy into the canonical instructions file (never into a duplicate).
- Do not change permission or approval settings while installing; note them for the user if they conflict with the roster (for example, a sandbox that blocks subagent spawning).

## Step 4: Verify and receipt

1. Confirm new agent files parse (frontmatter present, model values valid: haiku, sonnet, opus, inherit for Claude; exact runtime-exposed IDs for Codex).
2. Confirm the instructions file still passes the project's checks if it has any (in the AI Workbench: `python3 scripts/check-ai-harness-rules.py`).
3. Leave a short WHAT-CHANGED note beside the instructions file: what was installed, what was skipped, where backups are.
4. Remind the user of the two standing rules that make routing safe: escalation for auth, money, and irreversible changes; and no self-certification by cheap tiers.
