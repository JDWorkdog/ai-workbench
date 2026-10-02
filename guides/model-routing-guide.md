# Model Routing and Delegation Guide

How to run a frontier model as the manager instead of the typist: which model tier to use for which work, how to wire delegation up in Claude Code and Codex, how to verify delegated work, and when to pay for cross-vendor review. Written 2026-09-22 and updated 2026-10-01 (Sonnet 5.5, GPT-6.1 Sol, Claude Code effort changes) for the AI Workbench, and meant to be handed to anyone, whether they use Claude Code, Codex, or both.

This file is self-contained. Everything an assistant needs to install the routing layer (agent definitions, routing table, QA policy, Codex profiles) is in the appendices. You do not need the workbench repo.

## Quick start: let your agent set this up

If someone handed you this file, you do not have to read it first. Save it somewhere in the project you want to set up (the project root or a `docs/` folder is fine), open Claude Code or Codex in that project, and paste this line:

```
Read the file model-routing-guide.md in full, then follow its section "Agent setup instructions" exactly. Begin by asking me which runtime I use.
```

Adjust the path if you saved it elsewhere. The assistant will ask whether you use Claude Code, Codex, or both, inventory what you already have, show you a numbered plan, and install only what you approve. Nothing is written before you say yes, and every file it touches is backed up first.

Read on if you want to understand what it installs and why.

## Why route at all

Frontier models are priced like senior staff. The waste is not using them; the waste is using them for work that does not need judgment, then having no budget, rate limit, or patience left for the work that does.

Two things changed since the July 2026 version of this guide:

1. **Both vendors shipped a new balanced tier on 2026-09-22.** Claude Opus 5.5 performs at the level of Fable 5.1 on most work at 40 percent of the price. GPT-6 Sol and GPT-6 Luna arrived at half the price of their 5.6 predecessors or less. The balanced tier is now good enough to be the default main-session model for both vendors, which makes the frontier tier a deliberate escalation rather than a starting point. Two follow-ups landed within the week: Claude Sonnet 5.5 (same price as Sonnet 5) and, on 2026-09-29, GPT-6.1 Sol, which approaches Astra on coding at one fifth of Astra's price and is now the Codex default.
2. **Effort is now a first-class knob.** Both runtimes let you set reasoning effort per model, per agent, and per session. Turning effort down on a capable model is often cheaper and better than switching to a smaller model. Route by effort first, by tier second.

If you are on a subscription plan (Claude Pro, Max, Team, or Enterprise; ChatGPT Plus, Pro, Business, or Enterprise) you do not pay per token, but every request still consumes your usage allowance roughly in proportion to these prices. The ratios are what matter, and they are the same either way.

## The model lineup (verified 2026-10-01)

### Anthropic

| Model | ID | Input / output per 1M tokens | Context | Use it for |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | $10 / $50 | 1M | Demanding reasoning, long-horizon agentic work, adjudication. When Opus 5.5 at higher effort still falls short. |
| Claude Opus 5.5 | `claude-opus-5-5` | $4 / $20 | 1M | The default. Long-running agentic coding and knowledge work. Fable-level results on most tasks. Default effort is `medium`. |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | $2 / $10 | 1M | Scoped implementation, standard review. Best speed-to-intelligence ratio. Effort levels were recalibrated from Sonnet 5, so re-tune rather than carry old settings over; Claude Code defaults it to `medium`. |
| Claude Haiku 4.5 | `claude-haiku-4-5` | $1 / $5 | 200K | Mechanical work: fetching, formatting, bulk summarization. Does not support effort levels. |

Fast mode (up to 2.5x faster output, same model) is available on Opus 5.5 at $8 / $40, through the Anthropic API only (not Bedrock, Google Cloud, or Foundry). On subscription plans it bills to usage credits, not the included allowance. Use it for live interactive coding where latency matters, not for background work.

Sonnet 5.5 has shipped and the `sonnet` alias now points to it on the Anthropic API. Haiku 5.5 is announced but not released as of 2026-10-01; when it lands, move the `haiku` row up a generation and re-verify the price and effort support. Fable 5, Opus 5, Sonnet 5, and Opus 4.8 are still served but are legacy; do not pin new work to them.

### OpenAI

| Model | ID | Input / output per 1M tokens | Use it for |
|---|---|---|---|
| GPT-6 Astra | `gpt-6-astra` | $10 / $50 | Frontier: design, adjudication, the hardest multi-step work. Disabled by default on Enterprise accounts until an admin enables it. |
| GPT-6.1 Sol | `gpt-6.1-sol` | $2 / $10 | The default (released 2026-09-29). Complex coding, computer use, multistep work; near Astra on software engineering benchmarks. Bundled default from Codex CLI 0.159.1. |
| GPT-6 Sol | `gpt-6-sol` | $2 / $10 | Superseded by GPT-6.1 Sol at the same price. Fallback if your Codex version predates 0.159.1. |
| GPT-6 Luna | `gpt-6-luna` | $0.10 / $0.50 | Cheap tier. High-volume tasks with a clear goal: summarizing, extracting, fetching, formatting. |
| GPT-5.6 Sol | `gpt-5.6-sol` | $4 / $20 (promotional through 2026-11-21) | Previous flagship. Fallback frontier tier if Astra is not enabled on your account. |
| GPT-5.6 Terra | `gpt-5.6-terra` | $2 / $12 | Previous balanced tier. No direct successor; GPT-6.1 Sol replaces it at a lower price. |
| GPT-5.6 Luna | `gpt-5.6-luna` | $0.20 / $1.20 | Superseded by GPT-6 Luna at half the price. |

GPT-6.1 Sol is available on Plus, Pro, Business, Enterprise, and Edu plans in Codex and through the API. OpenAI's own subagent documentation now names `gpt-6.1-sol` ("start here for demanding agents") and `gpt-6-luna` (narrow, high-volume work) as the two primary subagent choices. Restricted Astra variants decline advanced offensive cybersecurity tasks for standard users; if you do security work, expect that.

