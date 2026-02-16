# Plan: `/repo-deep-dive` Orchestrator Command

## Context

We have 4 per-repo deep-dive commands (`/repo-features`, `/repo-code-review`, `/repo-tech-detailed`, `/repo-arch-review`) that each explore a codebase and generate a detailed document. Running them sequentially in one session risks exhausting the context window. The user wants a single command that asks questions upfront, then delegates all 4 analyses to parallel sub-agents.

`/repo-system-map` is excluded — it's cross-repo and doesn't fit a single-repo orchestrator.

## What We're Creating

| File | Action |
|------|--------|
| `.claude/commands/repo-deep-dive.md` | **Create** — Orchestrator command |
| `.claude/CLAUDE.md` | **Edit** — Add to command table |

## Command Design

### Flow

1. Parse `$ARGUMENTS` to resolve repo name + paths
2. Verify base docs exist (`{repo}-functional.md` + `{repo}-tech-stack.md`) — error if missing
3. Ask **one lens question** (A/B/C/D) — same as the individual commands
4. Ask **which analyses to run** (1-4, default all) — gives flexibility to skip any
5. Spawn selected analyses as **parallel sub-agents** via the Task tool
6. Collect results and display summary

### Sub-Agent Strategy

- **Agent type**: `general-purpose` (needs Read, Write, Glob, Grep, Bash)
- **Parallelism**: All agents spawned in a single Task tool call
- **Prompt per agent**: Provides repo name, repo path, project folder, lens choice, and instructs the agent to read the corresponding command file (e.g., `.claude/commands/repo-features.md`) and execute its template — skipping the lens question and prerequisite check since those were handled upfront
- **Independence**: Each agent has its own fresh context window, no coordination needed between them
- **Error handling**: If one agent fails, others continue; summary notes any failures

### Analysis Mapping

| # | Analysis | Command File to Read | Output File |
|---|----------|---------------------|-------------|
| 1 | Feature deep dive | `repo-features.md` | `{repo}-features-detailed.md` |
| 2 | Code quality review | `repo-code-review.md` | `{repo}-code-review.md` |
| 3 | Technical deep dive | `repo-tech-detailed.md` | `{repo}-tech-detailed.md` |
| 4 | Architecture review | `repo-arch-review.md` | `{repo}-arch-review.md` |

## Command File Structure

Follows the established pattern (line 1 = description, `$ARGUMENTS` input, numbered instruction steps):

```
Run all repository deep-dive analyses in parallel using sub-agents.

**Input:** $ARGUMENTS (repository name, project path, or repository path)

## Instructions

### 1. Resolve Repository
  - Extract repo name, project folder path, repo path from $ARGUMENTS

### 2. Validate Prerequisites
  - Check for {repo}-functional.md and {repo}-tech-stack.md
  - Stop with error if missing (tell user to run /repo-analysis first)

### 3. Collect User Input
  - Lens question (A/B/C/D) — one question, applied to all analyses
  - Analysis selection (1-4, default all)

### 4. Display Execution Plan
  - Show what will run, lens, output files

### 5. Spawn Sub-Agents in Parallel
  - One Task tool call with all selected agents
  - Each agent prompt: repo context + lens + "read command file and execute"
  - Agents must NOT re-ask questions

### 6. Collect Results & Report
  - Summary with file locations + key findings from each
  - Note any failures with command to re-run individually
```

## CLAUDE.md Update

Add one row to the command table:

```
| `/repo-deep-dive` | Run all deep-dive analyses in parallel via sub-agents | `personal/projects/<repo-name>/` |
```

## Verification

1. `ls .claude/commands/repo-deep-dive.md` — file exists
2. Read file to confirm structure matches pattern (first-line description, Input, Instructions)
3. Read `.claude/CLAUDE.md` to confirm command table includes new entry
4. User tests by running `/repo-deep-dive DTCloud` in a new session
