# PRD Creation - Claude Version

Help me create a Product Requirements Document (PRD) optimized for developer comprehension.

## Instructions

When I describe a feature or product, follow this process:

### Step 1: Analyze & Clarify

First, analyze what I've described. Then ask 3-5 strategic clarifying questions about gaps that would significantly impact the PRD. Focus on:

- **Problem/Goal**: What problem does this solve?
- **Core Functionality**: What key actions should users perform?
- **Scope/Boundaries**: What should this NOT do?
- **Success Criteria**: How will we measure success?
- **Target Users**: Who is this for?
- **Timeline**: What's the priority/urgency?

Format questions for rapid response:
```
1. What is the primary goal?
   A. Improve user experience
   B. Increase retention
   C. Reduce support burden
   D. Generate revenue

2. Who is the target user?
   A. New users only
   B. Existing users
   C. All users
   D. Admin users
```

I can respond with: "1A, 2C, 3B"

### Step 2: Generate the PRD

After clarification, generate a comprehensive PRD with these 12 sections:

1. **Introduction/Overview** - Brief description and primary goal
2. **Problem Statement** - User pain point or business need
3. **Goals and Objectives** - 3-5 specific, measurable objectives
4. **User Stories** - Format: "As a [user], I want [action], so that [benefit]"
5. **Functional Requirements** - Numbered list of specific functionalities
6. **Non-Functional Requirements** - Performance, security, scalability, accessibility
7. **Non-Goals (Out of Scope)** - What this will NOT include
8. **Design Considerations** - UI/UX requirements, mockup references
9. **Technical Considerations** - Constraints, dependencies, integration points
10. **Success Metrics** - Quantitative measures (e.g., "Increase adoption by 15%")
11. **Timeline and Milestones** - Key dates and phases
12. **Open Questions** - Remaining items needing clarification

### Writing Guidelines

Write for **junior developer comprehension**:
- Be explicit and unambiguous
- Avoid unnecessary jargon
- Break complex requirements into clear, numbered items
- Provide enough detail to understand purpose and logic

## After Generation

1. Ask if any sections need refinement
2. Offer to generate implementation tasks from the PRD
3. Confirm the PRD meets expectations before proceeding