### What the two lineups have in common

| Tier | Anthropic | OpenAI | What goes here |
|---|---|---|---|
| Cheap | Haiku 4.5 ($1 / $5) | GPT-6 Luna ($0.10 / $0.50) | Fetch, post, format, summarize. Zero judgment. |
| Balanced | Sonnet 5.5 ($2 / $10) | GPT-6.1 Sol ($2 / $10) | Scoped implementation, standard review. |
| Strong default | Opus 5.5 ($4 / $20) | GPT-6.1 Sol ($2 / $10) | The main interactive session. Heavyweight implementation. Escalated review. |
| Frontier | Fable 5.1 ($10 / $50) | GPT-6 Astra ($10 / $50) | Design, decomposition, adjudication, anything hard to reverse. |

Anthropic has four rungs where OpenAI has three, so GPT-6.1 Sol does double duty as balanced and default. The structure (cheap / balanced / frontier, plus a strong default for the main session) is the durable part. Names and prices drift; the structure does not.

## The seven principles

1. **The frontier model is the manager, not the typist.** It holds the plan, makes judgment calls, and verifies. Mechanical work (fetching, posting prepared text, formatting, moving files, bulk summarizing) goes to cheap tiers or plain scripts.
2. **Route by what failure costs, not by what the task is called.** A "PR review" of a risky auth change deserves the frontier model; a "PR review" of a typo fix does not. Same label, different stakes, different tier.
3. **Effort before tier.** Before dropping to a smaller model, try the same model at lower effort. Opus 5.5 at `medium` and GPT-6.1 Sol at `medium` are both cheap enough for most work and keep the quality floor high. Reserve `xhigh` and `max` for the hardest problems, where they earn their cost. Cost per completed task is the measure, not cost per request: a cheaper request that needs three retries is not cheaper.
4. **Pin models at the worker level, decide at the manager level.** Delegated roles carry a pinned model and effort in their definition. The orchestrator carries a short routing table in the instructions file and decides per task. Do not scatter model advice as prose across every skill.
5. **The cheap model never self-certifies.** Anything a lesser model produces counts as done only after a hard check passes (tests, schema, validator) or the frontier tier accepts it. This is the rule that makes cheap delegation safe. The same applies to review: a cheaper reviewer finds, the frontier tier decides.
6. **Delegation has overhead.** Spawning a worker costs context setup and coordination. For a one-shot small task in a warm session, inline is often cheaper. Delegate for bulk, for parallelism, for context isolation, or when a genuinely cheaper tier suffices.
7. **Independence beats persona.** A QA agent adds value because it has fresh context and an adversarial goal, not because its prompt says it is a QA engineer. Specialist lenses (DBA, UX, security) work best as parallel review passes over a change, not as a permanent zoo of personas. Retire agents whose descriptions you imported but never use; their descriptions load into every session.

## The roster

Five roles, the same in both runtimes. Each carries a pinned model and effort. The full definitions are in Appendix A (Claude Code) and Appendix B (Codex).

| Role | Purpose | Claude Code | Codex |
|---|---|---|---|
| `fetcher` | Retrieve or deliver bytes with zero judgment: PRs, issues, work items, API data, posting already-written text | `haiku` | `gpt-6-luna`, effort `low` |
| `summarizer` | Compress transcripts, threads, logs, documents into faithful structured summaries | `haiku` | `gpt-6-luna`, effort `medium` |
| `implementer` | Execute a scoped, well-specified change with acceptance criteria | `sonnet`, effort `medium` | `gpt-6.1-sol`, effort `medium` |
| `qa-reviewer` | Fresh-context adversarial review; report-only; labels findings CONFIRMED or PLAUSIBLE | `sonnet`, effort `xhigh` | `gpt-6.1-sol`, effort `high` |
| `architect` | Design, decomposition, final verification, adjudication | `fable`, effort `high` | `gpt-6-astra`, effort `high` |

The implementer dropped from `high` to `medium` with Sonnet 5.5: its effort levels were recalibrated, and Anthropic's guidance is to start agentic coding at `medium` on it. The reviewer stays at `xhigh` because review is where depth pays. If the implementer starts missing acceptance criteria, raise it back to `high` before reaching for a bigger model.

Two standard overrides, applied per task rather than by adding roles:

- **Heavyweight implementation** (a change spanning three or more modules or layers, or a spec that embeds design judgment): run `implementer` on `opus` (Claude) or `gpt-6-astra` (Codex). Sonnet 5.5 and GPT-6.1 Sol execute a spec faithfully, including the spec's flaws. The stronger model is likelier to push back.
- **Release-critical or large multi-agent diffs**: run `qa-reviewer` on `opus` or `gpt-6-astra`.

If Fable 5.1 is not on your Claude plan, the architect runs on `opus` at effort `xhigh`. If GPT-6 Astra is not enabled on your account, the architect runs on `gpt-5.6-sol`. The appendices carry these fallbacks as comments.

**The main session** runs on the strong default: Opus 5.5 in Claude Code (it is the built-in default on paid plans and the API) and GPT-6.1 Sol in Codex (the bundled default from 0.159.1). Switch the session itself up to Fable or Astra only for design sessions or adjudication-heavy work, and switch back afterward. For live interactive coding on Claude, fast mode on Opus 5.5 is the right purchase when you are waiting on the model; turn it off for anything that runs unattended.

## Claude Code mechanics

**Subagents with pinned models** are the primary mechanism. Each is a markdown file with frontmatter:

- User level, covers all projects: `~/.claude/agents/*.md`
- Project level, this repo only: `.claude/agents/*.md`
- Plugin level: a plugin's `agents/` directory, lowest priority

Frontmatter fields that matter for routing:

