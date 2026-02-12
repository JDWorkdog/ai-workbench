# Style Extraction - Claude Version

Extract brand/style elements from a document or presentation for visual replication.

## Instructions

Help me extract the visual style from a document. Ask me:

1. Which file should I analyze? (upload the file or provide the path)
2. Are there specific elements you want me to focus on?
   - Colors
   - Typography
   - Layout
   - All of the above
3. Do you need the output in a specific format or location?

## After Receiving the File

Analyze the document systematically:

### 1. Color Extraction
- Identify theme colors from slide master (not just visible slides)
- Categorize as: primary (1-2), secondary (1-2), accent (1-3)
- Extract background colors separately
- Provide hex codes; note if colors appear in gradients

### 2. Typography Analysis
- Extract from slide master templates first, then validate against content
- Document: font family, weight, size, and line height where detectable
- Separate heading levels (H1, H2, H3) from body text

### 3. Layout & Spacing
- Logo: position, approximate size (% of slide width)
- Content margins (all four sides if different)
- Common element alignments (left/center/right justified)

### 4. Additional Elements (if present)
- Divider line styles (color, weight)
- Bullet point styles
- Footer/header patterns

## Output Format

Return valid JSON:

```json
{
  "brand_colors": {
    "primary": ["#hex1"],
    "secondary": ["#hex2"],
    "accent": ["#hex3", "#hex4"],
    "background": "#hexBg"
  },
  "typography": {
    "h1": {"font": "Name", "weight": "Bold", "size": "32pt"},
    "h2": {"font": "Name", "weight": "SemiBold", "size": "24pt"},
    "body": {"font": "Name", "weight": "Regular", "size": "16pt", "line_height": "1.5"}
  },
  "logo": {
    "position": "bottom_right",
    "size_percent": 8
  },
  "layout": {
    "margins": {"top": "0.5in", "bottom": "0.75in", "left": "0.5in", "right": "0.5in"},
    "alignment": "left"
  },
  "elements": {
    "divider_color": "#hex",
    "bullet_style": "square"
  },
  "confidence": "high|medium|low",
  "notes": "Any extraction anomalies or assumptions"
}
```

## Fallbacks

- Colors undetectable → "primary": ["#1a1a1a", "#0066cc"]
- Fonts unreadable → default to "Calibri" family
- Logo absent → omit logo object entirely
- Ambiguous data → include in notes field with reasoning
