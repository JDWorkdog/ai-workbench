Pull overnight activity from Gmail, Google Calendar, Granola, and Slack and update today's journal with a morning catchup.

**Input:** `$ARGUMENTS` (optional: a date string like `2026-04-21` to sync for a past day. Defaults to today.)

Designed to run unattended on a schedule (see `resources/getting-started/setup-scheduled-journaling.md`) but safe to invoke manually anytime.

---

## Step 1: Resolve Dates and Journal Path

1. **Determine today's date** from the environment. Never guess.
2. If `$ARGUMENTS` is a date, use that instead of today.
3. Compute two filenames using the `YYYY-MM-DD-DAY.md` convention from `.claude/rules/file-naming.md`:
   - Today: `<YYYY-MM-DD>-<DAY>.md`
   - Yesterday: same pattern for the prior calendar day
4. Pick the journal folder based on project context (see `.claude/rules/project-scoping.md`):
   - Project active → `personal/projects/<name>/journal/`
   - No project → `personal/journal/`
5. Compute the time window for "overnight activity" — roughly the last 16 hours, or since yesterday's last journal timestamp if one exists.

## Step 2: Read Yesterday's Journal (If It Exists)

If yesterday's journal file exists in the target folder:
- Extract any items under `## Pending Today` — these are the items that did not get resolved.
- Also scan `## Added to Task List` for items without a completion marker.

Hold onto these — they become today's "Pending Today" carry-forward (Step 5).

If yesterday's file doesn't exist, skip this step silently. No error.

## Step 3: Pull From Connectors (Parallel)

Run these four connector queries in parallel when possible. For each one, if the connector is not configured or the query errors, skip it and record the source as `Skipped — connector not configured` (or `Skipped — error: <brief reason>`). **Never block the run on a single-source failure.**

### 3a. Google Calendar — Today's Schedule
Query today's primary calendar in the user's local timezone. For each event return:
- Start time (local, e.g., `9:30am`)
- End time
- Title
- Attendee count (not names)
- Whether it's a meeting-with-agenda (has a description/attachments) or a block
- Conference link type if any (Meet / Zoom / other) — not the URL itself

Sort chronologically.

### 3b. Gmail — Overnight Inbox
Query threads received in the window defined in Step 1, still unread at query time, excluding promotional and social categories. For each thread return:
- Sender domain (not individual address)
- Subject line
- Whether it's a reply vs a new thread
- Thread age (e.g., `received 3h ago`)

Cap at the top 10 by recency. If more than 10 exist, note `… and N more`.

### 3c. Granola — Meetings from the Last 24h
Query Granola for meetings that took place in the overnight window. For each return:
- Meeting title
- Start time
- Whether transcript/notes are available
- Two- or three-sentence summary (Granola typically provides this)

If Granola is on the free tier and a meeting is older than 30 days, note `(free-tier: transcript unavailable)`.

### 3d. Slack — DMs and Mentions Since Last Check
Query Slack for:
- Unread DMs addressed to the user
- `@` mentions of the user in any channel they're a member of
- Activity in channels the user has starred/saved

For each item return:
- Channel type (DM, group DM, channel) — not the channel name unless the user already uses it publicly
- Sender (initials or handle only)
- One-line snippet of the message
- Timestamp

Cap at the top 10 by recency.

## Step 4: Run News Digest Sub-Commands

Invoke these two commands as sub-steps and capture their output. They already save to today's journal on their own; that's fine — the section headers won't conflict.

1. Run the instructions from `.claude/commands/ai-news-digest.md` — treat its Step 5 ("Save to Journal") as satisfied by this outer sync's journal write rather than duplicating.
2. Run the instructions from `.claude/commands/claude-code-news.md` — same treatment.

If either sub-command errors or has no results, note that in the morning briefing but continue.

## Step 5: Write the Journal

Open or create today's journal file at the path from Step 1. If the file doesn't exist, seed it with the standard header:

```markdown
# [Weekday], [Month Day, Year]

## Accomplished

## Added to Task List

## Notes & Thoughts

## Pending Today
```

Then insert a `## Morning Catchup` section immediately after the title, above `## Accomplished`:

```markdown
## Morning Catchup — [HH:MM local]

### Today's Calendar
- [time] [title] — [attendee-count] attendees [link-type if any]
- ...or "(No events scheduled)"

### Overnight Inbox
- [domain] — [subject] ([age])
- ...or "(No new threads)"

### Recent Meetings (Granola)
- [time] [title] — [one-sentence summary]
- ...or "(No meetings in the last 24 hours)"

### Slack Activity
- [type] from @[handle]: [snippet] ([age])
- ...or "(No new DMs or mentions)"

### Skipped Sources
- [source] — [reason]
- ...or omit this block if nothing was skipped
```

After the Morning Catchup section, refresh the `## Pending Today` section:
- Start with the items carried forward from Step 2 (yesterday's unresolved)
- If the section has existing items from today's run, merge — don't duplicate

Append the AI news digest and Claude Code news output under their own top-level sections (`## AI Feature Releases — [date]`, `## Claude Code Updates`) as those sub-commands already format.

**Do not** overwrite existing content the user has added to today's journal. The morning catchup sections are additive — if a block already exists from a previous run today, replace only that block, not sibling sections.

## Step 6: Display the Briefing

Print the morning briefing to the screen so it's visible immediately when the scheduled task runs:

```
Morning Catchup — [date]

[Calendar summary, one line per event]

[Inbox summary, up to 10 lines]

[Meetings summary]

[Slack summary]

[Pending from yesterday: N items carried forward]

[AI news: N releases] · [Claude Code: N updates]

Journal updated at: personal/journal/YYYY-MM-DD-DAY.md
```

Keep it scannable — the point is a one-screen overview.

## Notes

- Respect `.claude/rules/autonomy.md` — create/update journal files without asking.
- Never include credentials, tokens, or auth-related content in journal writes. If a connector returns an error containing a token, strip it.
- If an MCP connector is configured but returns empty, that's different from "skipped." Record as `(no activity)` not `(skipped)`.
- For privacy: prefer domains/handles over full email addresses and full names when writing to the journal, unless the user's existing journal entries show the opposite preference.
- This command complements `/daily` (manual capture) and the `auto-journal-detect.sh` hook (in-session reactive). Run all three and the journal stays comprehensive.
