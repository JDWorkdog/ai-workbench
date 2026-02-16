Generate a comprehensive feature-by-feature deep dive for a previously analyzed repository.

**Input:** $ARGUMENTS (repository name, project path in personal/projects/, or repository path)

## Instructions

### 1. Planning Phase

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

### 2. Load Existing Context

- Determine the repo name from the input (extract from path or use directly)
- Look for `{repo-name}-functional.md` in `personal/projects/<repo-name>/`
- Look for `{repo-name}-tech-stack.md` in `personal/projects/<repo-name>/`
- If neither exists, inform the user to run `/repo-analysis` first and stop
- Use the functional spec's feature list as the table of contents for this document
- If other deep-dive docs exist (`-code-review.md`, `-tech-detailed.md`, etc.), load them for additional context

### 3. Deep Exploration Phase

Access the actual repository codebase. For EACH feature listed in the functional spec, explore to discover:
- **Business rules and validation logic** — Read validators, manager classes, controller actions, service methods
- **Data model** — Read EF entities, Dapper queries, SQL scripts, migration files for table structures and relationships
- **State transitions** — Read status enums, workflow methods, state machine logic, lifecycle handlers
- **Permission checks** — Read authorization attributes, permission ID checks, role guards, policy definitions
- **Integration points** — Read external API calls, webhook triggers, event publishing, message bus interactions
- **Error scenarios** — Read exception handling, validation failures, edge case guards, error responses
- **Feature dependencies** — Read cross-references to other features, shared services, shared data

### 4. Generate Document

Save to: `personal/projects/<repo-name>/{repo-name}-features-detailed.md`

Structure:
```
# {Product Name} - Feature Deep Dive

> Analysis lens: {selected lens}
> Based on: {repo-name}-functional.md
> Repository: {repo path}
> Generated: {date}

## How to Read This Document

This document expands each feature from the functional overview into implementation-level detail. Each feature section follows the same structure: business rules, data model, state lifecycle, permissions, integrations, edge cases, and dependencies. Use the table of contents to jump to specific features.

## Table of Contents

- [Feature 1: {Name}](#feature-1-name)
- [Feature 2: {Name}](#feature-2-name)
- [... repeat for all features]

---

## Feature 1: {Feature Name}

### Overview
[2-3 sentence description of what this feature does and why it exists. Pull from the functional spec and enrich with implementation context.]

### Business Rules & Validation

List every business rule enforced by this feature. Be specific about thresholds, formats, and conditions.

| Rule | Enforcement Point | Behavior on Violation |
|------|-------------------|----------------------|
| {e.g., Name is required, max 200 chars} | {e.g., EntityManager.Create()} | {e.g., Returns 400 ArgumentException} |
| {e.g., Cannot delete if linked to child records} | {e.g., EntityManager.Delete()} | {e.g., Returns 409 ConflictException} |

**Conditional Logic:**
- [Describe if/then business rules. Example: "If status is 'Approved', editing requires a change order."]

**Calculated Fields:**
- [Describe derived values. Example: "Total = sum of line items. Recalculated on line item save."]

### Data Model

#### Primary Entities

| Entity | Table/Collection | Key Fields | Purpose |
|--------|-----------------|------------|---------|
| {Entity name} | {Table name} | {Key columns with types} | {What this entity represents} |

#### Relationships
```
[ASCII diagram showing how entities relate]

Example:
Parent (1) --> (*) Child --> (1) Reference
Parent (1) --> (*) JoinTable
Parent (*) --> (1) Owner [User]
```

#### Key Queries
- [Describe the primary read patterns, joins, and filtering used in practice]

### State Lifecycle

```
[ASCII state diagram showing all status transitions]

Example:
  ┌──────┐     ┌───────────┐     ┌──────────┐
  │ Draft│────>│ Submitted │────>│ Approved │
  └──────┘     └───────────┘     └──────────┘
                    │                   │
                    v                   v
              ┌──────────┐       ┌──────────┐
              │ Rejected │       │ Completed│
              └──────────┘       └──────────┘
```

**Transition Rules:**
| From | To | Trigger | Conditions | Side Effects |
|------|----|---------|------------|--------------|
| {Status A} | {Status B} | {What triggers it} | {What must be true} | {What else happens} |

### Permission Model

| Action | Required Permission | Additional Conditions |
|--------|-------------------|----------------------|
| {View} | {PermissionId or role} | {Scoping rules, e.g., own records only} |
| {Create} | {PermissionId or role} | {Any constraints} |
| {Delete} | {PermissionId or role} | {Business rule guards} |

**Role Summary:**
- [Which roles typically have which permissions for this feature]

### Integration Touchpoints

| Integration | Direction | Trigger | Data Exchanged |
|-------------|-----------|---------|----------------|
| {Service name} | {Inbound/Outbound} | {What triggers the integration} | {What data is sent/received} |

### Edge Cases & Error Scenarios

| Scenario | Current Behavior | Severity |
|----------|-----------------|----------|
| {Concurrent editing by two users} | {Last save wins; no optimistic concurrency} | {Medium} |
| {Referenced record deleted} | {Soft delete; orphaned references show "Removed"} | {Low} |
| {External service unavailable} | {Describe fallback behavior} | {High} |

### Feature Dependencies

| Depends On | Nature of Dependency | Impact if Unavailable |
|-----------|---------------------|----------------------|
| {Other feature/module} | {How it depends} | {What breaks or degrades} |

---

## Feature 2: {Feature Name}

[Repeat the same structure for every feature in the functional spec]

---

## Cross-Feature Dependency Map

### Dependency Matrix

A matrix showing which features depend on which other features.

|                    | Feature A | Feature B | Feature C | Feature D | ... |
|--------------------|:---------:|:---------:|:---------:|:---------:|:---:|
| **Feature A**      |     -     |    OUT    |           |           |     |
| **Feature B**      |    IN     |     -     |    OUT    |    IN     |     |
| **Feature C**      |           |    IN     |     -     |    OUT    |     |
| **Feature D**      |           |    OUT    |    IN     |     -     |     |

Legend: IN = depends on (consumes), OUT = depended upon (produces)

### Critical Path

[Identify the longest chain of feature dependencies and what a bug in any link would block downstream.]

### Shared Services

| Shared Service | Used By Features | Notes |
|---------------|-----------------|-------|
| {Auth/Session} | {All} | {Every API call validates session} |
| {Notification Engine} | {List features} | {Shared email/SMS pipeline} |
| {File Storage} | {List features} | {Common upload/download} |

## Appendix: Feature Maturity Assessment

| Feature | Maturity | Code Quality | Test Coverage | Known Debt |
|---------|----------|-------------|---------------|------------|
| {Feature name} | {Mature/Growing/Emerging/Legacy} | {High/Medium/Low} | {Percentage or None} | {Brief description} |

Maturity scale: Emerging (< 1 year, active development) | Growing (1-2 years, stabilizing) | Mature (2+ years, stable) | Legacy (needs modernization)
```

### 5. Output
- Save the document to `personal/projects/<repo-name>/{repo-name}-features-detailed.md`
- Provide a summary of: number of features analyzed, top findings, any features that were difficult to analyze (e.g., sparse code, heavy abstraction)
