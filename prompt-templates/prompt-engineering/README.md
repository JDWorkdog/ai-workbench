# Prompt Engineering

Build and refine prompts for any AI system.

## What It Does

This prompt helps you create effective prompts for:
- Claude, ChatGPT, Gemini, and other LLMs
- Image generators (Midjourney, DALL-E, Stable Diffusion)
- Code assistants (Copilot, Cursor)
- Any AI system that takes natural language input

## When to Use

- Starting a new AI workflow and need a solid prompt foundation
- Existing prompt isn't getting the results you want
- Converting a prompt from one AI system to another
- Building prompts for API integration vs. chat interface

## Key Features

- Asks strategic clarifying questions before building
- Considers browser vs. API usage (includes system prompts for API)
- Generates variations for A/B testing
- Explains the reasoning behind prompt elements
- Provides iteration guidance

## Example Output

**Input:** "I need a prompt for Claude to help me write technical blog posts"

**Output:** A structured prompt with:
- Clear role/context setting
- Specific instructions for technical writing style
- Input/output format specifications
- Guidelines for code examples and technical accuracy
- Iteration suggestions

## Versions

| LLM | File | Notes |
|-----|------|-------|
| Claude | [claude.md](claude.md) | Best for nuanced, complex prompts |
| ChatGPT | [chatgpt.md](chatgpt.md) | More explicit formatting guidance |
| Gemini | [gemini.md](gemini.md) | Added grounding context |

## Related Resources

- [Claude Code Command](../../claude-code/commands/prompt.md) - Use as `/prompt` in Claude Code
- [Claude Action](../../claude-actions/prompt-engineering.md) - Use in Claude Projects
