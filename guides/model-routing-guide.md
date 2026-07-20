# Model Routing and Delegation Guide

How to run frontier models (Claude Fable 5, GPT-5.6 Sol) as managers instead of typists: when to delegate to cheaper tiers, how to wire that up in Claude Code and Codex, how to verify delegated work, and when to pay for cross-vendor review. Written 2026-07 for the AI Workbench; the mechanics sections name exact files so you can copy the setup.

## Why route at all

Frontier models are priced like senior staff. The waste is not using them; the waste is using them for work that does not need judgment, then having no budget or patience left for the work that does.

Relative cost tiers, 2026-07:

| Vendor | Tier | Cost | Positioning |
|---|---|---|---|
| Anthropic | Haiku | lowest | mechanical work, bulk summarization |
| Anthropic | Sonnet | middle | scoped implementation, standard review |
| Anthropic | Opus | upper | heavyweight implementation, escalated review, fast-mode interactive coding |
| Anthropic | Fable 5 | highest | design, judgment, final verification, adjudication |
| OpenAI | gpt-5.6-luna | lowest | mechanical work, high volume, clear success criteria |
| OpenAI | gpt-5.6-terra | middle | balanced default, scoped implementation |
| OpenAI | gpt-5.6-sol | highest | complex, open-ended, long-horizon work |

Prices drift; the ratios are the point. A frontier model fetching a PR costs roughly five times what a cheap tier does, for identical output. And the cheapest model is no model: `gh pr view` needs zero tokens of intelligence.

## The six principles

1. **The frontier model is the manager, not the typist.** It holds the plan, makes judgment calls, and verifies. Mechanical work (fetching, posting prepared text, formatting, moving files, bulk summarizing) goes to cheap tiers or plain scripts.
2. **Route by what failure costs, not by what the task is called.** A "PR review" of a risky auth change deserves the frontier model; a "PR review" of a typo fix does not. Same label, different stakes, different tier.
3. **Pin models at the worker level, decide at the manager level.** Delegated roles carry a pinned model in their definition. The orchestrator carries a short routing table in the instructions file and decides per task. Do not scatter model advice as prose across every skill.
4. **The cheap model never self-certifies.** Anything a lesser model produces counts as done only after a hard check passes (tests, schema, validator) or the frontier model accepts it. This is the rule that makes cheap delegation safe. The same applies to review: a cheaper reviewer finds, the frontier tier decides.
5. **Delegation has overhead.** Spawning a worker costs context setup and coordination. For a one-shot small task in a warm session, inline is often cheaper. Delegate for bulk, for parallelism, for context isolation, or when a genuinely cheaper tier suffices.
6. **Independence beats persona.** A QA agent adds value because it has fresh context and an adversarial goal, not because its prompt says it is a QA engineer. Specialist lenses (DBA, UX, security) work best as parallel review passes over a change, not as a permanent zoo of personas. Retire agents whose descriptions you imported but never use; their descriptions load into every session.

## Claude Code mechanics

