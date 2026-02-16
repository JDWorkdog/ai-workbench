Perform a comprehensive code quality review of a previously analyzed repository.

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

### 2. Determine Analysis Goal

**IMPORTANT: Format questions clearly - each question MUST be on its own numbered line. DO NOT combine questions into a paragraph.**

Ask the user:

1. What lens should I use for this review?
   A. Onboarding & knowledge transfer (emphasize patterns to follow and patterns to avoid, "do this, not that" guidance)
   B. Tech debt & modernization planning (emphasize severity, effort, and prioritization of fixes)
   C. Executive/stakeholder visibility (emphasize risk, business impact, and summary scorecards)
   D. All of the above (comprehensive)

### 3. Load Existing Context

- Determine the repo name from the input (extract from path or use directly)
- Look for `{repo-name}-functional.md` in `personal/projects/<repo-name>/`
- Look for `{repo-name}-tech-stack.md` in `personal/projects/<repo-name>/`
- If neither exists, inform the user to run `/repo-analysis` first and stop
- Use both documents to map code areas to feature areas
- If other deep-dive docs exist (`-features-detailed.md`, `-tech-detailed.md`, etc.), load them for additional context

### 4. Deep Code Review Phase

Access the actual repository codebase. Systematically review across these dimensions:
- **Pattern consistency** — Compare how different feature areas implement the same patterns (controller structure, data access, error handling, naming)
- **Complexity** — Look for long methods (200+ lines), deep nesting (4+ levels), high cyclomatic complexity, god classes
- **Error handling** — Check for swallowed exceptions, inconsistent error responses, missing validation, generic catch blocks
- **Security** — Apply OWASP Top 10 checklist against actual code (injection, broken auth, misconfig, vulnerable deps, etc.)
- **Performance** — Look for N+1 queries, missing indexes, unbounded result sets, blocking calls, large object allocations
- **Test coverage** — Examine test projects, test patterns, coverage configuration, test quality
- **Technical debt** — Catalog TODO/HACK/FIXME comments, deprecated code, workarounds, version mismatches, dead code
- **Dependency health** — Check for outdated packages, known CVEs, abandoned libraries, beta packages in production

### 5. Generate Document

Save to: `personal/projects/<repo-name>/{repo-name}-code-review.md`

