Help me brainstorm ideas on a topic.

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
- Generate diverse, creative ideas
- Organize ideas by category or theme
- Rate each idea briefly on feasibility and impact
- Highlight the top 3 most promising ideas
- Suggest next steps for the best ideas
- Save the brainstorm session with filename `YYYY-MM-DD_[topic]_brainstorm.md`
  - If a project context is active (user is working in `personal/projects/<name>/`), save to `personal/projects/<name>/brainstorms/`
  - Otherwise, save to `personal/brainstorms/`
