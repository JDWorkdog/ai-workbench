Generate or regenerate a monthly journal rollup.

## Input

`$ARGUMENTS` is a month in `YYYY-MM` form (for example `2026-06`). If no argument is given, default to the most recent fully completed month. Refuse months with no daily files rather than writing an empty rollup.

## Steps

1. Read `personal/journal/SCHEMA.md` for the canonical rollup format. It is the single source of truth; do not improvise sections.
2. List the month's dailies: `personal/journal/<YYYY>/<YYYY-MM>-*.md`.
3. Delegate the synthesis to the **summarizer** tier per the Model Routing table in `AGENTS.md` (this is exactly the "journal or monthly rollups" case). If this project has no summarizer role installed (no delegation roster in `.claude/agents/` or `~/.claude/agents/`), do the synthesis inline in this session instead; the output requirements are identical. Either way, the writer reads every daily for the month and produces the rollup body:
   - **Decisions**: dated, one line each, with a relative link to the source daily.
   - **People Met**: each person with the dates they appeared.
   - **Promises Made / Promises Received**: commitments in each direction, dated and linked.
   - **Action Items Opened / Action Items Closed**: matched where the dailies show closure.
   - **Notable Events**: releases, incidents, milestones, anything a future search would want.
   - Frontmatter: `month`, `type: rollup`, and complete `people`, `accounts`, `topics` lists for the month.
4. Verify before accepting (the summarizer does not self-certify): frontmatter parses, every section from the schema is present, links resolve to files that exist, and dates all fall inside the month.
5. Write to `personal/journal/rollups/<YYYY-MM>.md`, overwriting any existing rollup for that month (rollups are regenerable; dailies are the source of truth).
6. Report: months written, entity counts, and any dailies that could not be read.

## Notes

- Historical dailies (before 2026-07-17) have no frontmatter and use older section names; the summarizer should extract from body text, not rely on structure.
- Never edit the dailies themselves from this command.

---

**Month to roll up:**

$ARGUMENTS