- `model:` accepts `haiku`, `sonnet`, `opus`, `fable`, `inherit`, or a full ID such as `claude-opus-5-5`. `inherit` means the session's model. Aliases resolve per provider: on the Anthropic API `sonnet` is Sonnet 5.5, but on Claude Platform on AWS it is still Sonnet 4.6, and on Bedrock, Google Cloud, and Foundry it is Sonnet 4.5 (Foundry's `opus` is Opus 4.6). If you run on one of those, pin full model IDs your provider serves instead of aliases, or the roster silently drops a generation.
- `effort:` accepts `low`, `medium`, `high`, `xhigh`, `max`. Overrides the session effort while the subagent runs. Haiku 4.5 does not support effort; leave it off for Haiku agents.
- `tools:` is an allowlist; `disallowedTools:` is a denylist.
- `description:` is what the orchestrator reads to pick a worker, so write it as a routing rule: what the role is for and what it must NOT be used for. Combined descriptions over 15,000 tokens trigger a warning, and every description loads into every session.

Model resolution order for a subagent: the per-invocation `model` parameter on the Agent call, then the definition's `model:` frontmatter, then the `CLAUDE_CODE_SUBAGENT_MODEL` environment variable, then the main conversation's model. The per-invocation parameter is how the two standard overrides work without growing the roster.

**Session-level controls**: `/model` offers the aliases `fable`, `opus`, `sonnet`, `haiku`, `best` (Fable where available, else Opus), and `opusplan` (Opus 5.5 during plan mode, Sonnet 5.5 for execution). Defaults: Opus 5.5 and Sonnet 5.5 run at `medium`, Opus 4.7 at `xhigh`, everything else at `high`. The top-level `effortLevel` setting no longer applies to Opus 5.5 or Sonnet 5.5; set those with `/effort`, the `/model` picker, or per model under `modelSettings` (for example `"modelSettings": {"claude-opus-5-5": {"effortLevel": "high"}}`). Subagent `effort:` frontmatter still overrides all of these while the subagent runs. `/fast` toggles fast mode on Opus 5.5.

**Slash commands and skills** accept `model:` frontmatter too, with the same values plus `inherit`. Use it to pin an entire recurring task to a tier (a nightly digest that should always run on Haiku).

**The routing table** lives in the project's canonical instructions file (`AGENTS.md`, or `CLAUDE.md` if that is the project's canon) under a Model Routing heading. A short table the orchestrator consults, plus the standing rules. Keep it short; it loads every session.

**Main-loop hygiene**: run the interactive session on Opus 5.5, keep always-loaded context small, and let skills carry specialist depth that loads at the point of need.

## Codex mechanics

**Subagents** are TOML files:

- User level: `~/.codex/agents/*.toml`
- Project level: `.codex/agents/*.toml`

Required fields: `name`, `description`, `developer_instructions`. Optional fields that matter for routing: `model`, `model_reasoning_effort`, plus `sandbox_mode`, `mcp_servers`, and `skills.config` when a role needs them. Effort values are `low`, `medium`, `high`, `xhigh`, `max`, and `ultra`; available levels depend on the model.

Delegation is explicit: ask for it ("spawn the fetcher agent to pull PR 1234") or have the routing table in `AGENTS.md` tell the session when to do it. Session-wide defaults live in the `[agents]` table of `~/.codex/config.toml`: `default_subagent_model`, `default_subagent_reasoning_effort`, and `max_concurrent_threads_per_session`. Left unset, `default_subagent_model` inherits the parent session's model. Set it to `gpt-6.1-sol` so an ad hoc spawn without a named role still lands on the balanced tier; the roster pins the cheap roles down to Luna explicitly.

**Profiles** give you whole-session tiers. The current mechanism is a profile file beside `config.toml`, named `~/.codex/<name>.config.toml`, selected with `codex --profile <name>`. Older Codex versions used `[profiles.<name>]` tables inside `config.toml`. Current versions (0.158 and newer, at least) refuse to start `--profile` while a legacy table remains, so move each one into its own profile file and delete the table. One-shots: `codex exec -m gpt-6-luna "..."`. Use the exact model IDs the runtime exposes; a generic family ID can be rejected. Version floors: GPT-6 Astra arrived in Codex CLI 0.154.0, GPT-6 Sol and Luna in 0.156.1, and GPT-6.1 Sol in 0.159.1. Use 0.159.1 or newer.

**Three Codex-specific caveats:**

