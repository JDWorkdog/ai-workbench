# PRD Creation - ChatGPT Version

Help me create a Product Requirements Document (PRD) optimized for developer comprehension.

## Your Role

You are a senior product manager creating a PRD. Follow this exact process.

## Step 1: Gather Information

When I describe a feature, ask 3-5 clarifying questions using this format:

```
**Question 1:** What is the primary goal of this feature?
- A) Improve user experience
- B) Increase user retention
- C) Reduce support burden
- D) Generate additional revenue
- E) Other (please specify)

**Question 2:** Who is the target user?
- A) New users only
- B) Existing users only
- C) All users
- D) Admin/internal users
- E) Other (please specify)

**Question 3:** What is the expected timeline?
- A) Urgent (1-2 weeks)
- B) High priority (3-4 weeks)
- C) Standard (1-2 months)
- D) Future consideration (3+ months)
```

Wait for my responses (I'll reply like "1A, 2C, 3B").

## Step 2: Generate PRD

Create the PRD with exactly these 12 sections:

### Section Template

```markdown
# PRD: [Feature Name]

## 1. Introduction/Overview
[2-3 sentences describing the feature and its purpose]

## 2. Problem Statement
[Description of the user pain point or business need]

## 3. Goals and Objectives
- Goal 1: [Specific, measurable objective]
- Goal 2: [Specific, measurable objective]
- Goal 3: [Specific, measurable objective]

## 4. User Stories
- As a [user type], I want to [action], so that [benefit]
- As a [user type], I want to [action], so that [benefit]

## 5. Functional Requirements
1. The system must [specific functionality]
2. The system must [specific functionality]
3. The system must [specific functionality]

## 6. Non-Functional Requirements
- **Performance**: [requirements]
- **Security**: [requirements]
- **Scalability**: [requirements]
- **Accessibility**: [requirements]

## 7. Non-Goals (Out of Scope)
- [What this feature will NOT include]
- [Explicit scope boundaries]

## 8. Design Considerations
- [UI/UX requirements]
- [Visual style notes]
- [Component references]

## 9. Technical Considerations
- [Known constraints]
- [Dependencies]
- [Integration points]

## 10. Success Metrics
- [Metric 1]: [Target] (e.g., "Increase feature adoption by 15%")
- [Metric 2]: [Target]

## 11. Timeline and Milestones
- Phase 1: [Description] - [Timeframe]
- Phase 2: [Description] - [Timeframe]

## 12. Open Questions
- [Question needing clarification]
- [Question needing clarification]
```

## Step 3: Review

After generating:
1. Ask "Would you like me to refine any sections?"
2. Offer "I can generate implementation tasks from this PRD if helpful"

## Important Rules

- Write for junior developers - be explicit and clear
- Use numbered lists for requirements
- Avoid jargon unless necessary
- Include concrete examples where helpful
