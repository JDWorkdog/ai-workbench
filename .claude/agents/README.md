# Agents

Agents are named sub-agents with their own system prompt, tool allowlist, and (optionally) a pinned model. The parent session delegates tasks to them via the `Agent` tool. This folder ships the workbench's delegation roster; the routing table in `AGENTS.md` says when to use each one.

## The Shipped Roster

| Agent | Model | Use for |
|---|---|---|
| `fetcher` | haiku | Mechanical retrieval and delivery, zero judgment |
| `summarizer` | haiku | Faithful compression of transcripts, threads, logs, rollups |
| `implementer` | sonnet | Scoped, well-specified changes with acceptance criteria |
| `qa-reviewer` | sonnet | Fresh-context adversarial review of completed work |
| `architect` | inherit (frontier) | Design, decomposition, final verification |

The Codex equivalents live in `.codex/agents/*.toml` with tier substitutions (luna, terra, sol). The method behind the roster is in `guides/model-routing-guide.md`; use `/tune-my-harness` to install the same layer in another project.

## Agent vs Command vs Skill

| Use a... | When you want... |
|---|---|
| **Command** | A one-shot workflow the user triggers with a slash. |
| **Skill** | Capability loaded into the current session on demand. |
| **Agent** | A separate sub-session with its own context budget, tools, and role, typically spawned for delegation. |

## Agent File Layout

```
.claude/agents/<agent-name>.md
```

With frontmatter:

```yaml
---
name: <agent-name>
description: When to use this agent (write it as a routing rule)
tools: Read, Grep, Glob        # optional allowlist
model: sonnet                  # haiku | sonnet | opus | inherit
---

# System prompt content
```

Keep each `description` selection-oriented: what the role is for and what it must NOT be used for. Descriptions load into every session, so they must earn their length.
