# Reference: Routing Table and QA Policy Blocks

Paste-ready blocks for a project's canonical instructions file (`AGENTS.md`, or `CLAUDE.md` if that is the project's canon). Adjust before pasting: drop the Codex column for Claude-only projects (and the reverse), and edit the QA change classes to match what this project actually ships.

## Model Routing block

```markdown
## Model Routing

The frontier model is the manager, not the typist. A five-role delegation roster with pinned models is installed (`.claude/agents/` or `~/.claude/agents/` for Claude Code; `.codex/agents/` or `~/.codex/agents/` plus `--profile luna|terra|sol` for Codex). Route by what failure costs, not by what the task is called, and consult this table before doing expensive work inline:

| Task class | Route to | Claude tier | Codex tier |
|---|---|---|---|
| Fetch, post, download, status checks (no judgment) | fetcher | haiku | gpt-5.6-luna |
| Summarize transcripts, threads, logs, rollups | summarizer | haiku | gpt-5.6-luna |
| Scoped, well-specified change with acceptance criteria | implementer | sonnet | gpt-5.6-terra |
| Heavyweight implementation (3+ modules, or the spec embeds design judgment) | implementer, `model: opus` override | opus | gpt-5.6-sol |
| Review of completed work (standard risk) | qa-reviewer | sonnet | gpt-5.6-terra |
| Review of release-critical or large multi-agent diffs | qa-reviewer, `model: opus` override | opus | gpt-5.6-sol |
| Design, decomposition, risky diffs, final verification | architect or main session | frontier | gpt-5.6-sol |

Standing rules:

- **Escalation**: anything touching auth, payments, data deletion, or an action that is hard to reverse goes to the frontier tier regardless of size. When unsure which tier, use the frontier one.
- **No self-certification**: work from a cheaper tier counts as done only after a hard check passes (tests, schema, validator) or a frontier-tier review accepts it.
- **Adjudication**: qa-reviewer findings carry a confidence label (CONFIRMED or PLAUSIBLE). A PLAUSIBLE finding is a handoff, not a verdict: the frontier tier (main session or architect) re-verifies it against the actual code before any fix lands.
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

## Codex profiles block (for `~/.codex/config.toml` or a project `.codex/config.toml`)

```toml
# Model tier profiles for the routing table.
# Usage: codex --profile luna | terra | sol, or codex exec -m <model> for one-shots.
# Use the exact runtime-exposed model IDs; generic family IDs can be rejected.
[profiles.luna]
model = "gpt-5.6-luna"
model_reasoning_effort = "medium"

[profiles.terra]
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"

[profiles.sol]
model = "gpt-5.6-sol"
model_reasoning_effort = "high"
```

Tier names and prices drift; re-verify model IDs against the live runtime when installing, and treat the ratios (cheap / balanced / frontier) as the durable part.
