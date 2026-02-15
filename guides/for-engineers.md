# AI Workbench for Engineers

Your guide to AI-powered engineering workflows.

## Quick Start

As an engineer, you'll get the most value from:
1. **Prompt Engineering** - Build effective prompts for AI coding assistants
2. **Research** - Technical research, library comparisons, architecture decisions
3. **Documentation** - Technical specs, API docs, README files
4. **Code Generation** - Using prompts to guide code output

## Recommended Prompts

### Core Engineering

| Task | Prompt | Best For |
|------|--------|----------|
| Build Prompts | [Prompt Engineering](../prompts/prompt-engineering/) | Create prompts for Copilot, Cursor, Claude |
| Technical Research | [Research Prompt](../prompts/research/) | Library comparisons, architecture decisions |
| PRDs (for Tech Specs) | [PRD Prompt](../prompts/prd/) | Technical specifications and requirements |

### Documentation

| Task | Prompt | Best For |
|------|--------|----------|
| Technical Docs | *Coming soon* | API documentation, technical guides |

## Claude Code Commands

Claude Code is built for engineers. These commands enhance your workflow:

| Command | What It Does |
|---------|--------------|
| `/prompt` | Build prompts for AI coding tools |
| `/research` | Research libraries, patterns, best practices |
| `/prd` | Create technical specifications |

[How to install commands →](../claude-code/README.md)

## Claude Code Skills

Skills are modular capability packages for Claude Code:

| Skill | What It Does |
|-------|--------------|
| *Coming soon* | Code review, testing, documentation |

[Browse skills →](../claude-code/skills/)

## Tips for Engineers

### Prompt Engineering for Code
- Be specific about language, framework, and version
- Include code style preferences
- Provide context about the codebase
- Ask for tests alongside implementation

### Technical Research
- Specify your constraints (performance, security, compatibility)
- Ask for trade-off analysis
- Request code examples
- Compare multiple solutions

### Working with AI Coding Tools
- Use clear, structured prompts
- Provide relevant context
- Iterate in small steps
- Review and understand generated code

## Example Workflows

**Building a Coding Prompt:**
1. Use `/prompt` or the Prompt Engineering prompt
2. Specify the AI tool (Copilot, Cursor, Claude)
3. Define the coding task
4. Get a structured prompt to use

**Technical Architecture Research:**
1. Use the Research prompt
2. Specify the technical problem
3. Ask for multiple approaches with trade-offs
4. Request example implementations

## Integration with Dev Tools

### With GitHub Copilot
- Use our prompts to craft better Copilot comments
- Structure your prompt → better completions

### With Cursor
- Copy prompts into Cursor's chat
- Use for complex refactoring tasks

### With Claude Code
- Install commands for quick access
- Build custom workflows for your codebase

## Getting Started

1. **Install Claude Code:**
   - [Installation Guide](../resources/getting-started/install-claude-code.md)
   - Takes ~5 minutes

2. **Add Commands:**
   - Copy commands from `claude-code/commands/`
   - Place in your project's `.claude/commands/`

3. **Try It:**
   - Open your project in VSCode
   - Type `/prompt` to build your first AI prompt