Structure:
```
# {Product Name} - Codebase Code Review

> Analysis lens: {selected lens}
> Based on: {repo-name}-functional.md, {repo-name}-tech-stack.md
> Repository: {repo path}
> Generated: {date}
> Scope: Full repository code quality assessment

## Executive Summary

[3-5 sentences summarizing overall code health. Include: overall quality grade (A-F), top 3 strengths, top 3 concerns, and one-sentence recommendation.]

## Code Health Scorecard

| Dimension | Grade | Summary |
|-----------|-------|---------|
| Pattern Consistency | {A-F} | {One-sentence assessment} |
| Code Complexity | {A-F} | {One-sentence assessment} |
| Error Handling | {A-F} | {One-sentence assessment} |
| Security Posture | {A-F} | {One-sentence assessment} |
| Performance | {A-F} | {One-sentence assessment} |
| Test Coverage | {A-F} | {One-sentence assessment} |
| Technical Debt | {A-F} | {One-sentence assessment} |
| Dependency Health | {A-F} | {One-sentence assessment} |
| **Overall** | **{A-F}** | **{One-sentence overall}** |

Grading: A = Exemplary, B = Good with minor issues, C = Adequate with notable gaps, D = Concerning, needs attention, F = Critical, immediate action needed

---

## 1. Pattern Consistency

### Established Patterns

Document the patterns the codebase follows consistently. These are the "rules" of this codebase.

| Pattern | Description | Adherence |
|---------|-------------|-----------|
| {e.g., Controller structure} | {e.g., All controllers extend BaseController, use attribute routing} | {High/Medium/Low} |
| {e.g., Data access} | {e.g., Repository pattern with unit of work} | {High/Medium/Low} |

### Pattern Violations

| Location | Expected Pattern | Actual Implementation | Severity |
|----------|-----------------|----------------------|----------|
| {File path} | {What should be used} | {What was done instead} | {High/Medium/Low} |

### Inconsistencies Across Feature Areas

[Describe where different feature areas diverge in their implementation approach. Identify which pattern is "correct" vs. which are exceptions.]

---

## 2. Code Complexity

### Complexity Hotspots

| File/Class | Method | Issue | Estimated Complexity | Recommendation |
|-----------|--------|-------|---------------------|----------------|
| {File path} | {Method name} | {Description of complexity} | {Very High/High/Medium} | {Specific refactoring suggestion} |

### Large Files (>500 lines)

| File | Lines | Purpose | Recommendation |
|------|-------|---------|----------------|
| {File path} | {Line count} | {What it does} | {Split suggestion or "acceptable"} |

### Method Length Distribution

[Qualitative assessment of typical method sizes and where the outliers are.]

---

## 3. Error Handling

### Strengths
- [Describe good error handling patterns found]

### Concerns

| Category | Finding | Location(s) | Severity |
|----------|---------|-------------|----------|
| {Swallowed exceptions} | {Description} | {File paths} | {High/Medium/Low} |
| {Missing validation} | {Description} | {File paths} | {High/Medium/Low} |
| {Generic catch} | {Description} | {File paths} | {High/Medium/Low} |
| {Inconsistent responses} | {Description} | {File paths} | {High/Medium/Low} |

### Error Handling Patterns by Layer

| Layer | Pattern | Assessment |
|-------|---------|-----------|
| {Controllers} | {Description} | {Good/Adequate/Concern} |
| {Service/Business} | {Description} | {Good/Adequate/Concern} |
| {Data Access} | {Description} | {Good/Adequate/Concern} |
| {Background Jobs} | {Description} | {Good/Adequate/Concern} |

---

## 4. Security Assessment (OWASP Top 10)

| OWASP Category | Status | Findings | Severity |
|---------------|--------|----------|----------|
| A01: Broken Access Control | {Pass/Concern/Fail} | {Specific findings with file references} | {Critical/High/Medium/Low} |
| A02: Cryptographic Failures | {Pass/Concern/Fail} | {Findings} | {Rating} |
| A03: Injection | {Pass/Concern/Fail} | {Findings} | {Rating} |
| A04: Insecure Design | {Pass/Concern/Fail} | {Findings} | {Rating} |
| A05: Security Misconfiguration | {Pass/Concern/Fail} | {Findings} | {Rating} |
| A06: Vulnerable Components | {Pass/Concern/Fail} | {Findings} | {Rating} |
| A07: Auth Failures | {Pass/Concern/Fail} | {Findings} | {Rating} |
| A08: Software/Data Integrity | {Pass/Concern/Fail} | {Findings} | {Rating} |
| A09: Logging/Monitoring | {Pass/Concern/Fail} | {Findings} | {Rating} |
| A10: SSRF | {Pass/Concern/Fail} | {Findings} | {Rating} |

### Critical Security Findings

[List any findings rated High or Critical with specific file references and recommended fixes.]

---

## 5. Performance Concerns

### Identified Issues

| Category | Finding | Location | Impact | Fix Effort |
|----------|---------|----------|--------|------------|
| {N+1 queries} | {Description} | {File:line} | {High/Medium/Low} | {Low/Medium/High} |
| {Unbounded results} | {Description} | {File:line} | {Impact} | {Effort} |
| {Missing indexes} | {Description} | {File:line} | {Impact} | {Effort} |
| {Synchronous I/O} | {Description} | {File:line} | {Impact} | {Effort} |
| {Memory issues} | {Description} | {File:line} | {Impact} | {Effort} |

### Caching Assessment

| Cache | TTL | Scope | Assessment |
|-------|-----|-------|-----------|
| {Cache name} | {Duration} | {Per-instance/Distributed/Global} | {Appropriate/Concern/Missing} |

---

## 6. Test Coverage

### Current State

| Test Type | Present | Framework | Coverage | Assessment |
|-----------|---------|-----------|----------|-----------|
| Unit Tests (Backend) | {Yes/No} | {Framework name or None} | {Percentage or None} | {Assessment} |
| Unit Tests (Frontend) | {Yes/No} | {Framework name or None} | {Coverage} | {Assessment} |
| Integration Tests | {Yes/No} | {Framework name or None} | {Coverage} | {Assessment} |
| E2E Tests | {Yes/No} | {Framework name or None} | {Coverage} | {Assessment} |
| Load Tests | {Yes/No} | {Framework name or None} | {Coverage} | {Assessment} |

### Recommendations for Test Strategy

[Prioritized list of where to start adding tests, based on business risk and code complexity. Focus on highest-impact areas first.]

---

## 7. Technical Debt Inventory

### Debt Items

| ID | Category | Description | Location | Severity | Effort | Business Impact |
|----|----------|-------------|----------|----------|--------|----------------|
| TD-001 | {Architecture/Design/Code/Dependencies/Config} | {Specific description} | {File or area} | {Critical/High/Medium/Low} | {Low/Medium/High/Very High} | {What this prevents or risks} |
| TD-002 | ... | ... | ... | ... | ... | ... |

### Debt by Severity

| Severity | Count | Top Concern |
|----------|-------|-------------|
| Critical | {n} | {Brief description} |
| High | {n} | {Brief description} |
| Medium | {n} | {Brief description} |
| Low | {n} | {Brief description} |

### Recommended Paydown Order

[Prioritized list with rationale. Consider: quick wins (low effort, high impact) first, then strategic items.]

---

## 8. Dependency Health

### Outdated Packages

| Package | Current Version | Latest Stable | Gap | Risk |
|---------|----------------|---------------|-----|------|
| {Package name} | {Current} | {Latest} | {How far behind} | {High/Medium/Low} |

### Beta/Pre-release Dependencies in Production

| Package | Version | Stable Alternative | Risk |
|---------|---------|-------------------|------|
| {List all beta/pre-release packages used in production code} | | | |

### Abandoned/Unmaintained Dependencies

| Package | Last Updated | Alternatives | Migration Effort |
|---------|-------------|-------------|-----------------|
| {Package no longer maintained} | {Date} | {Modern alternatives} | {Effort to migrate} |

### Known Vulnerabilities

| Package | CVE | Severity | Fix Available | Status |
|---------|-----|----------|---------------|--------|
| {List any known CVEs found via dependency analysis} | | | | |

---

## Summary: Top 10 Findings by Priority

| Rank | Finding | Category | Severity | Effort | Recommendation |
|------|---------|----------|----------|--------|----------------|
| 1 | {Most critical finding} | {Category} | {Rating} | {Effort} | {One-line fix recommendation} |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |
| 7 | | | | | |
| 8 | | | | | |
| 9 | | | | | |
| 10 | | | | | |

## Appendix: Files Reviewed

[List the key files and directories examined during this review, grouped by category, so the review can be reproduced or extended.]
```

### 6. Output
- Save the document to `personal/projects/<repo-name>/{repo-name}-code-review.md`
- Provide a summary of: overall grade, top 3 critical findings, and recommended first actions
