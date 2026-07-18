Convert a markdown file to .docx (or .pdf) for sharing with non-technical readers.

You are a document export helper. Convert a `.md` file into a clean shareable Office document using `pandoc`, dropping the result alongside the source file. This replaces the manual "open in Google Docs → download as docx/pdf" workflow.

## Argument parsing

Parse `$ARGUMENTS` (whitespace-separated tokens) in this order:

1. **Format flag**: scan for `-pdf`, `--pdf`, `-PDF`, or `--PDF`. If present → output format is **PDF**. Otherwise → **DOCX** (default).
2. **Input path**: the remaining non-flag token is the markdown file path.
   - Strip a leading `@` if Claude Code's mention syntax left it in (e.g. `@personal/transcripts/Foo.md` → `personal/transcripts/Foo.md`).
   - Resolve to an absolute path.
3. **Validation**:
   - If no input path was provided → respond: `Usage: /share-doc <path-to-markdown-file> [--pdf]` and stop.
   - If the path doesn't exist → respond `File not found: <path>` and stop. Do NOT create an empty output.
   - If the extension isn't `.md` → warn once but proceed.

## Output path

Same directory as the source, same basename, swap extension:

- `personal/transcripts/Dev-Leader-Sync-Summary-2026-04-30.md` → `personal/transcripts/Dev-Leader-Sync-Summary-2026-04-30.docx`
- With `--pdf` → `personal/transcripts/Dev-Leader-Sync-Summary-2026-04-30.pdf`

If the destination already exists, overwrite it. No prompt.

## Conversion

### DOCX (default)

Run via Bash:

```bash
pandoc "<input>.md" -o "<output>.docx" --standalone
```

If pandoc exits non-zero, surface stderr to the user and stop.

### PDF (`--pdf` flag)

Pandoc PDF requires a PDF engine. Probe each candidate by running `<engine> --version >/dev/null 2>&1`, and only treat an engine as available if that exits 0. (Bare `command -v` is not enough: Homebrew can leave broken shims like `/opt/homebrew/bin/soffice` on PATH after the underlying app is deleted, so the binary appears to "exist" but fails on use.)

Try engines in this order, using the first whose version check succeeds:

1. `xelatex`: `pandoc "<input>.md" -o "<output>.pdf" --pdf-engine=xelatex`
2. `pdflatex`: `pandoc "<input>.md" -o "<output>.pdf" --pdf-engine=pdflatex`
3. `weasyprint`: `pandoc "<input>.md" -o "<output>.pdf" --pdf-engine=weasyprint`
4. **LibreOffice fallback** (`soffice`): two-step conversion via DOCX:
   ```bash
   tmpdoc=$(mktemp -t share-doc).docx
   pandoc "<input>.md" -o "$tmpdoc" --standalone
   soffice --headless --convert-to pdf "$tmpdoc" --outdir "<output-dir>"
   # soffice names the output after the tmp basename; rename to the target path
   mv "<output-dir>/$(basename "$tmpdoc" .docx).pdf" "<output>.pdf"
   rm "$tmpdoc"
   ```

If **none** of those engines/tools are installed, stop and report exactly:

```
PDF export requires a PDF engine. Install one with:
  brew install --cask basictex      # then restart shell for xelatex/pdflatex on PATH
  brew install --cask libreoffice   # provides `soffice` for the DOCX→PDF fallback
```

## Reporting

On success, output one short line so the file is easy to click in the IDE:

```
Wrote <absolute-output-path>
```

Don't summarize the document or describe what pandoc did; the user is going to share the file, not read your commentary.

On failure (missing input, conversion error, missing PDF engine), surface the actual error/stderr and stop. Don't retry silently.

## Examples

```
/share-doc @personal/transcripts/Dev-Leader-Sync-Summary-2026-04-30.md
/share-doc personal/transcripts/Dev-Leader-Sync-Summary-2026-04-30.md --pdf
/share-doc --pdf @personal/journal/2026/2026-04-30-THU.md
```

---

**Arguments:**

$ARGUMENTS
