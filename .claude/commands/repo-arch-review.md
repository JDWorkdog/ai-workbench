Perform an evaluative architecture review of a previously analyzed repository.

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
- Look for ALL existing analysis docs in `personal/projects/<repo-name>/`:
  - `{repo-name}-functional.md` (required)
  - `{repo-name}-tech-stack.md` (required)
  - `{repo-name}-features-detailed.md` (optional, enriches analysis)
  - `{repo-name}-code-review.md` (optional, enriches analysis)
  - `{repo-name}-tech-detailed.md` (optional, enriches analysis)
- If no functional or tech-stack spec exists, inform the user to run `/repo-analysis` first and stop
- Use all available docs as context to avoid re-exploring already-documented areas

### 3. Architecture Evaluation Phase

Access the actual repository codebase. For each assessment dimension:
- Identify the architectural approach used
- Evaluate it against industry best practices
- Provide specific evidence from the codebase (file paths, code patterns)
- Render a verdict with grade and confidence level
- Recommend specific improvements where warranted

This document is EVALUATIVE, not descriptive. It renders judgment. Where the tech-stack spec says "we use X," this document asks "is X the right choice? Is it implemented well? What are the risks?"

### 4. Generate Document

Save to: `personal/projects/<repo-name>/{repo-name}-arch-review.md`

