# Style Extraction

Extract brand/style elements from presentations and documents for visual replication.

## What It Does

This prompt analyzes visual assets (PowerPoint decks, PDFs, documents) and extracts:
- Brand colors (primary, secondary, accent, background)
- Typography (fonts, weights, sizes for headings and body)
- Layout patterns (margins, alignments, spacing)
- Additional elements (dividers, bullets, headers/footers)

## When to Use

- Creating materials that match a client's brand
- Building templates based on existing decks
- Documenting brand guidelines from assets
- Ensuring visual consistency across materials
- Reverse-engineering design systems

## Key Features

- Extracts from slide master (not just visible slides)
- Outputs structured JSON for easy use
- Includes confidence levels for extracted data
- Provides fallback defaults for undetectable elements
- Notes any anomalies or assumptions

## Output Format

Returns structured JSON:
```json
{
  "brand_colors": {
    "primary": ["#hex1"],
    "secondary": ["#hex2"],
    "accent": ["#hex3"],
    "background": "#hexBg"
  },
  "typography": {
    "h1": {"font": "Name", "weight": "Bold", "size": "32pt"},
    "body": {"font": "Name", "weight": "Regular", "size": "16pt"}
  },
  "layout": {
    "margins": {"top": "0.5in", "bottom": "0.75in"},
    "alignment": "left"
  },
  "confidence": "high|medium|low",
  "notes": "Any extraction anomalies"
}
```

## Versions

| LLM | File | Notes |
|-----|------|-------|
| Claude | [claude.md](claude.md) | Full extraction with JSON output |
| ChatGPT | [chatgpt.md](chatgpt.md) | Structured extraction process |
| Gemini | [gemini.md](gemini.md) | Systematic analysis approach |

## Related Resources

- [Claude Code Command](../../claude-code/commands/extract-style.md) - Use as `/extract-style` in Claude Code
- [Claude Action](../../claude-actions/style-extraction.md) - Use in Claude Projects

## Notes

- Works best with PowerPoint (.pptx) files
- Can also analyze PDFs and images with varying accuracy
- Results depend on how consistently the source material follows its own guidelines
