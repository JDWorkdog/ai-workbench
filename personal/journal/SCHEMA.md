# Journal v2: Canonical Schema

This file is the single source of truth for the journaling system. Every writer (the scheduled pipeline, `/daily`, `/meeting-journal`, `/journal-rollup`) and every reader (`/recall`, planning agents) follows this spec. If a format question comes up, this file wins. The system overview and the scheduled-pipeline setup live in `guides/journaling-guide.md`.

## The Four Tiers

1. **Dailies** (`personal/journal/<YYYY>/YYYY-MM-DD-DAY.md`): the fact table. One file per day, kept forever, never purged.
2. **Monthly rollups** (`personal/journal/rollups/YYYY-MM.md`): decisions, people met, promises, action items opened and closed, notable events. Generated at month end, backfilled for history.
3. **Entity dossiers** (`personal/people/<slug>.md`, `personal/accounts/<slug>.md`): append-only running record per person or account. Updated incrementally at journal write time.
4. **Deep archive**: the source systems themselves (email, calendar, meeting transcripts, chat). Recall drops to the source system when a dossier or daily points at a date.

Retrieval cost, not storage, is the design constraint. Answering "what did we promise this customer last year" should touch one dossier, maybe one rollup, and at most a couple of dailies. Never load the whole journal directory into context.

## Directory Layout

```
personal/
├── journal/
│   ├── SCHEMA.md                  # this file
│   ├── 2025/
│   │   └── 2025-11-03-MON.md
│   ├── 2026/
│   │   └── 2026-01-15-THU.md
│   └── rollups/
│       └── 2026-01.md
├── people/
│   └── tyler-reed.md
└── accounts/
    └── acme-corp.md
```

## Daily Entry Schema

File name: `YYYY-MM-DD-DAY.md` with day abbreviations MON, TUE, WED, THU, FRI, SAT, SUN. Files live in the year folder matching the date.

```markdown
---
date: 2026-01-15
day: THU
people: [Tyler Reed, Dana Whitmore]
accounts: [Acme Corp]
topics: [user-auth, q1-campaign, checkout-bug]
sources: [calendar, meetings, email, chat]
---

# 2026-01-15 (Thursday)

## Schedule

## Meetings

## Conversations

## Accomplishments

## Action Items

## Notes
```

Rules:

- **Frontmatter is required on new entries.** `people` uses full names as they appear in dossiers. `accounts` covers companies and named products or initiatives. `topics` are short kebab-case tags. `sources` lists which systems fed the entry.
- **Sections are the canonical six above, in that order.** Omit a section entirely if there is nothing for it. Use `###` subheads inside Meetings and Conversations (one per meeting or channel).
- **Append, never overwrite.** Multiple runs and interactive additions extend the same file. When appending, also extend the frontmatter lists with any new people, accounts, or topics.
- **Skip junk**: newsletters, automated notifications, CI noise, marketing email.
- **Legacy files**: entries written before this schema was adopted may lack frontmatter and use older section names. Leave them as they are (backfill rollups instead of retro-tagging dailies), and never assume frontmatter exists on historical files.

## Monthly Rollup Schema

File name: `personal/journal/rollups/YYYY-MM.md`.

```markdown
---
month: 2026-01
type: rollup
people: [Tyler Reed, Dana Whitmore]
accounts: [Acme Corp]
topics: [q1-campaign, checkout-bug]
---

# Rollup: January 2026

## Decisions
- 2026-01-15: Decision text ([daily](../2026/2026-01-15-THU.md))

## People Met
- Tyler Reed: 2026-01-06, 2026-01-15, 2026-01-27

## Promises Made
- 2026-01-15: Us to send X to Y ([daily](../2026/2026-01-15-THU.md))

## Promises Received
- 2026-01-16: Y to deliver Z ([daily](../2026/2026-01-16-FRI.md))

## Action Items Opened
## Action Items Closed

## Notable Events
```

Rules:

- Every line carries a date and, where it comes from one daily, a relative link to that daily.
- Frontmatter lists every person and account mentioned in the month. This makes rollups the searchable index for months whose dailies lack frontmatter.
- Rollups are regenerable from dailies. Fixing a bad rollup means regenerating it, not hand-patching history.

## Dossier Schema

File name: kebab-case slug of the full name, for example `personal/people/tyler-reed.md` or `personal/accounts/acme-corp.md`.

```markdown
---
name: Tyler Reed
type: person            # person | account
role: Engineer, Acme Corp   # people only; accounts use `relationship:` instead
aliases: [Ty]
first_seen: 2025-11-03
---

# Tyler Reed

## Open Threads
- Dashboard screenshots owed for the Q1 campaign deck

## Commitments
- 2026-01-15: Tyler to supply dashboard screenshots by Friday ([daily](../journal/2026/2026-01-15-THU.md))

## Log
- 2026-01-15: Q1 campaign review; Tyler took the screenshots action ([daily](../journal/2026/2026-01-15-THU.md))
```

Rules:

- Frontmatter: `name`, `type`, and `first_seen` are required. `role` (or `relationship` for accounts) and `aliases` are optional: include them when known, add them later when learned.
- **Log is append-only**, newest line last. One line per interaction or mention worth remembering, each with a date and a link back to the daily.
- **Commitments** records promises in both directions, marked done inline when resolved (never deleted).
- **Open Threads** is the only section that gets edited in place: add when a thread opens, remove when it closes (the closure goes to Log).
- Create a dossier the second time an entity shows up, not the first. One-off contacts stay in the dailies.

## Who Writes What

| Writer | Dailies | Dossiers | Rollups |
|--------|---------|----------|---------|
| Scheduled pipeline (evening + morning tasks) | creates and appends | appends increments | generates on the first run of a new month |
| `/daily` and auto-journaling | appends | appends when a tracked entity appears | no |
| `/meeting-journal` | appends | appends when a tracked entity appears | no |
| `/journal-rollup` | reads only | no | generates or regenerates a named month |
| `/recall` and planning agents | read only | read only | read only |

The scheduled-task prompts live in `guides/journaling-guide.md`. If a new writer appears, it must read this file first and be added to the table above.
