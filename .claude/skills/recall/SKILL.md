---
name: recall
description: Answer history questions from the journal system ("when did we meet X", "what did we promise Y", "what happened with Z last fall"). Searches dossiers, then monthly rollups, then targeted dailies, with bounded context at every step. Use for any question about past meetings, commitments, people, accounts, or decisions.
---

# Recall

Entity or topic in, answer out. The journal system is tiered exactly so this skill never has to load the whole archive: dossiers answer entity questions in one file, rollups answer month questions in one file, dailies supply verbatim detail only once you know which day to open.

The tier formats are defined in `personal/journal/SCHEMA.md`. Layout:

- Dossiers: `personal/people/<slug>.md`, `personal/accounts/<slug>.md`
- Rollups: `personal/journal/rollups/YYYY-MM.md`
- Dailies: `personal/journal/<YYYY>/YYYY-MM-DD-DAY.md`

## Search Order (stop as soon as the question is answered)

**1. Dossier first.** For any question naming a person or account, glob the two dossier folders for a matching slug (check `aliases` in frontmatter if the obvious slug misses). The Log, Commitments, and Open Threads sections usually answer "when did we last talk", "what did we promise", and "where did we leave off" outright.

**2. Rollups second.** For topic questions, date-range questions, or dossier misses, grep `personal/journal/rollups/` for the entity or topic. Rollup frontmatter lists every person and account mentioned that month, so a name grep finds the right months even when the question is vague about timing. Read only the matching rollups.

**3. Targeted dailies third.** Once a dossier line or rollup line points at specific dates, open just those daily files for full detail. If tiers 1 and 2 both miss, grep every year folder directly (`grep -ril "<term>" personal/journal/*/`, which covers all years present, never a hardcoded list) and read only the strongest hits, newest first, not every match. Dailies from 2026-07-17 onward also carry frontmatter you can match on.

**4. Deep archive last, and only on request.** If the journal trail points at a date but the user needs verbatim wording (an exact email, a meeting quote), offer to pull the source from the connected source systems (email, calendar, meeting transcripts, chat). Say what you would search before doing it.

## Answer Format

Lead with the direct answer: what happened, who, and when. Then a short provenance list, one line per source used, with dates and file paths. If the trail is incomplete (a gap month with no rollup, an entity with no dossier), say exactly what was checked and came up empty; never fill gaps by inference.

If the search surfaced something the dossier should have had (a recurring person with no dossier, a commitment missing from an existing dossier), note it at the end as a one-line suggestion. Do not edit dossiers from this skill unless the user asks; recall is read-only by default.

## Cost Discipline

- Never load more than a handful of dailies in one pass; if the question genuinely spans many months, answer from rollups and offer to drill into specific days.
- For bulk extraction jobs disguised as recall ("summarize everything about X this year"), route the reading to the summarizer tier per the Model Routing table and synthesize from its output.
