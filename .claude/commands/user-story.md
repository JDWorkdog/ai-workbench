# User Story Command

Help me write well-formed user stories for a feature or product.

## Process

1. **Understand the context** - Ask clarifying questions about the feature and users
2. **Identify users and scenarios** - Determine who will use this and what they need
3. **Generate user stories** - Create properly formatted stories following best practices
4. **Define acceptance criteria** - Specify how to validate story completion
5. **Validate against INVEST criteria** - Ensure stories are Independent, Negotiable, Valuable, Estimable, Small, and Testable
6. **Save and refine** - Store in appropriate location and offer improvements

## Clarifying Questions

**CRITICAL: Follow this exact formatting structure for questions:**

1. Each question MUST be numbered and on its own line
2. Each answer option (A, B, C, D) MUST be on its own line, indented with spaces
3. There MUST be a blank line between questions
4. DO NOT combine questions into a paragraph format
5. DO NOT remove line breaks between questions or options

Ask me these questions to understand what you need:

1. **What feature or epic are these user stories for?**
   - Provide the feature name and brief context

2. **Who are the primary users?**
   - A) End users/customers
   - B) Internal users (employees, admins)
   - C) Developers/technical users
   - D) Multiple user types (specify which)

3. **What's the scope?**
   - A) Single user story for a specific scenario
   - B) Multiple stories for a feature
   - C) Complete epic breakdown with multiple stories
   - D) Story refinement/splitting of an existing large story

4. **What level of detail do you need?**
   - A) Basic user stories only (As a... I want... So that...)
   - B) Stories with acceptance criteria
   - C) Stories with acceptance criteria and edge cases
   - D) Full stories with acceptance criteria, edge cases, and story point estimates

5. **Any specific constraints or requirements?** (optional)
   - Technical constraints
   - Business rules
   - Dependencies on other features
   - Compliance or security requirements

You can answer quickly like: "1: User authentication, 2D, 3B, 4B, 5: Must comply with SOC2"

## User Story Structure

Generate user stories following this proven format:

### Standard Format
```
**Story Title**: [Brief, action-oriented title]

**User Story**:
As a [user type/persona],
I want to [perform some action],
So that [I can achieve some benefit/goal].

**Acceptance Criteria**:
- [ ] Given [context], when [action], then [expected result]
- [ ] Given [context], when [action], then [expected result]
- [ ] [Additional testable criteria]

**Edge Cases & Scenarios** (if detailed):
- What happens if [error condition]?
- How does this work when [boundary condition]?
```

### INVEST Criteria Validation

Ensure each story meets these criteria:
- **I**ndependent: Can be developed and delivered separately
- **N**egotiable: Details can be discussed and refined
- **V**aluable: Delivers clear value to users or business
- **E**stimable: Team can estimate effort reasonably
- **S**mall: Can be completed in one sprint/iteration
- **T**estable: Clear criteria for "done"

If a story doesn't meet INVEST criteria, flag it and suggest how to fix it.

### Examples

**Good User Story**:
```
**Story Title**: Reset Password via Email

**User Story**:
As a registered user who forgot their password,
I want to receive a password reset link via email,
So that I can regain access to my account without contacting support.

**Acceptance Criteria**:
- [ ] Given I'm on the login page, when I click "Forgot Password", then I see a password reset form
- [ ] Given I enter my registered email, when I submit the form, then I receive a reset email within 2 minutes
- [ ] Given I click the reset link, when the link is less than 24 hours old, then I can set a new password
- [ ] Given I click the reset link, when the link is expired, then I see an error and can request a new link
- [ ] Given I successfully reset my password, when I use the new password to log in, then I gain access to my account
```

**Poor User Story** (and why):
```
"As a user, I want a better login experience"
- Too vague - what specific action or feature?
- No clear acceptance criteria
- Not estimable or testable
```

**Improved**:
```
"As a returning user, I want to stay logged in for 30 days after checking 'Remember Me', so that I don't have to re-enter credentials on every visit"
```

## Story Splitting Guidance

If a user story is too large (can't be completed in one sprint), suggest splitting by:

1. **Workflow steps**: Break multi-step processes into individual stories
2. **User roles**: Separate stories for different user types
3. **CRUD operations**: Split Create, Read, Update, Delete into separate stories
4. **Simple/Complex scenarios**: Start with the happy path, add complexity later
5. **Data variations**: Handle different data types or sources separately
6. **Business rules**: Separate core functionality from business rule variations

## Output Specifications

**Format**: Markdown (.md)

**Save Location**: If a project context is active (user is working in `personal/projects/<name>/`), save to `personal/projects/<name>/drafts/`. Otherwise, save to `personal/drafts/`.

**Filename Convention**:
- Single feature: `YYYY-MM-DD_[feature-name]_user-stories.md`
- Epic breakdown: `YYYY-MM-DD_[epic-name]_epic-stories.md`

**File Structure**:
```markdown
# User Stories: [Feature/Epic Name]

**Created**: [Date]
**Context**: [Brief description of the feature/epic]
**Target Users**: [Primary user types]

---

## Story 1: [Title]

[User story and acceptance criteria]

---

## Story 2: [Title]

[User story and acceptance criteria]

---

## Story Dependencies (if applicable)

- Story 2 depends on Story 1 being completed
- Story 5 requires API endpoint from Story 3

## Notes

[Any additional context, assumptions, or open questions]
```

## After Generation

After creating the user stories, I will:

1. **Ask for your review**: "How do these stories look? Any changes or refinements needed?"

2. **Offer enhancements**:
   - "Would you like me to break any large stories into smaller ones?"
   - "Should I add story point estimates using Planning Poker scales (1, 2, 3, 5, 8, 13)?"
   - "Want me to create tasks using `/add-task` for the highest priority stories?"
   - "Should I generate a separate acceptance criteria doc for QA?"

3. **Suggest next steps**:
   - Link stories to existing PRD if one exists
   - Create backlog tasks for each story
   - Generate test cases from acceptance criteria

---

Let's write some great user stories! Tell me about the feature you're working on.
