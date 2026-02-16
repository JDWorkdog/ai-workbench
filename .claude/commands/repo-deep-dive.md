Run all repository deep-dive analyses in parallel using sub-agents.

**Input:** $ARGUMENTS (repository name, project path in personal/projects/, or repository path)

## Instructions

### 1. Resolve Repository

Determine from $ARGUMENTS:
- **Repo name**: Extract from path (e.g., `/path/to/DTCloud` -> `DTCloud`) or use directly
- **Project folder**: `personal/projects/<repo-name>/`
- **Repo path**: The absolute path to the repository codebase

If $ARGUMENTS is just a name (e.g., `DTCloud`), check if `personal/projects/<repo-name>/` exists to confirm it's a known project, and look inside the functional spec for the original repository path.

### 2. Validate Prerequisites

Check that BOTH of these files exist in the project folder:
- `personal/projects/<repo-name>/{repo-name}-functional.md`
- `personal/projects/<repo-name>/{repo-name}-tech-stack.md`

**If either is missing, stop and display:**
```
Base analysis documents not found for {repo-name}.

Please run `/repo-analysis {repo}` first to generate the foundation documents, then run this command again.
```

### 3. Planning Phase

Before spawning any sub-agents, complete this planning workflow:

1. **Enter plan mode** using `EnterPlanMode`. You are now read-only — do not spawn agents.
2. **Validate prerequisites.** Check that base analysis docs exist.
3. **Understand the request.** Use `AskUserQuestion` to determine: which analyses to run, what lens, any focus areas.
4. **Propose an execution plan.** Use `ExitPlanMode` to present a plan summary including:
   - Prerequisites confirmed — which base docs were found
   - Analyses to run — which deep-dives will execute
   - Lens and focus — the selected perspective
   - Output files — exact filenames and locations
5. **Wait for approval.** Only after the user approves, spawn sub-agents.

### 4. Spawn Sub-Agents in Parallel

**CRITICAL: Use a SINGLE message with multiple Task tool calls to achieve true parallelism.** All selected analyses must be spawned in one go.

For each selected analysis, spawn a `general-purpose` sub-agent using the Task tool. Use `mode: "bypassPermissions"` so agents can write files without prompts.

**Sub-agent prompt template** (customize the placeholders for each analysis):

```
You are running a deep-dive analysis for a repository. Follow the instructions below precisely.

## Context (DO NOT re-ask these — they were collected from the user)

- Repository name: {repo-name}
- Repository path: {absolute-repo-path}
- Project folder: {absolute-path-to}/personal/projects/{repo-name}/
- Analysis lens (ALREADY SELECTED): {lens-letter} — {lens-description}
- Base docs location (ALREADY VERIFIED):
  - {absolute-path-to}/personal/projects/{repo-name}/{repo-name}-functional.md
  - {absolute-path-to}/personal/projects/{repo-name}/{repo-name}-tech-stack.md

## Your Task

1. Read the command template at:
   {absolute-path-to}/.claude/commands/{command-filename}

2. Execute that command with these modifications:
   - SKIP the "Planning Phase" step — the lens is: {lens-letter}
   - SKIP the prerequisite validation — base docs are verified
   - DO load the base docs and any other existing deep-dive docs for context
   - DO perform thorough codebase exploration as described in the command
   - DO generate the full document following the template structure exactly
   - DO save the output file to the project folder

3. After saving the file, report back:
   - Confirm the output file was saved
   - Provide a 2-3 sentence summary of your analysis
   - List your top 3-5 key findings

## Important

- You have full codebase access — use Read, Glob, Grep, and Bash freely
- DO NOT ask the user any questions — all inputs were provided above
- Apply the selected lens throughout your entire analysis
- Be thorough in your codebase exploration before generating the document
```

**Analysis-specific values:**

| Analysis | Task description | Command file | Output file |
|----------|-----------------|--------------|-------------|
| Feature deep dive | "Repo feature deep dive" | `repo-features.md` | `{repo}-features-detailed.md` |
| Code quality review | "Repo code quality review" | `repo-code-review.md` | `{repo}-code-review.md` |
| Technical deep dive | "Repo technical deep dive" | `repo-tech-detailed.md` | `{repo}-tech-detailed.md` |
| Architecture review | "Repo architecture review" | `repo-arch-review.md` | `{repo}-arch-review.md` |

### 5. Collect Results & Report

After all sub-agents complete, display a summary:

```
Deep-dive analysis complete for {repo-name}!

## Results

### {Analysis Name}
File: personal/projects/{repo-name}/{output-filename}
{Summary from sub-agent}
Key findings:
- {finding 1}
- {finding 2}
- {finding 3}

[Repeat for each completed analysis]

[If any failed:]
### {Analysis Name} — Failed
Run individually: /{command-name} {repo-name}

## All Output Files

personal/projects/{repo-name}/
  {list all generated files}

## Next Steps

- Review individual documents for detailed findings
- Run `/repo-system-map` to map cross-repo relationships
- Use findings to build roadmaps or onboarding materials
```

### 6. Output

The orchestrator itself does not produce a document file — its output is the set of documents generated by the sub-agents plus the summary displayed above.
