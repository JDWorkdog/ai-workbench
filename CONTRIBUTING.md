# Contributing to AI Workbench

Thanks for your interest in contributing! Here's how you can help.

## Important: No Company-Specific Content

**All content must be generic and free of company/brand references.** Do not include:
- Real company names
- Client or project names
- Proprietary product names
- Internal terminology

If examples are needed, use generic placeholders like "Workdog Enterprises", "[Company Name]", or "the product".

## Ways to Contribute

### Submit a Prompt
1. Fork this repo
2. Create your prompt in the appropriate category under `prompts/`
3. Include versions for Claude, ChatGPT, and Gemini
4. Add a README.md explaining the use case
5. Submit a pull request

### Improve Existing Prompts
- Found a better way to phrase something?
- Discovered LLM-specific optimizations?
- Open an issue or submit a PR with your improvements

### Add Resources
- Great tutorial video? Add it to `resources/videos.md`
- Useful article? Add it to `resources/articles.md`
- Helpful tool? Add it to `resources/tools.md`

### Report Issues
- Prompt not working as expected?
- Broken links?
- Outdated information?
- Open an issue and let us know

## Prompt Guidelines

When submitting prompts, please follow these guidelines:

### Structure
Each prompt should have its own folder under `prompts/{category}/` containing:
- `README.md` - What it does, when to use it, example outputs
- `claude.md` - Claude-optimized version
- `chatgpt.md` - ChatGPT-optimized version
- `gemini.md` - Gemini-optimized version

### Quality Standards
- **Tested** - Verify your prompt works across multiple scenarios
- **Clear** - Instructions should be unambiguous
- **Focused** - One prompt, one purpose
- **Documented** - Include usage examples and expected outputs

### LLM-Specific Adaptations
- **Claude**: Leverage its nuanced reasoning, can handle complexity
- **ChatGPT**: Be more explicit about output format, use examples
- **Gemini**: Include grounding context, be explicit about constraints

## Code of Conduct

- Be respectful and constructive
- Focus on the content, not the person
- Help others learn and improve

## Questions?

Open an issue or reach out to [@JDWorkdog](https://github.com/JDWorkdog)
