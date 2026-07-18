# Journaling Guide

A journal that writes itself and stays answerable for years. This guide covers the tiered journal system that ships with the workbench and the scheduled pipeline (Claude Code Desktop Co-Work tasks) that keeps it current without you typing a word.

The format rules live in one place: `personal/journal/SCHEMA.md`. Every writer and reader follows that file. This guide explains the system and gets the automation running; when the two disagree on format, the schema wins.

## Why tiers

A daily journal grows past 250 files within a year. The problem is not storage (a year of dailies is around a megabyte); it is retrieval. Answering "what did we promise Acme Corp last year" must not require loading a whole directory into an AI session. The fix is tiered aggregation, and the correction that makes it safe: never purge the detail. Dailies are the fact table; the tiers above them are regenerable indexes.

1. **Dailies** (`personal/journal/<YYYY>/YYYY-MM-DD-DAY.md`): one file per day, kept forever, filed in year folders. YAML frontmatter (`people`, `accounts`, `topics`, `sources`) makes them searchable without being read.
2. **Monthly rollups** (`personal/journal/rollups/YYYY-MM.md`): decisions, people met, promises in both directions, action items opened and closed, notable events. Regenerable from the dailies at any time.
3. **Entity dossiers** (`personal/people/<slug>.md`, `personal/accounts/<slug>.md`): an append-only running record per person or account. This tier answers "when did we last talk to Tyler and what did we owe him" in one small file.
4. **Deep archive**: your source systems themselves (email, calendar, meeting transcripts, chat). The journal points at dates; when you need verbatim wording, drop to the source.

## Who writes, who reads

| Piece | Role |
|---|---|
| Scheduled evening task | Writes today's daily from calendar, meetings, email, and chat; updates dossiers |
| Scheduled morning task | Safety net: folds late activity into yesterday, starts today with the schedule |
| `/daily` and auto-journaling | Interactive capture during the day, appending to the same files |
| `/meeting-journal` | Logs a transcript's decisions and action items to the daily |
| `/journal-rollup` | Generates or regenerates a month's rollup on demand |
| `/recall` | Read-only: answers history questions from dossiers, then rollups, then targeted dailies |

Everything appends; nothing overwrites. Any new writer must read `SCHEMA.md` first.

## Setting up the scheduled pipeline

Use Claude Code Desktop scheduled tasks (Co-Work). The journal lives in local files, so the tasks must run somewhere with filesystem access to this workspace; desktop scheduled tasks have that, cloud-only routines do not. Requirements:

- Claude Code Desktop installed and signed in, with this workspace added as a project folder.
- Connectors for your sources: calendar, email, chat, and a meeting transcription tool if you use one (Granola, Fireflies, or similar). The prompts degrade gracefully if a source is missing; the entry just says which sources fed it.
- **Model**: the Sonnet tier is the right fit for both tasks. This is multi-source synthesis with schema discipline plus dossier upkeep, a step above mechanical summarization (cheaper tiers drift on frontmatter and dossier rules) and nowhere near frontier work (a bad night is recoverable by regenerating from sources).

Create two scheduled tasks, each with the full prompt pasted into its prompt box. The prompts are self-contained on purpose: format rules stay in `SCHEMA.md`, so format changes never require editing the tasks.

### Task 1: Evening journal

Suggested name: `Evening Journal`. Frequency: daily or weekdays, early evening. Folder: this workspace.

