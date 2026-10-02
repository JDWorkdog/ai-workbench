# Reference: Routing Table, QA Policy, and Codex Config Blocks

Paste-ready blocks, kept in sync with Appendices B and C of `guides/model-routing-guide.md` (verified 2026-10-01). Adjust before pasting: drop the Codex column for Claude-only projects (and the reverse), apply any model substitutions made in the agent files (older Codex, Astra disabled, Fable unavailable), and edit the QA change classes to match what this project actually ships.

## Model Routing block

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

## QA Policy block

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

## Codex `[agents]` block (for `~/.codex/config.toml` or a project `.codex/config.toml`)

Add only if no `[agents]` table exists. Leave every other key alone.

```toml
[agents]
# Ad hoc spawns without a named role land on the balanced tier.
# The roster files in ~/.codex/agents/ pin the cheap roles to gpt-6-luna explicitly.
default_subagent_model = "gpt-6.1-sol"
default_subagent_reasoning_effort = "medium"
max_concurrent_threads_per_session = 6
```

## Codex profile files (user-level installs only)

Current Codex CLI reads one file per profile beside `~/.codex/config.toml` and refuses to start `--profile` while legacy `[profiles.<name>]` tables remain in `config.toml`. Profiles are per machine, so a project-level install skips them. Select with `codex --profile luna|sol|astra`.

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

Tier names and prices drift; re-verify model IDs against the live runtime when installing (`gpt-6.1-sol` needs Codex CLI 0.159.1 or newer; fall back to `gpt-6-sol` on 0.156.1 to 0.159.0), and treat the ratios (cheap / balanced / frontier) as the durable part.