Structure:
```
# {Product Name} - Architecture Review

> Analysis lens: {selected lens}
> Based on: All available analysis docs in personal/projects/<repo-name>/
> Repository: {repo path}
> Generated: {date}
> Review type: Evaluative architecture assessment

## Executive Summary

[4-6 sentences: Overall architecture fitness verdict. What is the architecture optimized for? Where does it excel? What are the top 3 structural risks? What is the single most impactful improvement? Include overall fitness grade.]

## Architecture Fitness Scorecard

| Dimension | Grade | Trend | Verdict |
|-----------|-------|-------|---------|
| Separation of Concerns | {A-F} | {Improving/Stable/Degrading} | {One-sentence verdict} |
| Coupling & Cohesion | {A-F} | {Trend} | {Verdict} |
| Scalability | {A-F} | {Trend} | {Verdict} |
| Resilience & Fault Tolerance | {A-F} | {Trend} | {Verdict} |
| Security Architecture | {A-F} | {Trend} | {Verdict} |
| Data Architecture | {A-F} | {Trend} | {Verdict} |
| API Design Maturity | {A-F} | {Trend} | {Verdict} |
| Observability | {A-F} | {Trend} | {Verdict} |
| DevOps Maturity | {A-F} | {Trend} | {Verdict} |
| Evolvability | {A-F} | {Trend} | {Verdict} |
| **Overall Fitness** | **{A-F}** | **{Trend}** | **{Overall verdict}** |

Grading: A = Industry-leading, B = Solid and appropriate, C = Functional but with notable gaps, D = Structurally concerning, F = Architecturally unsound
Trend: Based on evidence of recent changes (newer code vs. older patterns)

---

## 1. Separation of Concerns

### Current Architecture

[Describe the layering strategy: how the codebase separates controllers, business logic, data access, and cross-cutting concerns.]

### Assessment

**Strengths:**
- [Evidence-backed strengths]

**Concerns:**
- [Evidence-backed concerns with file path references]

**Verdict:** {Grade} — {1-2 sentence justification}

---

## 2. Coupling & Cohesion

### Coupling Analysis

#### Inter-Service/Module Coupling

| Component A | Component B | Coupling Type | Strength | Concern |
|------------|------------|---------------|----------|---------|
| {Component} | {Component} | {Database/API/Library/Direct call} | {High/Medium/Low} | {Why this matters} |

#### Database Coupling

| Database/Schema | Owning Component(s) | Other Readers | Other Writers | Assessment |
|----------------|---------------------|---------------|---------------|-----------|
| {Database name} | {Who owns it} | {Who reads} | {Who writes} | {Clean/Shared/Concerning} |

### Cohesion Analysis

| Component | Cohesion Type | Assessment |
|-----------|--------------|-----------|
| {Component name} | {Functional/Logical/Utility} | {High/Medium/Low with explanation} |

**Verdict:** {Grade} — {Justification}

---

## 3. Scalability

### Current Scalability Profile

| Dimension | Current Approach | Limit | Assessment |
|-----------|-----------------|-------|-----------|
| {Horizontal scaling} | {Strategy} | {What limits it} | {Assessment} |
| {Database scaling} | {Strategy} | {What limits it} | {Assessment} |
| {Background processing} | {Strategy} | {What limits it} | {Assessment} |
| {File/blob storage} | {Strategy} | {What limits it} | {Assessment} |

### Scalability Bottlenecks

| Bottleneck | Impact | Trigger Point | Mitigation |
|-----------|--------|---------------|------------|
| {What will break first under load} | {Consequence} | {At what scale} | {How to fix} |

**Verdict:** {Grade} — {Justification}

---

## 4. Resilience & Fault Tolerance

### Resilience Patterns in Use

| Pattern | Implementation | Where Used | Effectiveness |
|---------|---------------|------------|---------------|
| {Retry with backoff} | {Library/approach} | {Components} | {Assessment} |
| {Circuit breaker} | {Library or "Not implemented"} | {Components} | {Assessment} |
| {Bulkhead} | {Implementation or "Not implemented"} | {Components} | {Assessment} |
| {Timeout} | {Configuration} | {Components} | {Assessment} |
| {Dead letter queue} | {Implementation} | {Components} | {Assessment} |
| {Graceful degradation} | {Implementation or "Not implemented"} | {Components} | {Assessment} |

### Failure Mode Analysis

| Failure Scenario | Current Behavior | Impact | Recommendation |
|-----------------|-----------------|--------|----------------|
| {Database outage} | {What happens} | {User impact} | {What should happen} |
| {Auth provider outage} | {What happens} | {User impact} | {What should happen} |
| {Payment gateway outage} | {What happens} | {User impact} | {What should happen} |
| {Third-party service outage} | {What happens} | {User impact} | {What should happen} |

### Single Points of Failure

| Component | Failure Impact | Redundancy | Risk Level |
|-----------|---------------|------------|------------|
| {Critical component} | {What breaks} | {Current redundancy} | {High/Medium/Low} |

**Verdict:** {Grade} — {Justification}

---

## 5. Security Architecture

### Authentication Architecture

| Component | Method | Assessment |
|-----------|--------|-----------|
| {User-facing} | {Auth method} | {Evaluation} |
| {API-to-API} | {Auth method} | {Evaluation} |
| {Partner/External} | {Auth method} | {Evaluation} |

### Authorization Architecture

- **Model type**: {RBAC / ABAC / ACL / Custom}
- **Granularity**: {Coarse/Fine — can you control per-field, per-record, per-operation?}
- **Enforcement point**: {Where are permissions checked — middleware, controller, service layer?}
- **Consistency**: {Are permissions checked uniformly across all endpoints?}
- **Row-level security**: {Is there data isolation at the query layer?}

### Data Protection

| Data Type | At Rest | In Transit | Access Control | Assessment |
|-----------|---------|-----------|----------------|-----------|
| {Credentials} | {Encryption method} | {TLS} | {Who can access} | {Adequate/Concern} |
| {Payment data} | {Tokenization/encryption} | {TLS} | {PCI scope} | {Assessment} |
| {Tenant data} | {Encryption method} | {TLS} | {Isolation method} | {Assessment} |
| {API keys/secrets} | {Storage method} | {TLS} | {Access controls} | {Assessment} |

**Verdict:** {Grade} — {Justification}

---

## 6. Data Architecture

### Data Ownership & Boundaries

| Domain | Data Store | Owner | Boundaries | Assessment |
|--------|-----------|-------|-----------|-----------|
| {Data domain} | {Database/table} | {Which component owns it} | {Strong/Weak boundaries} | {Assessment} |

### Data Consistency Model

- **Consistency type**: {Strong/Eventual/Mixed}
- **Cross-database transactions**: {Present/Absent — how is cross-DB consistency maintained?}
- **Event-driven sync**: {How is data synchronized across stores?}
- **Conflict resolution**: {How are concurrent writes handled?}

### Data Architecture Concerns

[Evaluate schema design quality, normalization choices, query patterns, data lifecycle management.]

**Verdict:** {Grade} — {Justification}

---

## 7. API Design Maturity

### API Style Assessment

| Criterion | Status | Evidence |
|-----------|--------|---------|
| {Resource-based URLs} | {Yes/Partial/No} | {Example URL patterns} |
| {Proper HTTP verbs} | {Yes/Partial/No} | {How verbs are used} |
| {Consistent response shapes} | {Yes/Partial/No} | {Response patterns found} |
| {Versioning strategy} | {Yes/Partial/No} | {How versions are handled} |
| {Health check endpoints} | {Yes/No} | {Presence and format} |
| {HATEOAS/Discoverability} | {Yes/No} | {Link relations present?} |
| {Rate limiting} | {Yes/Partial/No} | {Implementation details} |
| {Documentation} | {Yes/Partial/No} | {Swagger, OpenAPI, etc.} |

### API Design Concerns

| Concern | Evidence | Impact | Recommendation |
|---------|----------|--------|----------------|
| {Design issue} | {Specific examples} | {What this causes} | {How to fix} |

**Verdict:** {Grade} — {Justification}

---

## 8. Observability

### Current Observability Stack

| Pillar | Tool/Approach | Coverage | Assessment |
|--------|-------------|----------|-----------|
| {Logging} | {Tool name} | {What's covered} | {Assessment} |
| {Metrics} | {Tool name or "None"} | {What's measured} | {Assessment} |
| {Tracing} | {Tool name or "None"} | {What's traced} | {Assessment} |
| {Alerting} | {Tool name or "None"} | {What triggers alerts} | {Assessment} |
| {User analytics} | {Tool name or "None"} | {What's tracked} | {Assessment} |

### Observability Gaps

[What operational questions cannot be answered? List 5-8 key questions and whether the current system can answer them.]

**Verdict:** {Grade} — {Justification}

---

## 9. DevOps Maturity

### DORA Metrics Assessment

| Metric | Estimated Level | Evidence | Industry Target |
|--------|----------------|---------|----------------|
| {Deployment Frequency} | {Daily/Weekly/Monthly/Unknown} | {Evidence} | {Multiple/day} |
| {Lead Time for Changes} | {Hours/Days/Weeks/Unknown} | {Evidence} | {< 1 day} |
| {Change Failure Rate} | {Low/Medium/High/Unknown} | {Evidence} | {< 15%} |
| {Time to Restore} | {Minutes/Hours/Days/Unknown} | {Evidence} | {< 1 hour} |

### DevOps Practices

| Practice | Status | Assessment |
|----------|--------|-----------|
| {Version control} | {Tool} | {Assessment} |
| {CI/CD pipeline} | {Present/Absent} | {Assessment} |
| {Automated testing} | {Coverage level} | {Assessment} |
| {Infrastructure as code} | {Present/Absent} | {Assessment} |
| {Containerization} | {Level of adoption} | {Assessment} |
| {Environment parity} | {Description} | {Assessment} |
| {Feature flags} | {Implementation} | {Assessment} |
| {Database migrations} | {Approach} | {Assessment} |

**Verdict:** {Grade} — {Justification}

---

## 10. Evolvability

### Change Difficulty Matrix

| Change Type | Difficulty | Bottleneck | Example |
|-------------|-----------|-----------|---------|
| {Add a new endpoint} | {Low/Medium/High/Very High} | {What makes it hard} | {Concrete example} |
| {Add a new service/module} | {Difficulty} | {Bottleneck} | {Example} |
| {Change database schema} | {Difficulty} | {Bottleneck} | {Example} |
| {Replace a technology} | {Difficulty} | {Bottleneck} | {Example} |
| {Extract a service} | {Difficulty} | {Bottleneck} | {Example} |

### Architecture Decision Records (Inferred)

[Note: If no formal ADRs exist, infer the key decisions and document them with rationale]

| Decision | Rationale (Inferred) | Trade-offs | Status |
|----------|---------------------|-----------|--------|
| {Key architectural decision} | {Why this was likely chosen} | {Pro/Con} | {Entrenched/Established/Evolving} |

**Verdict:** {Grade} — {Justification}

---

## Prioritized Recommendations

### Recommendation Matrix

| # | Recommendation | Impact | Effort | Risk if Ignored | Priority |
|---|---------------|--------|--------|-----------------|----------|
| 1 | {Highest priority recommendation} | {High/Medium/Low} | {Low/Medium/High} | {What happens if you don't do this} | {Critical/High/Medium/Low} |
| 2 | | | | | |
| 3 | | | | | |
| ... | | | | | |

### Quick Wins (Low Effort, High Impact)

| Action | Effort | Impact |
|--------|--------|--------|
| {Quick fix that provides outsized value} | {Time estimate} | {What it improves} |

### Strategic Initiatives (High Effort, High Impact)

| Initiative | Effort | Impact | Dependencies |
|-----------|--------|--------|-------------|
| {Major improvement} | {Time estimate} | {What it enables} | {Prerequisites} |

### Not Recommended (Avoid These)

| Avoid | Reason |
|-------|--------|
| {Tempting but wrong improvement} | {Why it's not worth doing now} |

---

## Architecture Characteristics Radar

```
          Scalability
              |
    Security  |  Performance
        \     |     /
         \    |    /
          \   |   /
Reliability---+---Evolvability
          /   |   \
         /    |    \
        /     |     \
   Observ.    |  Maintainability
              |
         Deployability

Scores (1-5):
- Scalability:     {n}/5  ({brief reason})
- Security:        {n}/5  ({brief reason})
- Performance:     {n}/5  ({brief reason})
- Evolvability:    {n}/5  ({brief reason})
- Maintainability: {n}/5  ({brief reason})
- Deployability:   {n}/5  ({brief reason})
- Observability:   {n}/5  ({brief reason})
- Reliability:     {n}/5  ({brief reason})
```
```

### 5. Output
- Save the document to `personal/projects/<repo-name>/{repo-name}-arch-review.md`
- Provide a summary of: overall fitness grade, top 3 risks, top 3 quick wins, and single most important recommendation