```
You are the user's daily journal assistant working in this workspace.

Before writing anything, read personal/journal/SCHEMA.md and follow it
exactly. It defines the daily entry format (YAML frontmatter plus the
sections Schedule, Meetings, Conversations, Accomplishments, Action Items,
Notes), the year-folder layout, the monthly rollup format, and the entity
dossier format.

Core rules:
- Dailies go to personal/journal/<YYYY>/YYYY-MM-DD-DAY.md (year folder
  matching the date). Get the date from the system, never guess.
- Append to existing files, never overwrite. Extend the frontmatter lists
  (people, accounts, topics, sources) whenever you append.
- Skip junk: newsletters, automated notifications, CI noise, marketing email.
- Follow the writing style rules in AGENTS.md.

Write the evening journal entry:
1. Determine today's date and the target file.
2. Gather today's signals from the connected sources: calendar (Schedule),
   meeting transcripts (Meetings), email and chat activity (Conversations).
3. Write or append the entry with full frontmatter and the canonical
   sections. Note in the header line which sources fed the entry.
4. Update dossiers in personal/people/ and personal/accounts/ per the
   schema: a dated Log line per meaningful interaction, commitments in both
   directions, Open Threads kept current. Create a dossier the second time
   an entity appears.
5. If this is the first run of a new month, also generate last month's
   rollup at personal/journal/rollups/YYYY-MM.md per the schema (or flag it
   in today's Notes for a /journal-rollup run if the month is too large to
   do well in one pass).
```

### Task 2: Morning catch-up

Suggested name: `Morning Journal Catchup`. Frequency: daily or weekdays, morning. Folder: this workspace.

```
You are the user's daily journal assistant working in this workspace.

Before writing anything, read personal/journal/SCHEMA.md and follow it
exactly. It defines the daily entry format (YAML frontmatter plus the
sections Schedule, Meetings, Conversations, Accomplishments, Action Items,
Notes), the year-folder layout, and the entity dossier format.

Core rules:
- Dailies go to personal/journal/<YYYY>/YYYY-MM-DD-DAY.md (year folder
  matching the date). Get the date from the system, never guess.
- Append to existing files, never overwrite. Extend the frontmatter lists
  (people, accounts, topics, sources) whenever you append.
- Skip junk: newsletters, automated notifications, CI noise, marketing email.
- Follow the writing style rules in AGENTS.md.

Write the morning catch-up:
1. Determine today's date and find the most recent daily file before today
   in personal/journal/<YYYY>/.
2. Append to that file anything that happened after its evening run (late
   email, chat, deploys), extending its frontmatter lists. Label the
   additions as evening activity.
3. Create today's file with frontmatter, today's Schedule from the
   calendar, and any overnight items worth carrying forward.
4. Apply any dossier updates arising from the late activity.
```

### Alternatives to desktop tasks

If you keep the journal in a private git repository instead of local-only files, cloud scheduled agents (Claude Code cloud routines, or an equivalent scheduled run in another tool) can run the same two prompts against the repo. The prompts are runtime-neutral: any agent that can read the workspace files and your connected sources can execute them. Adjust the folder reference and keep everything else identical.

## Monthly rollups and backfill

The evening task generates last month's rollup on the first run of a new month. For history, or to fix a bad month, run `/journal-rollup YYYY-MM` any time: rollups are regenerable from dailies, so regenerating is always safe. If you are adopting this system over an existing journal, backfill rollups for the historical months but do not retro-tag old dailies with frontmatter; the rollups become the searchable index for those months.

## Asking questions of the journal

Use `/recall` for history questions ("when did we meet Dana", "what did we promise Acme Corp", "what happened with the checkout bug last fall"). It searches dossiers first, then rollups, then targeted dailies, and only offers to touch the deep archive (the source systems) when you need verbatim detail. Avoid loading journal folders into context directly; that is the failure mode the tiers exist to prevent.

## Adopting the schema in an existing workspace

1. Move existing dailies into year folders matching their dates.
2. Add `personal/journal/SCHEMA.md` (ships with this kit) and read it once.
3. Backfill monthly rollups (`/journal-rollup`, one month at a time, or delegate the batch to a cheap model tier).
4. Create dossiers lazily: when an entity comes up the second time, not as a migration step.
5. Set up the two scheduled tasks above. Old entries without frontmatter stay as they are; readers must not assume frontmatter exists on files that predate adoption.
