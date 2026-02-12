# Style Extraction - Gemini Version

Extract brand/style elements from a document or presentation for visual replication.

## Context

Style extraction is the process of analyzing existing visual materials to document the design rules they follow. This enables creating new materials that match the original style.

## Your Task

When a user provides a document (PowerPoint, PDF, image), systematically extract its visual style elements.

## Phase 1: Clarification

Ask these questions:

1. **Source Material**: Which file should I analyze?
   - Upload the file, or
   - Provide a path/link

2. **Focus Areas**: What elements should I prioritize?
   - A) Colors only
   - B) Typography only
   - C) Layout only
   - D) Comprehensive (all elements)

3. **Output Preference**: How should I format the results?
   - A) JSON (structured data)
   - B) Written summary
   - C) Both

## Phase 2: Systematic Analysis

### Section 1: Color Extraction

**What to look for:**
- Primary colors: The main brand colors (typically 1-2)
- Secondary colors: Supporting colors (typically 1-2)
- Accent colors: Highlight/call-to-action colors (1-3)
- Background colors: Page/slide backgrounds

**How to extract:**
- Check slide masters/templates first (more reliable than individual slides)
- Identify recurring color patterns
- Note any gradients or color combinations

**Output format:**
- Hex codes (#RRGGBB format)
- Categorization (primary/secondary/accent/background)

### Section 2: Typography Analysis

**What to look for:**
- Heading styles (H1, H2, H3)
- Body text style
- Caption/footnote styles

**For each style, extract:**
- Font family name
- Font weight (Light, Regular, Medium, SemiBold, Bold)
- Font size (in points)
- Line height (if detectable)

**Priority:**
1. Check master templates first
2. Validate against actual content
3. Note inconsistencies

### Section 3: Layout Patterns

**What to look for:**
- Margins (top, bottom, left, right)
- Content alignment (left, center, right, justified)
- Logo position and size
- Spacing between elements

**Measurements:**
- Use inches or percentage of page width
- Note if different margins are used on different sides

### Section 4: Additional Elements

**What to look for:**
- Divider lines (color, thickness, style)
- Bullet point styles (circle, square, dash, custom)
- Header/footer patterns
- Icon styles or treatments

## Phase 3: Output Delivery

### JSON Output

```json
{
  "brand_colors": {
    "primary": ["#hex1"],
    "secondary": ["#hex2"],
    "accent": ["#hex3", "#hex4"],
    "background": "#hexBg"
  },
  "typography": {
    "h1": {"font": "Font Name", "weight": "Bold", "size": "32pt"},
    "h2": {"font": "Font Name", "weight": "SemiBold", "size": "24pt"},
    "h3": {"font": "Font Name", "weight": "Medium", "size": "18pt"},
    "body": {"font": "Font Name", "weight": "Regular", "size": "16pt", "line_height": "1.5"}
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
    "divider_weight": "1px",
    "bullet_style": "square"
  },
  "confidence": "high|medium|low",
  "notes": "Any extraction anomalies or assumptions"
}
```

### Confidence Levels

- **High**: Clear, consistent patterns detected
- **Medium**: Some ambiguity, but reasonable confidence
- **Low**: Significant uncertainty, using best guesses

### Fallback Defaults

When elements cannot be detected:
- Colors: "#1a1a1a" (dark text), "#0066cc" (accent blue)
- Fonts: "Calibri" family
- Margins: 0.5 inch standard
- Include reasoning in notes field
