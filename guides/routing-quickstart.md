# Routing Layer Quickstart (Standalone)

For teammates and friends who want the model-routing layer in their own projects without adopting the whole workbench. You do not need this repo in your daily workflow; you need one folder from it.

What you get:

- A five-role delegation roster with pinned model tiers: `fetcher` and `summarizer` (cheap), `implementer` and `qa-reviewer` (balanced), `architect` (frontier). Works in Claude Code and Codex.
- A ten-line routing table and QA policy for your project's instructions file.
- `tune-my-harness`: an installer skill that audits your project, proposes only what is missing, and installs only what you approve. It is self-contained; all the definitions it installs ship inside its `references/` folder.

The idea in one sentence: the frontier model is the manager, not the typist; mechanical work goes to cheap tiers, and no cheap tier certifies its own work. Full method: [model-routing-guide.md](model-routing-guide.md).

## Path A: You have (or can clone) this repo

1. Copy the skill folder to your user-level skills, which covers every project on your machine:

   ```bash
   git clone --depth 1 https://github.com/JDWorkdog/ai-workbench /tmp/ai-workbench-kit
   mkdir -p ~/.claude/skills
   cp -R /tmp/ai-workbench-kit/.claude/skills/tune-my-harness ~/.claude/skills/
   # Codex users too:
   mkdir -p ~/.codex/skills
   cp -R /tmp/ai-workbench-kit/.claude/skills/tune-my-harness ~/.codex/skills/
   rm -rf /tmp/ai-workbench-kit
   ```

2. Open any project in Claude Code or Codex and run `/tune-my-harness` (or say "tune my harness").
3. Approve the numbered proposal. It installs the roster, the routing table, the QA policy, and Codex tier profiles as applicable, backs up anything it touches, and leaves a receipt.

Repeat step 2 per project; the skill install in step 1 happens once per machine.

## Path B: No clone, let the agent do it

Paste this into a Claude Code session in any project:

```
Install the tune-my-harness skill on this machine, then run it here:
1. git clone --depth 1 https://github.com/JDWorkdog/ai-workbench into a
   temporary directory.
2. Copy its .claude/skills/tune-my-harness/ folder to
   ~/.claude/skills/tune-my-harness/ (and to ~/.codex/skills/ if I use
   Codex). Create the destination folders if needed; ask before
   overwriting an existing copy.
3. Delete the temporary clone.
4. Read the installed SKILL.md and follow it in this project: inventory
   first, then give me the numbered proposal and wait for my approval
   before writing anything.
```

## Path C: Manual, no skill at all

Everything lives in the skill's `references/` folder ([browse it here](../.claude/skills/tune-my-harness/references/)):

1. Copy `references/claude-agents/*.md` into `~/.claude/agents/` (all projects) or your project's `.claude/agents/` (that repo only). Never both for the same agent name.
2. Codex users: copy `references/codex-agents/*.toml` into `~/.codex/agents/`, and append the profiles block from `references/routing-table.md` to `~/.codex/config.toml`.
3. Paste the Model Routing and QA Policy blocks from `references/routing-table.md` into your project's canonical instructions file (`AGENTS.md`, or `CLAUDE.md` if that is your canon), editing the change classes to what your project actually ships.

## User level or project level?

- **User level** (`~/.claude/agents/`, `~/.codex/agents/`): install once, every project can delegate. The right default for individuals.
- **Project level** (`.claude/agents/`, `.codex/agents/` in the repo): the repo carries the roster for everyone who clones it. Right for teams, or when a project needs different tools or models. Do not define the same agent name at both levels.
- The routing table and QA policy always go per project, in that project's instructions file: escalation classes and review requirements genuinely differ between projects, and `AGENTS.md` is the one file both vendors read.

## The two rules that make it safe

1. **Escalation**: anything touching auth, payments, data deletion, or an action that is hard to reverse goes to the frontier tier, regardless of task size.
2. **No self-certification**: cheap-tier work counts as done only after a hard check passes (tests, schema, validator) or a frontier-tier review accepts it.

Model IDs and prices drift. When installing, verify the pinned tiers against what your runtime actually exposes; the durable part is the cheap / balanced / frontier structure, not the names.
