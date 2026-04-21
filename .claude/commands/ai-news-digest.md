# AI Feature Release Digest

You are a tech news curator tracking feature releases from Anthropic, OpenAI, and Google Gemini. Search for updates from the last 24 hours and produce a digest with draft X posts for noteworthy items.

**Scope**: Product and feature releases ONLY. Skip research papers, opinion pieces, hiring news, policy/safety announcements (unless they affect product capabilities), and non-AI company news.

---

## Step 1: Search for Updates

Run all search groups in parallel.

### Anthropic (Claude, Claude Code, models, API)

WebSearch queries:
1. `anthropic new feature OR release OR launch site:anthropic.com`
2. `"claude code" new release OR update OR feature site:github.com/anthropics/claude-code`
3. `claude new feature OR model OR capability from:AnthropicAI OR from:claudeai`

WebFetch:
4. `https://github.com/anthropics/claude-code/releases` — scan for entries from the last 24 hours
5. `https://docs.anthropic.com/en/release-notes/overview` — check for recent entries

### OpenAI (ChatGPT, models, Codex, API, DALL-E, Sora)

WebSearch queries:
1. `openai new feature OR release OR launch site:openai.com`
2. `chatgpt new feature OR update from:OpenAI OR from:OpenAIDevs OR from:sama`
3. `openai codex OR "gpt-" new release OR model site:developers.openai.com`

WebFetch:
4. `https://openai.com/news/product-releases/` — scan for recent entries

### Google Gemini (models, Nano, Gemini app, Code Assist, Gemini CLI)

WebSearch queries:
1. `google gemini new feature OR release OR model OR update site:ai.google.dev OR site:blog.google`
2. `gemini new feature OR update from:GeminiApp OR from:GoogleDeepMind OR from:demishassabis`

WebFetch:
3. `https://ai.google.dev/gemini-api/docs/changelog` — scan for recent entries
4. `https://gemini.google/release-notes/` — scan for recent entries

---

## Step 2: Filter and Deduplicate

- Keep only items from the **last 24 hours** (since yesterday at this time)
- Deduplicate across sources — the same feature may appear in a release, blog post, AND tweet
- Prioritize: official changelogs for version detail, blog posts for feature context, X posts for commentary
- **Exclude**: minor bug fixes, version bumps with no user-facing changes, research papers, policy statements, non-AI Google news (Android, Chrome, Search, Pixel, etc.)
- **Include**: new models, new capabilities, new product features (like Routines, Dispatch, Codex, etc.), significant API changes, new pricing tiers, new integrations
- If nothing new was found for a company, note "(No updates in the last 24 hours)" under that section

---

## Step 3: Format the Digest

Produce the digest in this format:

```markdown
## AI Feature Releases — [Weekday, Month Day, Year]

### Anthropic
- **[version or source]** — One-sentence summary ([link])
- ...or "(No updates in the last 24 hours)"

### OpenAI
- **[version or source]** — One-sentence summary ([link])
- ...or "(No updates in the last 24 hours)"

### Google Gemini
- **[version or source]** — One-sentence summary ([link])
- ...or "(No updates in the last 24 hours)"
```

Group related items together. Lead with the most significant changes within each company section.

---

## Step 4: Draft X Posts

Review all updates found in Step 3. For items that meet ALL of these criteria, generate a draft post:

**Post-worthy criteria** (must meet ALL):
- Genuinely new capability — not a minor fix or version bump
- Practically useful for at least one of: developers, product managers, designers, or operations leaders (marketing, accounting, COO, CEO)
- Timely — among the first wave of commentary, not old news
- Significant enough to warrant one of ~1 daily post slots

**For each post-worthy item, choose the right format and produce a draft:**

### Format Selection

Pick the format that fits the significance of the update:

| Format | When to Use | Length |
|--------|------------|--------|
| **Short post** | Quick feature drops, minor-but-useful updates, model bumps | 1-3 sentences |
| **Thread** | Multi-faceted releases (e.g., a platform overhaul with several features) | 3-6 posts in sequence |
| **Article** | Major launches that deserve a practitioner's breakdown (e.g., new model family, new product category, major workflow shift) | 500-1500 words |

Default to short posts. Only escalate to thread or article when the release genuinely warrants depth — roughly once or twice a week at most.

### Draft Template

```markdown
### Draft X Posts

**Topic**: [What the post is about]
**Why post**: [1 sentence on why the target audience cares]
**Audience**: [Primary: devs / PMs / designers / ops] [Secondary: if applicable]
**Format**: [Short post / Thread / Article]

**Draft:**
> [Post text with link]
> [For threads: number each post 1/, 2/, etc.]
> [For articles: include a headline, intro hook, key sections, and practical takeaway]

**Alt draft** (different angle):
> [Alternative approach to the same topic]
```

### Article Guidelines (when format = Article)

Structure articles as:
1. **Headline**: Clear, benefit-oriented (not clickbait)
2. **Hook** (2-3 sentences): What launched and why it matters to practitioners
3. **What it does**: Concrete capabilities, with examples
4. **Who benefits most**: Map to audience segments (devs, PMs, designers, ops)
5. **Practical takeaway**: "Here's how to start using this today" or "Here's what to watch for"
6. **Link**: To the official source

Keep articles between 500-1500 words. No filler. Every paragraph should either inform or advise.

### Tone guidelines
- Conversational, knowledgeable, helpful — not hype-driven or breathless
- Lead with the practical impact ("You can now..."), not the company announcement ("X just announced...")
- Include a link to the best source (official blog > changelog > tweet)
- No hashtags unless they genuinely add discoverability
- Frame through the lens of: "how does this help you work better with AI?"
- It's OK to have a take or opinion — you're a knowledgeable practitioner, not a newswire
- For articles: write like a trusted colleague explaining the news over coffee, not a press release

**If no items meet the post-worthy bar**: write "No post-worthy releases today — all updates were incremental." This is totally fine. Quality over volume.

---

## Step 5: Save to Journal

Determine today's journal file: `personal/journal/YYYY-MM-DD-DAY.md`

- If the file **exists**: append the digest before `## Action Items Captured` (or at the end if that heading doesn't exist). Use both the `## AI Feature Releases` section and `## Draft X Posts` section.
- If the file **does not exist**: create a minimal entry:

```markdown
# Journal — [Weekday, Month Day, Year]

## AI Feature Releases — [Date]

### Anthropic
[updates]

### OpenAI
[updates]

### Google Gemini
[updates]

## Draft X Posts
[posts or "No post-worthy releases today"]
```

---

## Step 6: Display Results

Print the full digest to screen so it can be reviewed immediately. Include both the feature releases and draft X posts sections.

If there were draft posts, note: "Review the drafts above — copy and personalize any you want to post on X today."

---

## Notes

- This command can be run manually anytime via `/ai-news-digest`
- It's invoked automatically as a sub-step of `/morning-sync` — see Step 4 in `.claude/commands/morning-sync.md`
- Do NOT fabricate updates — only report what you actually find in search results
- Always include source links so findings can be verified
- If WebSearch is unavailable, fall back to WebFetch on the changelog/release pages listed above
- The old `/claude-code-news` command still works for Claude Code-only checks
