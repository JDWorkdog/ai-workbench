# Plan: Add Planning Mode Workflow to Commands

## Context

The planning mode workflow (`EnterPlanMode` → `AskUserQuestion` → `ExitPlanMode`) ensures Claude plans before executing on complex commands. This prevents wasted effort by getting user alignment before generating substantial output. Currently, no commands use this pattern — they either ask inline questions or jump straight to execution.

## Which Commands Get the Workflow

### YES — Add planning workflow (14 commands)

**Content planning commands** (produce major documents where direction matters):
- `/prd` — `ai-workbench/.claude/commands/prd.md`
- `/ralph-prd` — `.claude/commands/ralph-prd.md`
- `/research` — `ai-workbench/.claude/commands/research.md`
- `/user-story` — `ai-workbench/.claude/commands/user-story.md`
- `/prompt` — `ai-workbench/.claude/commands/prompt.md`
- `/brainstorm` — `ai-workbench/.claude/commands/brainstorm.md`

**Repository analysis commands** (substantial exploration + documentation):
- `/repo-analysis` — `ai-workbench/.claude/commands/repo-analysis.md`
- `/repo-features` — `ai-workbench/.claude/commands/repo-features.md`
- `/repo-code-review` — `ai-workbench/.claude/commands/repo-code-review.md`
- `/repo-tech-detailed` — `ai-workbench/.claude/commands/repo-tech-detailed.md`
- `/repo-arch-review` — `ai-workbench/.claude/commands/repo-arch-review.md`
- `/repo-system-map` — `ai-workbench/.claude/commands/repo-system-map.md`
- `/repo-deep-dive` — `ai-workbench/.claude/commands/repo-deep-dive.md`

**Codebase exploration commands:**
- `/onboard` — `.claude/commands/onboard.md`

### NO — Skip these (18 commands)

Quick, direct actions where planning adds friction:
- Git operations: `/commit`, `/createpr`, `/merge2main`, `/postprcleanup`
- Quick capture: `/daily`, `/add-task`, `/issue`
- Input-driven: `/email`, `/meeting-summary`, `/extract-style`
- Scope-defined: `/review`, `/test`, `/security`, `/code-review`, `/explain`
- Session-based: `/handover`

## How It Works

**Replace** the existing "Ask me:" / "Clarifying Questions" sections with a Planning Phase that subsumes them. The planning workflow naturally includes asking questions via `AskUserQuestion`, so keeping both would create duplicate questioning.

### Planning Phase Block — Content Commands

Added near the top of: `/prd`, `/research`, `/brainstorm`, `/user-story`, `/prompt`

```markdown
## Planning Phase

Before generating any output, complete this planning workflow:

1. **Enter plan mode** using `EnterPlanMode`. You are now read-only — do not write any files.
2. **Understand the request.** Analyze the user's input and identify gaps. Use `AskUserQuestion` for anything unclear — do not guess at scope, audience, goals, or constraints. Ask only what you cannot infer.
3. **Propose a plan.** Use `ExitPlanMode` to present a markdown plan summary including:
   - Understood requirements — what you heard and interpreted
   - Proposed structure — outline of what you will produce
   - Key decisions — assumptions or scoping choices you made
4. **Wait for approval.** Only after the user approves, execute the full process below.
```

### Planning Phase Block — Repo Analysis Commands

Added near the top of: `/repo-analysis`, `/repo-features`, `/repo-code-review`, `/repo-tech-detailed`, `/repo-arch-review`, `/repo-system-map`

```markdown
## Planning Phase

Before generating the analysis, complete this planning workflow:

1. **Enter plan mode** using `EnterPlanMode`. You are now read-only — do not write any files.
2. **Load existing context.** Read prerequisite docs (functional overview, tech-stack reference, prior analyses) to understand what's already documented.
3. **Understand the request.** Use `AskUserQuestion` to determine the analysis lens and focus areas. Do not guess.
4. **Propose a plan.** Use `ExitPlanMode` to present a markdown plan summary including:
   - Analysis scope — what will be analyzed
   - Lens — the selected perspective (onboarding / tech debt / executive / all)
   - Proposed structure — outline of the document
   - Output location — where the file will be saved
5. **Wait for approval.** Only after the user approves, execute the full analysis below.
```

### Planning Phase Block — Orchestrator (`/repo-deep-dive`)

```markdown
## Planning Phase

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
```

## Per-File Changes

| Command | What to remove | What to add |
|---------|---------------|-------------|
| `/prd` | "Clarifying Questions Strategy" section + Process step 2 | Content Planning Phase |
| `/research` | "Ask me:" block (6 questions) | Content Planning Phase |
| `/brainstorm` | "Ask me:" block (5 questions) | Content Planning Phase |
| `/user-story` | "Clarifying Questions" section | Content Planning Phase |
| `/prompt` | "Ask me:" block (9 questions) | Content Planning Phase |
| `/ralph-prd` | Existing question section | Content Planning Phase |
| `/repo-analysis` | Nothing (has no questions) | Repo Analysis Planning Phase |
| `/repo-features` | "Determine Analysis Goal" section | Repo Analysis Planning Phase |
| `/repo-code-review` | "Determine Analysis Goal" section | Repo Analysis Planning Phase |
| `/repo-tech-detailed` | "Determine Analysis Goal" section | Repo Analysis Planning Phase |
| `/repo-arch-review` | "Determine Analysis Goal" section | Repo Analysis Planning Phase |
| `/repo-system-map` | "Determine Analysis Goal" section | Repo Analysis Planning Phase |
| `/repo-deep-dive` | "Collect User Input" + "Display Execution Plan" | Orchestrator Planning Phase |
| `/onboard` | Nothing (has no questions) | Content Planning Phase |

## Implementation Order

1. `/prd` — most complex transformation, serves as reference
2. `/research`, `/brainstorm`, `/prompt` — simple "Ask me" replacements
3. `/user-story` — structured questions replacement
4. `/ralph-prd`, `/onboard` — add-only changes
5. `/repo-features`, `/repo-code-review`, `/repo-tech-detailed`, `/repo-arch-review`, `/repo-system-map` — identical pattern, batch edit
6. `/repo-analysis` — add-only (no existing questions to remove)
7. `/repo-deep-dive` — unique orchestrator variant

## Verification

After editing each file:
- Read the modified file to confirm the Planning Phase is at the top, before any execution steps
- Confirm no duplicate questioning remains (old "Ask me" sections fully removed)
- Confirm the execution steps still reference "after approval" or "after the Planning Phase"
- Test one command (e.g., `/prd`) to verify Claude enters plan mode, asks questions, proposes a plan, and waits for approval before generating output