**Subagents with pinned models** are the primary mechanism. Each is a markdown file with frontmatter; `model:` takes `haiku`, `sonnet`, `opus`, or `inherit` (inherit = the session's model, use it for frontier-tier roles).

- User level, covers all projects: `~/.claude/agents/*.md`
- Project level, this repo only: `.claude/agents/*.md`

The `description` field is how the orchestrator picks a worker, so write it as a routing rule: what the role is for, and what it must NOT be used for. The installed roster: `fetcher` (haiku), `summarizer` (haiku), `implementer` (sonnet), `qa-reviewer` (sonnet), `architect` (inherit).

**Per-task model overrides** are how the middle-upper tier fits in without growing the roster: the `Agent` call's `model` parameter beats the pinned default for that one task. The routing table names the two standard overrides. Heavyweight implementation (a change spanning 3+ modules or layers, or a spec that embeds design judgment) runs `implementer` on opus, because Sonnet executes a spec faithfully, including the spec's flaws, where Opus is likelier to push back. Release-critical or large multi-agent diffs run `qa-reviewer` on opus. Opus also supports fast mode, which makes it the right tier for live interactive coding sessions where latency matters.

**Slash commands** accept `model:` frontmatter too. Use it to pin an entire recurring task to a tier (a nightly digest that should always run cheap).

**The routing table** lives in `AGENTS.md` under Model Routing. A short table the orchestrator consults, plus the standing rules (escalation, no self-certification, adjudication). Keep it short; it loads every session.

**Main-loop hygiene**: run the interactive session on the frontier model, keep always-loaded context small, and let skills carry specialist depth that loads at the point of need.

## Codex mechanics

**Subagents exist here too**, as TOML files with per-agent `model` and `model_reasoning_effort`:

- User level: `~/.codex/agents/*.toml`
- Project level: `.codex/agents/*.toml`

The same five roles carry over with tier substitutions: luna for fetcher and summarizer, terra for implementer and qa-reviewer, sol for architect. Delegation is explicit (the session spawns agents on request), capped by default at six concurrent workers, one level deep. For bulk fan-out there is a CSV batch mechanism (one worker per row) worth knowing for jobs like backfills.

**Profiles** give you whole-session tiers: `[profiles.luna|terra|sol]` in `~/.codex/config.toml`, activated with `codex --profile luna`. One-shots: `codex exec -m gpt-5.6-luna "..."`. Use the exact model IDs the runtime exposes; generic family IDs can be rejected.

**Two Codex-specific caveats to teach:**

1. **Skill discovery budget.** Codex loads skill names and descriptions under a bounded budget. Keep descriptions short and selection-oriented: what problem, when to use. Long descriptions get truncated and hurt routing.
2. **Delegation auditability.** As of mid-2026, parent-to-child subagent instructions on Sol and Terra are encrypted server-side, so local traces do not show delegation content in plaintext (open issue at the time of writing). Claude Code delegation remains locally auditable. Where auditability matters, prefer artifact-based handoffs: write the task spec to a file, have the worker read it. The file is your audit trail regardless of what the wire hides.

**Ultra mode** (Sol spawning internal parallel subagents) buys small quality gains for roughly triple cost. It is a deliberate purchase for a hard problem, never a default.

## The verification chain

The routing table's partner rule: every downward delegation has an upward verification.

```
fetcher/summarizer output -> used by implementer or main session (errors are cheap and visible)
implementer output        -> hard checks (tests, validators) AND qa-reviewer pass
qa-reviewer findings      -> labeled CONFIRMED or PLAUSIBLE; PLAUSIBLE findings adjudicated
                             by the frontier tier before any fix lands
adjudicated findings      -> fixed by implementer; disagreements settled by a test
risky diffs (auth, money, data loss) -> frontier review, regardless of who wrote them
```

Two habits make this work. First, delegate with acceptance criteria: a task the worker cannot prove done is not specified enough. Second, never let the model that did the work be the only judge of the work.

The adjudication step is not ceremony. A mid-tier reviewer that labels its confidence honestly is genuinely useful: in one large multi-agent session on this workbench, a Sonnet reviewer flagged as PLAUSIBLE a dead code branch that two green test suites had missed (the implementing model had mocked an unreachable path into passing tests). Frontier adjudication confirmed the finding from source before the fix landed. The reviewer's value was the find plus the honest label; the adjudication step is what turned it into a safe decision. The failure mode it prevents runs both ways: discounting a real PLAUSIBLE finding, or "fixing" a mistaken one.

## Cross-vendor QA (Claude implements, Codex reviews, or the reverse)

Two frontier models from different vendors miss different things, the same reason human review works. It also roughly doubles context spend on the reviewed change, so it is a policy decision, not a habit. The `QA Policy` table in `AGENTS.md` says which change classes require it; flipping a class is a one-line edit.

The protocol:

1. The implementing tool writes `review-request.md` next to the change: what changed, why, what to scrutinize, how to run the checks.
2. The reviewing tool (the other vendor) reads the request and the diff, runs the checks, and writes numbered findings to a file. It never edits the code.
3. The implementing tool answers every finding with a fix or a written reason. Disagreements are settled by a test, not a third opinion.
4. Neither tool edits the other's configuration. Both read the same `AGENTS.md`.

**Low-friction setup**: OpenAI ships an official Claude Code plugin that invokes Codex for review from inside a Claude session. Install (verify the flow against current docs at install time; this moves fast):

```
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/reload-plugins
/codex:setup
```

Requires a ChatGPT account or OpenAI API key. After setup, ask Claude to run a Codex adversarial review of the current diff.

## Token-efficiency habits

- **Keep always-loaded context lean.** Instruction files, agent descriptions, and skill descriptions load every session. Every line must earn its place; move specialist depth into skills and references that load on selection.
- **One home per rule.** Duplicate instruction files drift, and both copies bill you every session. Canonical `AGENTS.md`, thin `CLAUDE.md` importing it.
- **Artifacts over re-derivation.** Handoffs, plans, and findings go in files. A file written once is cheaper than context re-explained every session, and it survives compaction.
- **Summarize downward in tiers.** Dailies to monthly rollups to entity dossiers, generated by cheap models on schedule, so recall queries load one small file instead of a folder.
- **Scripts beat models for deterministic work.** Syncing mirrors, checking rules, converting formats: if a shell script can do it, a shell script should do it.

## The maintenance loop

Scaffolding encodes assumptions about the current model's limitations, and those assumptions go stale on every major upgrade. OpenAI's harness-engineering guidance frames it as asking "what can I remove?" after each upgrade, not "what can I add?". The working loop:

1. **After every major model upgrade**, run a harness audit (the Clean My AI Harness kits, or `/tune-my-harness` for the routing layer specifically). Retire instructions that existed to compensate for weaknesses the new model no longer has.
2. **Turn recurring prose rules into checks.** A rule with a yes-or-no answer belongs in a hook, validator, or script (`scripts/check-ai-harness-rules.py` in this workspace is the pattern).
3. **Re-verify fast-moving facts** before teaching them: tier prices, plugin install flows, the Codex encryption issue, per-skill model support. Anything in this guide with a date on it expires.
