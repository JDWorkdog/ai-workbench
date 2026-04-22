# Tags Configuration

Copy this file to one of these locations and replace the example entries with your real ones:

- `personal/resources/tags.md` — applies to every session in this workbench
- `personal/projects/<name>/resources/tags.md` — applies only when that project context is active (takes precedence over the top-level file)

Commands like `/meeting-journal` and `/morning-sync` consult this file to auto-apply hashtags and generate `[[wiki-links]]` to people. If no `tags.md` exists, those commands degrade gracefully — they'll still run, just without custom tags or wiki-links.

The example entries below use obviously fictional names so you can see the shape. Replace with your real ones before using.

---

## Context Tags

Applied automatically when the matching keywords appear in transcripts, emails, or journal text.

- `#meeting` → meeting, sync, standup, 1:1, review
- `#call` → called, phone call, voicemail
- `#email` → email, emailed, replied
- `#research` → research, investigated, explored, looked into
- `#planning` → plan, roadmap, strategy, kickoff

## Priority Tags

- `#urgent` → urgent, asap, critical, blocker
- `#quick-win` → quick, easy, fast, five-minute
- `#someday` → someday, when I have time, eventually

## Type Tags

- `#task` → (default for action items — no trigger needed)
- `#idea` → idea, what if, could we, consider
- `#followup` → follow up, check back, circle back, revisit
- `#blocked` → blocked, stuck, waiting on, pending

## People

When a person in this list is mentioned (by name or by one of their aliases), wrap the reference as `[[Name]]` and apply the associated tag.

| Name | Aliases | Tag | Notes |
|------|---------|-----|-------|
| Ada Lovelace | Ada | `#ada` | Engineering lead |
| Grace Hopper | Grace | `#grace` | Engineering director |
| Alan Turing | Alan | `#alan` | Product manager |
| Margaret Hamilton | Margaret | `#margaret` | Customer success |

## Customers

| Name | Aliases | Tag |
|------|---------|-----|
| BetaCorp | beta, BC | `#betacorp` |
| GammaTech | gamma, GT | `#gammatech` |

## Projects

| Name | Aliases | Tag |
|------|---------|-----|
| Q1 Launch | launch, Q1 | `#q1-launch` |
| Platform Redesign | redesign | `#redesign` |

## Custom Tags

Add your own categories as your workflow evolves. A few ideas:

- `#invoice` → invoice, billing, payment
- `#legal` → legal, contract, NDA, redline
- `#interview` → interview, candidate, hiring

## Tag Behavior

- **Silent application** — tags are applied automatically without asking. Don't insert a "tagging this as..." line.
- **Multiple tags per entry are fine** — a meeting discussion about an urgent invoice could carry `#meeting #urgent #invoice`.
- **Unknown people** — if someone is mentioned but not in the People list, leave them as plain text. Don't invent a tag.
- **Case-insensitive matching** — keyword triggers match regardless of case.
