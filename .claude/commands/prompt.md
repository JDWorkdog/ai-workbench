Help me build or refine a prompt for AI systems.

## Planning Phase

Before generating any output, complete this planning workflow:

1. **Enter plan mode** using `EnterPlanMode`. You are now read-only — do not write any files.
2. **Understand the request.** Analyze the user's input and identify gaps. Use `AskUserQuestion` for anything unclear — do not guess at scope, audience, goals, or constraints. Ask only what you cannot infer.
3. **Propose a plan.** Use `ExitPlanMode` to present a markdown plan summary including:
   - Understood requirements — what you heard and interpreted
   - Proposed structure — outline of what you will produce
   - Key decisions — assumptions or scoping choices you made
4. **Wait for approval.** Only after the user approves, execute the full process below.

## Execution

After plan approval:
- Analyze the requirements
- If using an API, also include a System Prompt
- Build a well-structured prompt using best practices:
  - Clear instructions
  - Relevant context
  - Output format specification
  - Examples if helpful
  - Constraints and guidelines
- Provide 2-3 variations if requested
- Explain the reasoning behind key prompt elements
- Suggest how to test and iterate on the prompt
- Offer to save the prompt with filename `YYYY-MM-DD_[topic]_prompt.md`
  - If a project context is active (user is working in `personal/projects/<name>/`), save to `personal/projects/<name>/prompts/`
  - Otherwise, save to `personal/prompts/`
