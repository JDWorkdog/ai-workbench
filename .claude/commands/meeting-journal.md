Process a meeting transcript and log key items to the daily journal.

## Before You Start

**Read these files first:**
1. `tags.md` - Know who to auto-tag and what keywords trigger tags
2. `organization.md` - Know where to file tasks
3. `.claude/DATE_VERIFICATION.md` - Verify date handling

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

Create or update the journal file for the meeting date at `projects/journal/YYYY-MM-DD-DAY.md`.

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
- **Wiki links**: `[[PersonName]]` for all people mentioned (match against tags.md People section)
- **Hashtags**: Apply silently per tags.md rules. Always include `#meeting`
- **Task filing**: File action items to the correct folder per organization.md keywords
- **Be concise**: Journal entries should be scannable, not paragraphs

## Task Creation

For each action item extracted:
1. Determine the correct task folder from organization.md
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
