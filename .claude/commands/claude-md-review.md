You are a Claude Code configuration specialist. Review the user's CLAUDE.md setup across all levels and provide actionable recommendations to improve effectiveness.

**Input:** $ARGUMENTS (optional: path to a specific project to review, or "global" to review only the user-level config. If blank, review the current working directory's project setup AND the global config.)

## Instructions

### 1. Discovery Phase

Find and read ALL Claude Code configuration files relevant to the scope. Search systematically:

**Global (always check — adapt paths for the current platform):**

The user-level config directory is:
- macOS / Linux: `~/.claude/`
- Windows: `%USERPROFILE%\.claude\`

Check these files within that directory:
- `CLAUDE.md` — user-level global instructions
- `rules/` — user-level modular rules
- `MEMORY.md` — auto-memory index (if exists)
- `settings.json` — global settings and hooks

Also check for the managed (org-wide) policy file:
- macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`
- Windows: `%PROGRAMDATA%\ClaudeCode\CLAUDE.md`
- Linux: `/etc/claude-code/CLAUDE.md`

**Project-level (for each project in scope):**
- `./CLAUDE.md` and `./.claude/CLAUDE.md` — project instructions
- `./CLAUDE.local.md` and `./.claude/CLAUDE.local.md` — local overrides
- `./.claude/rules/` — modular project rules
- `./.claude/settings.json` and `./.claude/settings.local.json` — project settings and hooks
- `./.claude/commands/` — custom slash commands
- `./.claude/skills/` — skill files
- `./.claude/agents/` — agent definitions
- `./AGENTS.md` — cross-tool agent instructions (if exists)
- `./.gitignore` — check if local files are properly excluded

**Subdirectory CLAUDE.md files:**
- Search for any `CLAUDE.md` files in subdirectories (common in monorepos)

Catalog every file found with its path, line count, and a one-line summary of its purpose.

### 2. Analysis Phase

Evaluate each file and the overall configuration against these criteria:

#### A. File Hygiene
- **Length check:** Is any CLAUDE.md file over 200 lines? Flag files that are too long.
- **Staleness check:** Are there references to files, commands, or patterns that no longer exist in the codebase? Spot-check a sample of referenced paths and commands.
- **Duplication check:** Is the same instruction repeated across multiple files? Identify redundancies.
- **Conflict check:** Do any files contain contradictory instructions? (e.g., one says "use npm" and another says "use pnpm")
- **Sensitivity check:** Are there any credentials, API keys, tokens, or connection strings in any CLAUDE.md file?

#### B. Content Quality
- **Specificity:** Are instructions concrete and verifiable, or vague and generic? Flag lines like "write clean code" or "handle errors properly."
- **Positive framing:** Are there prohibitions that should be reframed as affirmative instructions? (e.g., "Do NOT use X" → "Use Y exclusively")
- **Signal-to-noise ratio:** Are there instructions that Claude would follow anyway without being told? These waste context budget.
- **Critical rule placement:** Are the most important rules at the top of the file? Or buried in the middle?
- **Emphasis overuse:** Is `IMPORTANT` or bold used so frequently that nothing stands out?

#### C. Content Placement
Evaluate whether content is in the right file/mechanism:

| Content Type | Belongs In | Not In |
|---|---|---|
| Stable project standards, architecture | Project `CLAUDE.md` | Memory, skills |
| Personal preferences (communication style, tool choices) | Global `~/.claude/CLAUDE.md` | Project CLAUDE.md |
| Linting, formatting, code style enforcement | Hooks (`settings.json`) | CLAUDE.md (advisory only) |
| Build commands Claude discovers on its own | Auto Memory (`MEMORY.md`) | CLAUDE.md (let Claude learn) |
| Domain knowledge needed only sometimes | Skills (`.claude/skills/`) | CLAUDE.md (loads every session) |
| Repeatable multi-step workflows | Commands (`.claude/commands/`) | CLAUDE.md |
| Path-specific rules (e.g., API patterns for `src/api/`) | `.claude/rules/` with path frontmatter | Main CLAUDE.md |
| Hard requirements (must run linter, must run tests) | Hooks in `settings.json` | CLAUDE.md (not enforced) |
| Personal per-project overrides | `CLAUDE.local.md` (gitignored) or `@~/.claude/` import | Project CLAUDE.md |
| Cross-agent instructions (used by multiple AI tools) | `AGENTS.md` with `@AGENTS.md` import | Duplicated in CLAUDE.md |

Flag any content that's in the wrong place and recommend where it should move.

#### D. Missing Essentials
Check whether the project CLAUDE.md covers these common high-value categories (flag any that are missing and would be beneficial):

- [ ] Build and test commands
- [ ] Key architecture decisions / directory structure
- [ ] Coding standards that differ from language defaults
- [ ] Workflow conventions (branching, commits, PRs)
- [ ] Environment requirements and gotchas
- [ ] Autonomy boundaries (what Claude can do freely vs. needs approval)
- [ ] Domain-specific terminology (if applicable)

#### E. Ecosystem Utilization
Check whether the team is using the available tooling effectively:

- **Rules directory:** Would the project benefit from splitting into `.claude/rules/`? (Especially if the main file is long or covers many topics)
- **Path-scoped rules:** Are there instructions that only apply to certain file patterns? These should use path frontmatter.
- **Hooks:** Are there rules in CLAUDE.md that should be enforced via hooks instead of advised?
- **Skills:** Is there domain knowledge in CLAUDE.md that's only needed occasionally? It should be a skill.
- **Commands:** Are there repeatable workflows described in prose? They should be commands.
- **Imports:** Is content duplicated from README, package.json, or other docs? Use `@file` imports instead.
- **AGENTS.md:** If the team uses multiple AI coding tools, is there an AGENTS.md that could be shared?
- **`.gitignore`:** Is `CLAUDE.local.md` properly gitignored? Is it accidentally checked into version control?

#### F. Global Config Review
If the user has a global `~/.claude/CLAUDE.md`:
- Is it appropriately scoped to universal preferences (not project-specific)?
- Is it concise (under 50 lines)?
- Does it conflict with any project-level files?

If they don't have one, note this as an opportunity.

### 3. Generate Report

**Save location:**
- If a project path was specified: `personal/projects/<project-name>/claude-md-review.md`
- If reviewing current directory: save alongside the project's other docs, or `personal/drafts/YYYY-MM-DD_claude-md-review.md`
- If "global" scope: `personal/drafts/YYYY-MM-DD_global-claude-config-review.md`

**Report structure:**

```markdown
# Claude Code Configuration Review

**Date:** YYYY-MM-DD
**Scope:** [What was reviewed — global config, specific project, or both]

---

## Configuration Inventory

| # | File | Location | Lines | Purpose |
|---|------|----------|-------|---------|
| 1 | ... | ... | ... | ... |

---

## Overall Assessment

[2-3 sentences: How well-configured is this setup? What's the single biggest improvement opportunity?]

### Scorecard

| Category | Rating | Notes |
|----------|--------|-------|
| File hygiene | {Good/Needs Work/Poor} | {One-line summary} |
| Content quality | {Good/Needs Work/Poor} | {One-line summary} |
| Content placement | {Good/Needs Work/Poor} | {One-line summary} |
| Essential coverage | {Good/Needs Work/Poor} | {One-line summary} |
| Ecosystem utilization | {Good/Needs Work/Poor} | {One-line summary} |

---

## Findings

### {Finding category}

#### {FN-NN}: {Descriptive title}

**Current state:** {What exists now — quote the relevant line(s) or describe the gap}

**Issue:** {Why this is a problem}

**Recommendation:** {Specific, actionable fix — what to change, where to move it, or what to add}

[Repeat for each finding, grouped by category]

---

## Content Migration Plan

[If content needs to move between files/mechanisms, list it clearly:]

| Content | Currently In | Move To | Reason |
|---------|-------------|---------|--------|
| {Description} | {Current file} | {Target file/mechanism} | {Why} |

---

## Missing Essentials

[List any high-value categories not covered, with a starter example of what to add]

---

## Quick Wins

[Top 3-5 changes that would have the most immediate impact, ordered by effort (easiest first)]

1. {Change} — {Why it matters}
2. {Change} — {Why it matters}
3. {Change} — {Why it matters}
```

### 4. Output

- Save the report to the path determined above
- Present a concise summary to the user:
  - Overall health assessment (1-2 sentences)
  - Number of findings by category
  - Top 3 quick wins
  - Any urgent issues (credentials in files, missing .gitignore entries)
- Offer to help implement any of the recommendations
