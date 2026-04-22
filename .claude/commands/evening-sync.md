Wrap today's work by pulling activity from Gmail, Google Calendar, Granola, and Slack and appending a day wrap to today's journal.

**Input:** `$ARGUMENTS` (optional: a date string like `2026-04-21` to sync for a past day. Defaults to today.)

Designed to run unattended on a schedule (see `resources/getting-started/setup-scheduled-journaling.md`) but safe to invoke manually anytime.

---

## Step 1: Resolve Dates and Journal Path

1. Determine today's date from the environment. Never guess. Override with `$ARGUMENTS` if provided.
2. Compute today's journal filename using the `YYYY-MM-DD-DAY.md` convention.
3. Pick the journal folder based on project context (see `.claude/rules/project-scoping.md`):
   - Project active → `personal/projects/<name>/journal/`
   - No project → `personal/journal/`
4. The time window is today's calendar day in the user's local timezone (00:00 → the current moment).

## Step 2: Pull From Connectors (Parallel)

Same graceful-fallback rules as `/morning-sync`: skip any source that isn't configured, record as `Skipped — connector not configured`, and never block the run on one source failing.

### 2a. Google Calendar — Today's Actuals
Query today's events and for each return:
- Start time
- Title
- Attendee count (not names)
- Status — `attended` / `declined` / `no-show` / `cancelled` / `tentative` if derivable from the user's response or meeting notes
- Whether Granola has a transcript for it (cross-reference Step 2c)

Sort chronologically. Cancelled/declined events go at the bottom.

### 2b. Gmail — Outgoing Today
Query threads where the user sent at least one message today. For each return:
- Recipient domain (not individual address)
- Subject
- Whether the thread was initiated by the user today or was a reply

This is the "what did I respond to / reach out about today" signal. Cap at top 15.

### 2c. Granola — Today's Meetings
Query Granola for meetings that occurred today. For each return:
- Start time
- Title
- One- or two-sentence summary
- Whether notes contain action items (Granola typically flags these)
- If the meeting had action items assigned to the user, list them (they'll be promoted to Pending Tomorrow in Step 4)

### 2d. Slack — Today's Activity
Query Slack for:
- Messages the user sent today (in DMs, group DMs, or channels)
- Threads the user participated in today (replied to)
- Channel activity the user reacted to with an emoji

For each return:
- Channel type (DM, group DM, channel) — no channel names unless the user uses them publicly
- Count of messages sent per thread/channel
- One-line snippet of the longest message sent

Cap at top 10 by message volume.

## Step 3: Extract Action Items

From Steps 2a–2d, extract anything that looks like a commitment made by the user or a follow-up to do:
- Granola-flagged action items assigned to the user
- Email threads where the user said "I'll…" / "I'll get back to you with…"
- Calendar events that imply a follow-up (e.g., the user attended a kickoff that usually generates a task list)
- Slack threads where the user said they'd do something

These become the Pending Tomorrow section. De-duplicate against any items already in today's `Added to Task List`.

## Step 4: Write the Journal

Open today's journal file at the path from Step 1.

**If it exists**, append a `## Day Wrap` section after the last existing top-level section. Do not touch earlier sections — the user or `/daily` may have written content there already.

**If it doesn't exist** (unusual — morning-sync or /daily usually creates it), create it with the standard header, then add the Day Wrap section.

### Day Wrap format

```markdown
## Day Wrap — [HH:MM local]

### Today's Meetings
- [time] [title] ([status]) — [one-sentence summary]
  Action items: [N] (see Pending Tomorrow)
- ...or "(No meetings on calendar)"

### Outgoing Email
- [domain] — [subject] ([initiated | reply])
- ...or "(No outgoing threads)"

### Slack Activity
- [type]: [N] messages — longest: "[snippet]"
- ...or "(No Slack activity)"

### Skipped Sources
- [source] — [reason]
- ...or omit if nothing was skipped
```

### Update Pending Tomorrow

After Day Wrap, either create a new `## Pending Tomorrow` section or append to the existing one (some users' morning sync pulls yesterday's Pending Today forward to today's Pending Today; that's fine — Pending Tomorrow is separate and forward-looking).

```markdown
## Pending Tomorrow
- [item 1] — [source: meeting / email / slack / manual]
- [item 2] — ...
```

De-duplicate against:
- Items already in today's `Accomplished` (marked done shouldn't roll forward)
- Items already in today's `Pending Today` (they'll auto-roll via `/morning-sync` tomorrow)

## Step 5: Display the Wrap Summary

Print a compact wrap summary:

```
Day Wrap — [date]

Meetings: [N] attended, [N] with action items
Email out: [N] threads
Slack: [N] active conversations
Pending tomorrow: [N] items

Journal appended: personal/journal/YYYY-MM-DD-DAY.md
```

Then a brief optional reflection prompt the user can act on if they're still at the keyboard:

```
Reflection (optional):
- What went well today?
- What's stuck?
- One thing to tackle first tomorrow?
```

No action required on the reflection — it's just a prompt. The user can answer in a follow-up message (which the `auto-journal-detect` hook will capture) or ignore it.

## Notes

- Respect `.claude/rules/autonomy.md` — create/update journal files without asking.
- Never include credentials or auth content in journal writes.
- Prefer domains/handles over full email addresses and full names.
- Designed to be idempotent: running twice in one evening should refresh the Day Wrap block rather than appending a second copy. Detect an existing `## Day Wrap — [HH:MM]` header and replace the block between it and the next top-level heading.
- If the user ran `/morning-sync` today, the journal already has `## Morning Catchup`. Day Wrap goes after everything else — don't reorder.
