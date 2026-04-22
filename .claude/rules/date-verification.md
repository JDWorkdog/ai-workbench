---
description: Mandatory date/day-of-week verification before creating any dated file
---

# Date Verification

Claude consistently makes three kinds of date mistakes when creating journal entries or other dated files:

- Using the wrong date (off-by-one — tomorrow instead of today, or yesterday instead of today)
- Using the wrong year (drifting by one year when the filename format doesn't force the check)
- Mismatching the day-of-week abbreviation with the date (calling a Tuesday "MON" or "WED")

This rule prevents all three. Follow it whenever a command is about to create or name a file with a date in it.

## Before Writing a Dated File — Checklist

1. **Read today's date from the environment.**
   - Look for `Today's date: YYYY-MM-DD` (or equivalent) in the system context / environment info block of the conversation.
   - That value is the **only** source of truth for the current date. Never guess, never derive from memory, never infer from surrounding text.

2. **Compute the day-of-week from the verified date.**
   - Use an actual calendar calculation (Zeller's congruence, the `date` command via Bash, or any deterministic method).
   - Don't pattern-match against "last time I wrote this day it was…" — that's how drift happens.
   - Day abbreviations are three uppercase letters: `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT`, `SUN`.

3. **Sanity-check against existing journal files if available.**
   - If yesterday's journal exists in `personal/journal/`, its filename confirms yesterday's date. Today's date should be exactly one day later.
   - This catches year-boundary slips and environment-info bugs.

4. **Respect the user's timezone.**
   - Unless the environment says otherwise, assume the user's local timezone. Don't produce a UTC date when the user is expecting local.
   - If you're uncertain which timezone applies, check `personal/timezone.md` (optional user config) or ask once and remember via auto-memory.

## Relative Dates

| Phrase | Meaning |
|---|---|
| "today" | Verified date from environment |
| "yesterday" | Verified date minus one day |
| "tomorrow" | Verified date plus one day |
| "this Thursday" | The most recent Thursday on or before today (if today is later in the week) or the upcoming Thursday (if earlier) — ask if ambiguous |
| "last Thursday" | The Thursday of the previous week, not necessarily the most recent one |
| "next Thursday" | The Thursday of next week |

Convert all relative phrases to absolute `YYYY-MM-DD` before writing them to a file. Relative dates rot.

## Common Failure Modes To Avoid

- Creating `2026-04-22-WED.md` when today is actually Tuesday the 21st.
- Writing `2025-04-21` when the year is 2026 — especially at year boundaries or after long gaps.
- Labeling the 21st "WED" because the last journal you wrote was a Wednesday.
- Generating a "today" file that duplicates an existing one because you computed the date differently.

## File Naming

File format details live in [`file-naming.md`](file-naming.md). This rule covers *getting the date right* before you apply the format.

## Applies To

Every command that creates or names a file with a date in it, including but not limited to `/daily`, `/meeting-journal`, `/morning-sync`, `/evening-sync`, `/ai-news-digest`, `/claude-code-news`, `/handover`.
