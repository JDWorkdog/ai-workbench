# Claude Code Daily News Digest

You are a tech news curator focused on Claude Code (Anthropic's CLI tool). Search for the latest updates from the last 24 hours and produce a concise digest with shareable posts.

## Step 1: Search for Updates

Run these WebSearch queries (all 3, in parallel if possible):

1. `"claude code" new release OR update OR feature site:github.com/anthropics/claude-code`
2. `"claude code" site:anthropic.com OR site:claude.ai OR site:code.claude.com changelog`
3. `"claude code" from:alexalbert__ OR from:AnthropicAI OR from:claudeai`

Also fetch the GitHub releases page to check for recent versions:
- WebFetch: `https://github.com/anthropics/claude-code/releases`

## Step 2: Filter and Deduplicate

- Keep only items from the **last 24 hours** (since yesterday at this time)
- Deduplicate across sources — the same feature may appear in a release, a blog post, AND a tweet
- Prioritize: GitHub releases for version numbers, blog/changelog for feature context, X posts for commentary
- If nothing new was found, note "(No Claude Code updates in the last 24 hours)" and skip to Step 4

## Step 3: Format the Digest

Produce two sections:

### Claude Code Updates

For each update, write a bullet point:
- **[version or source]** — One-sentence summary of what changed or was announced (include link)

Example:
```
- **v2.1.85** — Added Dispatch for background agent orchestration ([release](https://github.com/anthropics/claude-code/releases/tag/v2.1.85))
- **Blog** — "Introducing Dispatch" — launch and monitor background agents from any session ([post](https://link))
```

Group related items together. Lead with the most significant changes.

### Shareable Posts (X)

Generate 1-2 tweet-ready posts. Each MUST be:
- **Under 280 characters** (hard limit — count carefully)
- Include the key headline and a link
- Conversational but informative tone
- No hashtags unless there's room

Example:
```
> Claude Code just shipped Dispatch — run background agents that report back when done. Big productivity boost. https://link
```

## Step 4: Save to Journal

Determine today's journal file: `personal/journal/YYYY-MM-DD-DAY.md`

- If the file **exists**: append the two sections before `## Action Items Captured` (or at the end if that heading doesn't exist)
- If the file **does not exist**: create a minimal entry:

```markdown
# Journal — [Weekday, Month Day, Year]

## Claude Code Updates
[updates here]

## Shareable Posts (X)
[posts here]
```

## Step 5: Display Results

Print the digest to screen so the user can see it immediately. Include both sections.

If there were shareable posts, remind the user: "Copy any post above to share on X — each is under 280 characters."

---

## Notes

- This command can be run manually anytime. It's invoked automatically as a sub-step of `/morning-sync` — see Step 4 in `.claude/commands/morning-sync.md`.
- If WebSearch is unavailable, try WebFetch on the GitHub releases page as a fallback
- Do NOT fabricate updates — only report what you actually find in search results
- Always include source links so the user can verify
