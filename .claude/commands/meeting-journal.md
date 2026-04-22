Process a meeting transcript and log key items to the daily journal.

## Date Handling

Before creating or naming any journal file, follow [`.claude/rules/date-verification.md`](../rules/date-verification.md) to verify today's date and the correct day-of-week abbreviation.

## Configuration Files (Optional)

Before processing, check for these configuration files in order of precedence and read whichever are present:

1. **Project-scoped** (only when a project context is active):
   - `personal/projects/<name>/resources/tags.md`
   - `personal/projects/<name>/resources/organization.md`
2. **Top-level:**
   - `personal/resources/tags.md`
   - `personal/resources/organization.md`

Templates for both live in [`resources/_examples/sample-tags.md`](../../resources/_examples/sample-tags.md) and [`resources/_examples/sample-organization.md`](../../resources/_examples/sample-organization.md). Users copy those to `personal/resources/` and customize.

**Graceful degradation** — if a file isn't found, proceed with sensible defaults:

- **No `tags.md`** → apply only `#meeting` automatically. Skip `[[wiki-link]]` formatting; keep names as plain text.
- **No `organization.md`** → route all action items to `tasks/_inbox/` per the four-folder taxonomy in [`.claude/rules/task-folders.md`](../rules/task-folders.md).

Do not error or prompt the user when these files are missing — just degrade.

## Input

The user will provide a path to a transcript file or a meeting name/keyword. Supported formats:
- `.vtt` (WebVTT) - Plain text with timestamps and speaker labels
- `.docx` (Word) - Teams transcript download
- `.md` (Markdown) - Previously processed transcript or notes

Common locations:
- `projects/transcripts/` - Downloaded transcripts (.docx, .vtt, .md)
- `projects/teams-recordings/` - Symlinked from OneDrive Recordings (.mp4 files)

## File Resolution Logic

**IMPORTANT:** Follow this order when resolving input to a readable transcript:

1. **If given a .vtt or .md file** → Read it directly with the Read tool
2. **If given a .docx file** → Convert with `textutil -convert txt -stdout "path"` via Bash
3. **If given an .mp4 file** → The .mp4 files are NOT readable text. Instead:
   - Extract the meeting name/date from the .mp4 filename
   - Search `projects/transcripts/` for a matching .docx, .vtt, or .md file
   - If found, use that file instead
   - If not found, tell the user: "I found the recording but no downloaded transcript. To process this meeting, download the transcript from the Teams meeting recap (as .vtt or .docx) and save it to projects/transcripts/"
4. **If given a meeting name or keyword** → Search both directories for matching files
5. **If no input is provided** → List available transcript files from both directories (skip .mp4 Recording files, but include .mp4 Transcript files as "needs download" indicators) and ask the user to pick one

## Reading .docx Files

The Read tool cannot open binary .docx files directly. For .docx transcripts, use macOS `textutil` to convert to plain text:

```bash
textutil -convert txt -stdout "path/to/transcript.docx"
```

This outputs clean text with speaker labels and timestamps. For `.vtt` and `.md` files, use the Read tool directly.

## Processing Steps

1. **Read the transcript file** (use textutil for .docx, Read tool for .vtt/.md)
2. **Determine the meeting date**:
   - Check the filename for date patterns (e.g., `20251208`, `2025-12-08`, `2025_12_08`)
   - If no date in filename, ask the user
3. **Determine the meeting name/topic** from the filename or content
4. **Extract the following from the transcript**:

### Accomplishments
Decisions made, agreements reached, things that were completed or demonstrated during the meeting.

### Action Items
Tasks committed to by specific people. Capture:
- What needs to be done (imperative form)
- Who is responsible (if mentioned)
- Due date (if mentioned)
- Which task folder it belongs to (per organization.md)

### Notes & Thoughts
Key discussion points, insights, context that's worth remembering but isn't an action item.

### People Mentioned
Track who was in the meeting and who was referenced — these become wiki links.

## Journal Update

Create or update the journal file for the meeting date. Path depends on project context (see [`.claude/rules/project-scoping.md`](../rules/project-scoping.md)):

- Project active → `personal/projects/<name>/journal/YYYY-MM-DD-DAY.md`
- No project → `personal/journal/YYYY-MM-DD-DAY.md`

Before deciding the date and day-of-week for the filename, follow [`.claude/rules/date-verification.md`](../rules/date-verification.md).

**If the journal file already exists**, append to the existing sections — do NOT overwrite what's already there.

### Format for journal entries:

```markdown
## Accomplished
- [timestamp] Meeting: [meeting name] - [decision/accomplishment] #meeting [[Person]]

## Added to Task List
- [timestamp] [action item description] → [folder] #tags [[Person]]

## Notes & Thoughts
- [timestamp] [Meeting name]: [key insight or discussion point] #meeting #tags [[Person]]
```

### Rules:
- **Timestamp**: Use the meeting start time if available from the filename, otherwise use "EOD" for past dates or current time for today
- **Wiki links**: `[[PersonName]]` for people matched in the `tags.md` People section. If `tags.md` isn't present, leave names as plain text.
- **Hashtags**: Apply silently per `tags.md` rules. Always include `#meeting`. If `tags.md` isn't present, only `#meeting` is applied automatically.
- **Task filing**: File action items per `organization.md` keywords. If `organization.md` isn't present, default all action items to `tasks/_inbox/`.
- **Be concise**: Journal entries should be scannable, not paragraphs

## Task Creation

For each action item extracted:
1. Determine the correct task folder. If `organization.md` is present, match against its keyword lists; otherwise default to `tasks/_inbox/`.
2. Check if a similar task already exists in that folder's `tasks.md`
3. If new, add it to the appropriate `tasks.md` file
4. Log it in the journal under "Added to Task List" with `→ [folder]`

## Output

After processing, respond with a brief summary:
- Which journal file was updated
- How many accomplishments, action items, and notes were logged
- Any tasks that were created and where they were filed
- Any items that need clarification

**Do NOT repeat the full transcript back.** Keep the response brief and scannable.

---

**Transcript to process:**

$ARGUMENTS
