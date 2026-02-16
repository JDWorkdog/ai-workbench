Help me create a Product Requirements Document (PRD) optimized for developer comprehension.

## Planning Phase

Before generating any output, complete this planning workflow:

1. **Enter plan mode** using `EnterPlanMode`. You are now read-only — do not write any files.
2. **Understand the request.** Analyze the user's input and identify gaps. Use `AskUserQuestion` for anything unclear — do not guess at scope, audience, goals, or constraints. Ask only what you cannot infer.
3. **Propose a plan.** Use `ExitPlanMode` to present a markdown plan summary including:
   - Understood requirements — what you heard and interpreted
   - Proposed structure — outline of what you will produce
   - Key decisions — assumptions or scoping choices you made
4. **Wait for approval.** Only after the user approves, execute the full process below.

## Process

1. **Analyze the initial request** to understand the feature/product context
2. **Ask 3-5 strategic clarifying questions** (following the exact format specified below) - only what's not inferable from the initial description
3. **Generate comprehensive PRD** using the 12-section structure below
4. **DO NOT implement** - ask if refinement needed first
5. **Offer to generate tasks** from the PRD if helpful
6. **Save the PRD** with filename format: `YYYY-MM-DD_[feature-name]_prd.md`
   - If a project context is active (user is working in `personal/projects/<name>/`), save to `personal/projects/<name>/drafts/`
   - Otherwise, save to `personal/drafts/`

## Clarifying Questions Strategy

**Only ask when critical information is missing.** Focus on gaps that would significantly impact the PRD's clarity.

Common areas needing clarification:
- **Problem/Goal**: What problem does this feature solve?
- **Core Functionality**: What key actions should users be able to perform?
- **Scope/Boundaries**: What should this feature NOT do?
- **Success Criteria**: How will we measure success?
- **Target Users**: Who is this for?
- **Timeline**: What's the urgency/priority?

### Question Format

**CRITICAL: Follow this exact formatting structure for questions:**

1. Each question MUST be numbered and on its own line
2. Each answer option (A, B, C, D) MUST be on its own line, indented with spaces
3. There MUST be a blank line between questions
4. DO NOT combine questions into a paragraph format

**Required format:**
```
1. What is the primary goal of this feature?
   A. Improve user onboarding experience
   B. Increase user retention
   C. Reduce support burden
   D. Generate additional revenue

2. Who is the target user for this feature?
   A. New users only
   B. Existing users only
   C. All users
   D. Admin users only

3. What is the expected timeline?
   A. Urgent (1-2 weeks)
   B. High priority (3-4 weeks)
   C. Standard (1-2 months)
   D. Future consideration (3+ months)
```

This format allows rapid responses like: "1A, 2C, 3B"

## PRD Structure

Generate a comprehensive PRD with these 12 sections:

### 1. Introduction/Overview
Briefly describe the feature and the problem it solves. State the primary goal.

### 2. Problem Statement
Explain the user pain point or business need this feature addresses.

### 3. Goals and Objectives
List specific, measurable objectives (3-5 items).

### 4. User Stories
Detail user narratives describing how users will interact with the feature and the benefits.
Format: "As a [user type], I want to [action], so that [benefit]"

### 5. Functional Requirements
List specific functionalities the feature must have. Use clear, numbered requirements.
Example: "1. The system must allow users to upload a profile picture in JPG or PNG format"

### 6. Non-Functional Requirements
Performance, security, scalability, accessibility requirements.

### 7. Non-Goals (Out of Scope)
Explicitly state what this feature will NOT include to manage scope and prevent scope creep.

### 8. Design Considerations (Optional)
UI/UX requirements, mockup links, component references, visual style notes.

### 9. Technical Considerations (Optional)
Known constraints, dependencies, integration points, suggested technical approaches.

### 10. Success Metrics
How will success be measured? Include quantitative metrics where possible.
Example: "Increase feature adoption by 15%", "Reduce support tickets by 20%"

### 11. Timeline and Milestones
Key dates, phases, or dependencies affecting delivery.

### 12. Open Questions
List remaining questions or areas needing further clarification before implementation.

## Target Audience

Write for **junior developer comprehension**:
- Be explicit and unambiguous
- Avoid unnecessary jargon
- Provide enough detail for them to understand purpose and logic
- Break complex requirements into clear, numbered items

## After Generation

1. **DO NOT start implementing** the feature
2. **Ask if user wants to refine** any sections
3. **Offer to generate tasks** from the PRD into the task management system
4. **Confirm the PRD meets expectations** before proceeding
5. **Save the PRD** to the active output location (project folder or `personal/drafts/`)
