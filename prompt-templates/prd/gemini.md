# PRD Creation - Gemini Version

Help me create a Product Requirements Document (PRD) optimized for developer comprehension.

## Context

A PRD (Product Requirements Document) is a document that outlines the requirements for a product feature. It serves as a contract between product, design, and engineering teams.

## Your Task

When a user describes a feature or product idea, help them create a comprehensive PRD by:
1. Asking clarifying questions
2. Generating a structured document
3. Offering refinement

## Process

### Phase 1: Information Gathering

Ask 3-5 clarifying questions about critical information gaps. Format for quick responses:

**Example Format:**
```
1. What is the primary goal of this feature?
   A. Improve user experience
   B. Increase user retention
   C. Reduce support burden
   D. Generate additional revenue

2. Who is the target user?
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

The user can respond: "1A, 2C, 3B"

**Question Categories to Consider:**
- Problem/Goal: What problem does this solve?
- Core Functionality: What key actions should users perform?
- Scope: What should this NOT do?
- Success Criteria: How will success be measured?
- Target Users: Who is this for?
- Timeline: What's the priority?

### Phase 2: PRD Generation

Generate a PRD with these 12 sections:

**Section 1: Introduction/Overview**
- Brief description of the feature
- Primary goal statement
- Length: 2-3 sentences

**Section 2: Problem Statement**
- User pain point or business need being addressed
- Why this matters

**Section 3: Goals and Objectives**
- 3-5 specific, measurable objectives
- Format: Bullet points with clear targets

**Section 4: User Stories**
- Format: "As a [user type], I want to [action], so that [benefit]"
- Include 3-5 core user stories

**Section 5: Functional Requirements**
- Numbered list of specific functionalities
- Format: "The system must [specific capability]"
- Be explicit and unambiguous

**Section 6: Non-Functional Requirements**
- Performance requirements
- Security requirements
- Scalability considerations
- Accessibility requirements

**Section 7: Non-Goals (Out of Scope)**
- Explicit list of what this feature will NOT include
- Prevents scope creep

**Section 8: Design Considerations**
- UI/UX requirements
- Mockup references (if available)
- Visual style notes
- Component references

**Section 9: Technical Considerations**
- Known constraints
- Dependencies on other systems
- Integration points
- Suggested technical approaches

**Section 10: Success Metrics**
- Quantitative measures
- Format: "[Metric]: [Target]"
- Example: "Feature adoption: Increase by 15%"

**Section 11: Timeline and Milestones**
- Key dates or phases
- Dependencies affecting delivery

**Section 12: Open Questions**
- Remaining items needing clarification
- Decisions pending

### Phase 3: Refinement

After generating the PRD:
1. Ask if any sections need adjustment
2. Offer to generate implementation tasks
3. Confirm the PRD meets expectations

## Output Guidelines

- Target audience: Junior developers
- Style: Explicit, unambiguous, jargon-free
- Format: Markdown with clear headers
- Requirements: Numbered for easy reference
