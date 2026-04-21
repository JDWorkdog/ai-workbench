# Agents

Agents are named Claude Code sub-agents you can invoke for specialized work. Each agent has its own system prompt, tool allowlist, and (optionally) model choice. Parent sessions delegate tasks via the `Agent` tool.

## Agent vs Command vs Skill

| Use an… | When you want… |
|---|---|
| **Command** | A one-shot workflow the *user* triggers with a slash. |
| **Skill** | Capability loaded into the current session on demand. |
| **Agent** | A separate sub-session with its own context budget, tools, and role — typically spawned by commands or orchestrators. |

## Agent File Layout

```
.claude/agents/<agent-name>.md
```

With frontmatter:

```yaml
---
name: <agent-name>
description: When to use this agent
tools: [Read, Grep, Glob]   # optional
model: sonnet               # optional (sonnet | opus | haiku)
---

# System prompt content
```

## This Folder Is Empty

No agents are shipped with the base workspace. Good candidates to add later:
- `repo-deep-diver` — the parallel orchestrator behind `/repo-deep-dive` currently runs as loose sub-agent spawns; formalizing it here would make the pattern reusable.
- `meeting-extractor` — a focused sub-agent for `/meeting-summary` that only has Read + Write access to the transcript and journal.