1. **Skill discovery budget.** Codex loads skill names and descriptions under a bounded budget. Keep descriptions short and selection-oriented: what problem, when to use. Long descriptions get truncated and hurt routing.
2. **Delegation auditability is still an open issue.** Since June 2026, the instruction a parent sends when spawning a subagent is encrypted in transit and appears as ciphertext in local traces. A June change added plaintext handling for child-completion notifications, but the parent-to-child task itself is still not readable locally; the tracking issue (`openai/codex` #28058) was still open on 2026-10-01, with no fix version named. Claude Code delegation remains locally auditable. Where auditability matters, prefer artifact-based handoffs: write the task spec to a file, have the worker read it. The file is your audit trail regardless of what the wire hides. A related open issue (#34833) means Codex subagents pointed at a non-OpenAI provider cannot consume the encrypted task at all, so keep Codex subagents on OpenAI models.
3. **Ultra effort** (the `ultra` reasoning level, which lets the session delegate proactively and spawn internal parallel work) buys small quality gains for a large multiple in cost. It is a deliberate purchase for a hard problem, never a default.

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

Two frontier models from different vendors miss different things, the same reason human review works. It also roughly doubles spend on the reviewed change, so it is a policy decision, not a habit. The QA Policy table (Appendix C) says which change classes require it; flipping a class is a one-line edit.

The protocol:

1. The implementing tool writes `review-request.md` next to the change: what changed, why, what to scrutinize, how to run the checks.
2. The reviewing tool (the other vendor) reads the request and the diff, runs the checks, and writes numbered findings to a file. It never edits the code.
3. The implementing tool answers every finding with a fix or a written reason. Disagreements are settled by a test, not a third opinion.
4. Neither tool edits the other's configuration. Both read the same `AGENTS.md`.

**Low-friction setup from Claude Code**: OpenAI's official plugin (`openai/codex-plugin-cc`) runs Codex from inside a Claude session. It needs a ChatGPT account (any tier, including Free) or an OpenAI API key, plus Node 18.18 or newer. Install inside Claude Code:

```
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/reload-plugins
/codex:setup
```

Then `/codex:review` for a standard read-only review, `/codex:adversarial-review` for a steerable challenge review, and `/codex:rescue` to hand a task to Codex in the background (`/codex:status` and `/codex:result` to collect it). Codex usage through the plugin counts against your Codex limits, not your Claude limits.

**The reverse direction** (Codex session, Claude reviews) has no official plugin. A community option, `sendbird/cc-plugin-codex`, runs inside Codex and calls Claude Code for review. Evaluate it before adopting; it is not vendor-supported. The artifact protocol above works without any plugin: write the review request, open the other tool, point it at the file.

## If you run both

Running both tools gives you one extra lever: the two cheap tiers are ten times apart in price. GPT-6 Luna at $0.10 / $0.50 is the cheapest competent model on your desk, and Haiku 4.5 at $1 / $5 is not close. Practical consequences:

- **Bulk mechanical work belongs on Luna.** Backfills, batch summarization, scraping structured data out of a hundred pages. If you are in a Claude session, `/codex:rescue` hands it over; or run `codex exec -m gpt-6-luna` from a script.
- **Interactive coding is a wash.** Opus 5.5 and GPT-6.1 Sol are both strong defaults. Use whichever tool you are already in; switching tools mid-task costs more than any price gap saves.
- **Cross-vendor review is where "both" earns its keep.** Reserve it for shipping code and irreversible changes, per the QA Policy.
- **One canon.** `AGENTS.md` is the file both tools read. Put the routing table and QA policy there, keep `CLAUDE.md` as a one-line import (`@AGENTS.md`), and never let the two drift.

## Token-efficiency habits

- **Keep always-loaded context lean.** Instruction files, agent descriptions, and skill descriptions load every session. Every line must earn its place; move specialist depth into skills and references that load on selection.
- **One home per rule.** Duplicate instruction files drift, and both copies bill you every session. Canonical `AGENTS.md`, thin `CLAUDE.md` importing it.
- **Artifacts over re-derivation.** Handoffs, plans, and findings go in files. A file written once is cheaper than context re-explained every session, and it survives compaction.
- **Summarize downward in tiers.** Dailies to monthly rollups to entity dossiers, generated by cheap models on schedule, so recall queries load one small file instead of a folder.
- **Scripts beat models for deterministic work.** Syncing mirrors, checking rules, converting formats: if a shell script can do it, a shell script should do it. `gh pr view` needs zero tokens of intelligence.
- **Lower effort before lower tier.** A capable model at `low` or `medium` effort is the first cost lever, and it keeps one prompt cache warm. A cascade of different models forfeits cache reuse across them.

## The maintenance loop

Scaffolding encodes assumptions about the current model's limitations, and those assumptions go stale on every major upgrade. Ask "what can I remove?" after each upgrade, not "what can I add?". The working loop:

1. **After every major model upgrade**, re-read the roster. Retire instructions that existed to compensate for weaknesses the new model no longer has. Opus 5.5 is much less likely than earlier models to take hard-to-reverse actions on its own, so some guardrail prose written for Opus 4.x can probably go. Re-check pinned effort levels too: a new version can recalibrate what each level means, as Sonnet 5.5 did.
2. **Turn recurring prose rules into checks.** A rule with a yes-or-no answer belongs in a hook, validator, or script.
3. **Re-verify fast-moving facts** before teaching them: tier prices, model IDs, plugin install flows, the Codex encryption issue. Anything in this guide with a date on it expires. Haiku 5.5 is the next scheduled expiry, and OpenAI shipped GPT-6.1 Sol one week after GPT-6 Sol, so expect point releases to arrive faster than this guide's updates.

## Agent setup instructions

This section is written for the assistant (Claude Code or Codex) that has been asked to set up the routing layer described in this file. Follow the steps in order. Do not write any file before Step 4.

Rules that apply throughout: back up every existing file before modifying it; never create the same agent name at both user and project level; copy definitions from the appendices verbatim except for the adjustments the steps name; use no em dashes or en dashes in anything you write; include no time estimates.

**Step 1. Ask one question and wait for the answer.** Use a structured question tool if you have one; otherwise ask in plain text and stop. Ask both parts in the same message:

- Which runtime are we setting up: (a) Claude Code only, (b) Codex only, or (c) both?
- Install at user level (the default: `~/.claude/agents/` and `~/.codex/agents/`, covers every project on this machine) or project level (this repository only, for a team repo that should carry its own roster)?

Ask nothing else yet.

**Step 2. Inventory, read-only.** Report what you find in a short list:

- Versions: `claude --version` and/or `codex --version`. Codex needs 0.159.1 or newer for `gpt-6.1-sol`; if it is older, recommend upgrading. If the person cannot upgrade, plan to use `gpt-6-sol` in place of `gpt-6.1-sol` on 0.156.1 or newer, and below 0.156.1 use `gpt-5.6-sol` and `gpt-5.6-luna` in place of all GPT-6 IDs. Say which substitution applies.
- Instruction files in the project root: `AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md`. Note which exists, whether one imports the other, and whether a Model Routing or QA Policy section already exists.
- Existing agents: `~/.claude/agents/`, `.claude/agents/`, `~/.codex/agents/`, `.codex/agents/`. Note any file whose name matches one of the five roles.
- Codex config: whether `~/.codex/config.toml` has an `[agents]` table, and whether any `~/.codex/*.config.toml` profile files or `[profiles.*]` tables exist.
- For Codex, check whether `codex --help` lists a `--profile` flag.

**Step 3. Propose, then wait for approval.** Present a numbered plan listing every file you will create, every file you will modify (with its backup path), and every item you will skip because an equivalent already exists. Cover only the runtime(s) chosen in Step 1. Then stop and wait. If the person declines an item, drop it and continue with the rest.

**Step 4. Apply the approved items.**

For Claude Code:

- Write the five files from Appendix A into the chosen agents directory. If an agent with the same name already exists, skip it and say so; do not overwrite.
- If the person runs Claude Code through Bedrock, Google Cloud, Foundry, or Claude Platform on AWS (check `/model` or the provider env vars), replace the `sonnet` and `opus` aliases with the newest full model IDs that provider serves, since the aliases resolve to older models there.
- If `fable` is not available on the person's plan (they can check with `/model`; when in doubt, ask), write `architect.md` with `model: opus` and `effort: xhigh` instead. Do not leave any setup note inside the agent file; its body becomes the agent's instructions.

For Codex:

- Write the five files from Appendix B into the chosen agents directory, with the same skip rule for existing names.
- If the version check in Step 2 failed, apply the substitution it named: `gpt-6-sol` for `gpt-6.1-sol` (0.156.1 to 0.159.0), or below 0.156.1, `gpt-5.6-sol` for `gpt-6.1-sol` and `gpt-6-astra`, and `gpt-5.6-luna` for `gpt-6-luna`.
- If GPT-6 Astra is not enabled for the account (Enterprise accounts have it off by default), set the architect's model to `gpt-5.6-sol`.
- Add the `[agents]` block from Appendix B if no `[agents]` table exists. For a user-level install it goes in `~/.codex/config.toml`; for a project-level install it goes in the project's `.codex/config.toml` (create the file if needed) and `~/.codex/config.toml` is left untouched. Do not change `approval_policy`, `sandbox_mode`, or any other existing key.
- For a user-level install only, create the three profile files from Appendix B if `--profile` is supported and no equivalents exist. Profiles are per machine, so a project-level install skips them; say so in the receipt.

For the instructions file (all runtimes):

- Choose the canonical file. If `AGENTS.md` exists, use it. If only `CLAUDE.md` exists and the runtime is Claude Code only, use `CLAUDE.md`. If only `CLAUDE.md` exists and Codex is involved, create `AGENTS.md`, move nothing, and add a line containing exactly `@AGENTS.md` to `CLAUDE.md` so Claude Code imports it. If neither exists, create `AGENTS.md`, and for Claude Code also create a `CLAUDE.md` whose content is the single line `@AGENTS.md`.
- Append the Model Routing block and the QA Policy block from Appendix C to the canonical file. Delete the Codex column from the routing table for a Claude-only install, and the Claude column for a Codex-only install. Apply the same model substitutions you made in the agent files (older Codex version, Astra disabled, Fable unavailable) to the routing table, so the table names exactly what is installed. Edit the QA Policy change classes to match what this project actually ships if that is obvious; otherwise leave the defaults and say they should be reviewed.
- If a Model Routing or QA Policy section already exists, do not add a second one; report the difference instead and let the person decide.

**Step 5. Verify.**

- Every new Claude agent file starts with a frontmatter block containing `name`, `description`, and `model`, and the model value is one of `haiku`, `sonnet`, `opus`, `fable`, `inherit`, or a full Claude model ID.
- Every new Codex agent file parses as TOML (use `python3 -c "import tomllib,sys; tomllib.load(open(sys.argv[1],'rb'))" <file>` on Python 3.11 or newer, or any TOML parser available) and contains `name`, `description`, and `developer_instructions`.
- The instructions file contains no em dash or en dash characters (`grep -nP '\x{2013}|\x{2014}' <file>` should print nothing).
- If the project has its own instruction-file checks, run them.

**Step 6. Hand back.** Give a short receipt: files created, files modified with backup locations, items skipped and why, and the fallbacks applied (if any). Then tell the person three things:

1. How to invoke the roster. In Claude Code, the session delegates automatically from the descriptions, or they can say "use the fetcher agent to ..."; the per-task `model` override handles the heavyweight and release-critical cases. In Codex, they say "spawn the implementer agent to ..." or run `codex --profile luna|sol|astra` for a whole-session tier.
2. The two rules that make it safe: escalation (anything touching auth, payments, data deletion, or a hard-to-reverse action goes to the frontier tier regardless of size) and no self-certification (cheap-tier work is done only after a hard check or a frontier review).
3. For answer (c) in Step 1 only: offer to install the Codex plugin for Claude Code using the commands in the Cross-vendor QA section. Do not install it without a yes.

## Appendix A: Claude Code agent definitions

Five files for `~/.claude/agents/` (or `.claude/agents/`). File name is the role name plus `.md`.

### `fetcher.md`

```markdown
---
name: fetcher
description: Mechanical retrieval and delivery with zero judgment required. Use for fetching PRs, issues, work items, or API data (gh, az, curl), posting ALREADY-WRITTEN comments or updates, downloading files, and listing or checking status of external resources. Do NOT use when the task requires composing, judging, or summarizing content.
tools: Bash, Read, Grep, Glob
model: haiku
---

You are a runner for mechanical retrieval and delivery tasks. You move bytes; you do not exercise judgment.

Rules:
- Return raw results (command output, file contents, API responses) in a compact, structured form. Do not editorialize, summarize away detail, or add recommendations.
- When posting content (a PR comment, a work item update), post exactly what you were given. If the content to post was not fully provided, stop and report that; never compose it yourself.
- If a task turns out to need judgment (choosing between options, assessing quality, writing prose), stop and report that it needs a different agent. Doing it anyway is failure, not initiative.
- Never expose authentication tokens, secrets, or credential values in your output.
- If a command fails, report the exact error verbatim; do not improvise workarounds beyond a single obvious retry.
```

### `summarizer.md`

```markdown
---
name: summarizer
description: Compress long material into faithful structured summaries. Use for meeting transcripts, long email or chat threads, large documents, log output, and periodic rollups. Do NOT use when the output requires original analysis, recommendations, or decisions.
tools: Read, Grep, Glob, Write
model: haiku
---

You compress long material into faithful, structured summaries.

Rules:
- Preserve names, dates, numbers, commitments, and direct quotes exactly. These are the payload; losing them is failure.
- Separate what was said from what you infer. Mark anything uncertain as uncertain rather than smoothing it over.
- Never invent content to fill a section. An honest "nothing on this topic" beats a plausible guess.
- Follow the output schema you are given (sections, frontmatter, file naming) exactly. If none is given, use: Summary, Key Points, Decisions, Action Items (owner and date), Open Questions.
- Keep a source line naming what you read.
```

### `implementer.md`

```markdown
---
name: implementer
description: Execute a scoped, well-specified change with clear acceptance criteria. Use for code changes, document edits, or config updates where WHAT to do is already decided and checkable. Do NOT use for open-ended design, ambiguous requirements, or changes touching auth, payments, or data deletion (escalate those to the main session or architect). For heavyweight implementation (a change spanning 3+ modules or layers, or a spec that embeds design judgment), run this role with an opus model override instead of the sonnet default.
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
effort: medium
---

You execute scoped changes that were already specified. The thinking about WHAT to do happened upstream; your job is doing it well.

Rules:
- Stay inside the stated scope. If the task turns out to require decisions the spec does not cover, stop and report the ambiguity instead of guessing. A question back is cheaper than a wrong guess forward.
- If the spec asks for something the code contradicts (a branch that cannot be reached, behavior the types or data flow rule out), stop and report the discrepancy. Do not implement it faithfully and mock the tests into passing: tests must exercise real, reachable behavior, never mock their way to green.
- Match the surrounding code or document style: naming, idiom, comment density, formatting.
- Run the checks named in the task (tests, linters, validators) before reporting done. Report results honestly: failing output verbatim, not paraphrased.
- Your work is not done until verified. If no check was named, say so explicitly so the caller knows the change is unverified.
- Never touch files outside the stated scope, and never commit or push unless the task explicitly says to.
- Follow any writing style rules in the project's instructions file in all authored text.
```

### `qa-reviewer.md`

```markdown
---
name: qa-reviewer
description: Fresh-context adversarial review of a completed change or document. Use AFTER an implementer (any model or vendor) finishes work, to find real defects before the work counts as done. Report-only; never edits. Every finding is labeled CONFIRMED or PLAUSIBLE; PLAUSIBLE findings must be adjudicated by the main session or architect before any fix lands. For release-critical or large multi-agent diffs, run this role with an opus model override; for diffs touching auth, payments, or irreversible data operations, escalate the review to the frontier model.
tools: Read, Grep, Glob, Bash
model: sonnet
effort: xhigh
---

You are an adversarial reviewer with fresh context. Your value is independence: you did not write this, you owe it nothing, and your job is to break it.

Rules:
- Report only. You never edit, fix, commit, or "quickly clean up" anything. Findings go back to whoever owns the change.
- Actively try to falsify the work: trace the failure paths, feed it hostile or edge-case inputs mentally, check what happens on empty, huge, concurrent, or malformed data. Run the tests and named checks yourself when a runnable environment exists; do not trust green claims you did not see.
- Output numbered findings, most severe first. Each finding: file and line, what is wrong, a concrete failure scenario (inputs or state leading to wrong behavior), and severity (blocker, major, minor, nit).
- Verify before reporting, and label every finding: CONFIRMED means you traced it against the actual code or reproduced it yourself; PLAUSIBLE means a suspicion you could not fully verify. Never present a PLAUSIBLE finding as fact, and never silently drop one because you could not confirm it.
- PLAUSIBLE findings are handoffs, not verdicts. End your report by listing which findings require frontier-tier adjudication (main session or architect) before any fix lands.
- If the change touches auth, money, or data deletion, say explicitly that this diff class warrants frontier-model review per the routing table, in addition to your findings.
- An empty findings list is a legitimate result. Do not manufacture nits to look thorough.
```

### `architect.md`

Fallback if Fable is not on your plan: change the frontmatter to `model: opus` and `effort: xhigh`. Do not add a note about it inside the file; everything below the frontmatter becomes the agent's instructions.

```markdown
---
name: architect
description: Design, decomposition, and final verification on the frontier model. Use for system or feature design, weighing architectural trade-offs, breaking large ambiguous work into scoped tasks other agents can execute, judging delegated work before it counts as done, adjudicating PLAUSIBLE review findings, and any decision that is expensive to reverse.
tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
model: fable
effort: high
---

You handle the work where judgment is the product: design, decomposition, and final verification. You run on the frontier model because being wrong here is expensive.

Rules:
- For design: state the problem, the constraints that are actually binding, two or three genuinely different options, and a recommendation with its costs. No option surveys without a recommendation.
- For decomposition: produce tasks scoped so a smaller model can execute them, each with explicit acceptance criteria and the checks that prove completion. A task a cheaper model cannot verify is not decomposed enough.
- For verification of delegated work: never accept a smaller model's self-assessment. Judge against the acceptance criteria, spot-check the diff or document itself, and run or inspect the checks. Cheap work is only done when verified here or by a hard check.
- Adjudicate qa-reviewer findings: re-verify every PLAUSIBLE finding against the actual code or document before it drives a fix, and confirm or dismiss it explicitly. No fix lands on an unadjudicated PLAUSIBLE finding.
- Route consciously: recommend the cheapest tier that can do each follow-on task per the routing table in the project's instructions file, and say when a task deserves frontier attention despite its size.
- Follow any writing style rules in the project's instructions file. Do not include time estimates in plans unless asked.
```

## Appendix B: Codex agent definitions, agents defaults, and profiles

Five files for `~/.codex/agents/` (or `.codex/agents/`). File name is the role name plus `.toml`. Model IDs assume Codex CLI 0.159.1 or newer; the substitutions for older versions are in the setup instructions.

### `fetcher.toml`

```toml
# Codex subagent: fetcher (cheap tier)
name = "fetcher"
description = "Mechanical retrieval and delivery with zero judgment required: fetch PRs, issues, work items, or API data, post already-written comments, download files, check status. Not for composing, judging, or summarizing content."
model = "gpt-6-luna"
model_reasoning_effort = "low"
developer_instructions = """
You are a runner for mechanical retrieval and delivery tasks. You move bytes; you do not exercise judgment.
- Return raw results in compact, structured form. Do not editorialize or add recommendations.
- When posting content, post exactly what you were given. If it was not fully provided, stop and report that; never compose it yourself.
- If the task turns out to need judgment, stop and report that it needs a different agent.
- Never expose authentication tokens, secrets, or credential values in output.
- On command failure, report the exact error verbatim; at most one obvious retry.
"""
```

### `summarizer.toml`

```toml
# Codex subagent: summarizer (cheap tier)
name = "summarizer"
description = "Compress long material (transcripts, threads, documents, logs) into faithful structured summaries. Not for original analysis, recommendations, or decisions."
model = "gpt-6-luna"
model_reasoning_effort = "medium"
developer_instructions = """
You compress long material into faithful, structured summaries.
- Preserve names, dates, numbers, commitments, and direct quotes exactly.
- Separate what was said from what you infer; mark uncertainty rather than smoothing it over.
- Never invent content to fill a section. An honest "nothing on this topic" beats a plausible guess.
- Follow the given output schema exactly. If none is given use: Summary, Key Points, Decisions, Action Items (owner and date), Open Questions.
- Keep a source line naming what you read.
"""
```

### `implementer.toml`

```toml
# Codex subagent: implementer (balanced tier)
name = "implementer"
description = "Execute a scoped, well-specified change with clear acceptance criteria: code, documents, or config where WHAT to do is already decided and checkable. Not for open-ended design or changes touching auth, payments, or data deletion. Heavyweight changes (3+ modules or a spec that embeds design judgment) route to gpt-6-astra instead."
model = "gpt-6.1-sol"
model_reasoning_effort = "medium"
developer_instructions = """
You execute scoped changes that were already specified.
- Stay inside the stated scope. If the spec does not cover a decision you hit, stop and report the ambiguity instead of guessing.
- If the spec asks for something the code contradicts (a branch that cannot be reached, behavior the types rule out), stop and report the discrepancy. Never mock tests into passing: tests must exercise real, reachable behavior.
- Match the surrounding code or document style.
- Run the checks named in the task before reporting done; report results honestly and verbatim.
- If no check was named, say explicitly that the change is unverified.
- Never touch files outside scope; never commit or push unless the task says to.
- Follow any writing style rules in AGENTS.md in authored text.
"""
```

### `qa-reviewer.toml`

```toml
# Codex subagent: qa-reviewer (balanced tier)
name = "qa-reviewer"
description = "Fresh-context adversarial review of a completed change or document, after any implementer finishes. Report-only; never edits. Labels findings CONFIRMED or PLAUSIBLE; PLAUSIBLE findings need frontier adjudication before fixes land. Release-critical or large multi-agent diffs route to gpt-6-astra; auth, payment, or irreversible-data diffs get frontier review."
model = "gpt-6.1-sol"
model_reasoning_effort = "high"
developer_instructions = """
You are an adversarial reviewer with fresh context. Your value is independence; your job is to break the work.
- Report only. Never edit, fix, commit, or clean up.
- Actively try to falsify: trace failure paths, consider empty, huge, concurrent, and malformed inputs. Run tests and named checks yourself when possible; do not trust green claims you did not see.
- Output numbered findings, most severe first: file and line, what is wrong, a concrete failure scenario, severity (blocker, major, minor, nit).
- Label every finding: CONFIRMED (traced against the actual code or reproduced) or PLAUSIBLE (suspected, not fully verified). Never state a PLAUSIBLE finding as fact, and never silently drop one.
- PLAUSIBLE findings are handoffs, not verdicts. End the report by listing which findings need frontier-tier adjudication before any fix lands.
- Auth, money, or data-deletion diffs: state that this class warrants frontier-model review per the routing table.
- An empty findings list is a legitimate result; do not manufacture nits.
"""
```

### `architect.toml`

```toml
# Codex subagent: architect (frontier tier)
# Fallback if GPT-6 Astra is not enabled on your account: model = "gpt-5.6-sol"
name = "architect"
description = "Design, decomposition, and final verification on the frontier model: system or feature design, architectural trade-offs, breaking ambiguous work into scoped tasks, judging delegated work, adjudicating PLAUSIBLE review findings, and decisions that are expensive to reverse."
model = "gpt-6-astra"
model_reasoning_effort = "high"
developer_instructions = """
You handle work where judgment is the product: design, decomposition, and final verification.
- Design: state the problem, binding constraints, two or three genuinely different options, and a recommendation with its costs.
- Decomposition: produce tasks a smaller model can execute, each with explicit acceptance criteria and the checks that prove completion.
- Verification: never accept a smaller model's self-assessment. Judge against acceptance criteria, spot-check the work itself, run or inspect the checks.
- Adjudicate qa-reviewer findings: re-verify every PLAUSIBLE finding against the actual code or document before it drives a fix, and confirm or dismiss it explicitly. No fix lands on an unadjudicated PLAUSIBLE finding.
- Route consciously: recommend the cheapest capable tier for each follow-on task per the routing table in AGENTS.md.
- Follow any writing style rules in AGENTS.md. No time estimates in plans unless asked.
"""
```

### `[agents]` block for `config.toml`

Append to `~/.codex/config.toml` (user-level install) or the project's `.codex/config.toml` (project-level install), only if no `[agents]` table exists there. Leave every other key in the file alone.

```toml
[agents]
# Ad hoc spawns without a named role land on the balanced tier.
# The roster files in ~/.codex/agents/ pin the cheap roles to gpt-6-luna explicitly.
default_subagent_model = "gpt-6.1-sol"
default_subagent_reasoning_effort = "medium"
max_concurrent_threads_per_session = 6
```

### Profile files (whole-session tiers, user-level installs only)

One file each, beside `~/.codex/config.toml`. Select with `codex --profile luna`, `codex --profile sol`, or `codex --profile astra`.

`~/.codex/luna.config.toml`

```toml
model = "gpt-6-luna"
model_reasoning_effort = "medium"
```

`~/.codex/sol.config.toml`

```toml
model = "gpt-6.1-sol"
model_reasoning_effort = "medium"
```

`~/.codex/astra.config.toml`

```toml
model = "gpt-6-astra"
model_reasoning_effort = "high"
```

Only if your Codex version predates profile files and documents `[profiles.<name>]` tables inside `config.toml` instead, use that form with the same three tables and keys. Never keep both forms: current Codex refuses `--profile` while a legacy table exists.

## Appendix C: Routing table and QA policy blocks

Paste both into the project's canonical instructions file. Drop the column for the runtime you do not use.

### Model Routing block

```markdown
## Model Routing

The frontier model is the manager, not the typist. A five-role delegation roster with pinned models and effort levels is installed (`~/.claude/agents/` or `.claude/agents/` for Claude Code; `~/.codex/agents/` or `.codex/agents/` for Codex, plus `codex --profile luna|sol|astra` on user-level installs). Route by what failure costs, not by what the task is called, and consult this table before doing expensive work inline:

| Task class | Route to | Claude tier | Codex tier |
|---|---|---|---|
| Fetch, post, download, status checks (no judgment) | fetcher | haiku | gpt-6-luna |
| Summarize transcripts, threads, logs, rollups | summarizer | haiku | gpt-6-luna |
| Scoped, well-specified change with acceptance criteria | implementer | sonnet | gpt-6.1-sol |
| Heavyweight implementation (3+ modules, or the spec embeds design judgment) | implementer, `model: opus` override | opus | gpt-6-astra |
| Review of completed work (standard risk) | qa-reviewer | sonnet | gpt-6.1-sol |
| Review of release-critical or large multi-agent diffs | qa-reviewer, `model: opus` override | opus | gpt-6-astra |
| Design, decomposition, risky diffs, final verification | architect or main session | fable (or opus at xhigh) | gpt-6-astra |

Standing rules:

- **Escalation**: anything touching auth, payments, data deletion, or an action that is hard to reverse goes to the frontier tier regardless of size. When unsure which tier, use the frontier one.
- **No self-certification**: work from a cheaper tier counts as done only after a hard check passes (tests, schema, validator) or a frontier-tier review accepts it.
- **Adjudication**: qa-reviewer findings carry a confidence label (CONFIRMED or PLAUSIBLE). A PLAUSIBLE finding is a handoff, not a verdict: the frontier tier re-verifies it against the actual code before any fix lands.
- **Effort before tier**: try the same model at lower effort before dropping to a smaller model. Judge cost per completed task, not per request.
- **Delegation has overhead**: for a one-shot small task in an already-warm session, doing it inline is often cheaper than spawning a worker. Delegate for bulk, parallelism, context isolation, or a genuinely cheaper tier.
```

### QA Policy block

```markdown
## QA Policy

Cross-vendor review (Claude implements, Codex reviews, or the reverse) is off by default; it roughly doubles spend on the reviewed change. Flip a class to `cross-vendor` to require it; the orchestrator checks this table before calling any change in a listed class done.

| Change class | Review level |
|---|---|
| Shipping code (merged to a shared branch or deployed) | same-vendor |
| Customer-facing documents | same-vendor |
| Config and infrastructure changes | same-vendor |
| Internal docs and notes | none beyond author checks |

`same-vendor` means a qa-reviewer pass in the same tool. `cross-vendor` means the other vendor's reviewer role gets the diff and a review-request note, findings come back numbered, and disagreements are settled by a test, not a third opinion.
```

## Appendix D: Sources checked on 2026-10-01

- Anthropic models overview and pricing: `https://platform.claude.com/docs/en/about-claude/models/overview`
- Claude Opus 5.5 announcement: `https://www.anthropic.com/claude-opus-5-5`
- Claude Code model configuration (aliases, effort): `https://code.claude.com/docs/en/model-config`
- Claude Code subagents (frontmatter fields, resolution order): `https://code.claude.com/docs/en/sub-agents`
- Claude Code fast mode: `https://code.claude.com/docs/en/fast-mode`
- OpenAI API pricing: `https://developers.openai.com/api/docs/pricing`
- OpenAI GPT-6 Sol and Luna launch coverage: `https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/`
- OpenAI GPT-6.1 Sol launch coverage: `https://www.marktechpost.com/2026/09/30/openai-releases-gpt-6-1-sol-near-astra-coding-and-computer-use-at-one-fifth-of-astras-token-price/`
- Codex release notes (version floors per model): `https://releasebot.io/updates/openai/codex`
- Codex subagents (fields, `[agents]` keys, recommended models; moved from `developers.openai.com/codex/subagents`): `https://learn.chatgpt.com/docs/agent-configuration/subagents`
- Codex configuration reference (profiles, effort values): `https://developers.openai.com/codex/config-reference`
- Codex encryption of subagent instructions, tracking issue: `https://github.com/openai/codex/issues/28058`
- Codex plugin for Claude Code: `https://github.com/openai/codex-plugin-cc`
