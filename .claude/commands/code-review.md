Perform a deep, line-by-line code review producing a comprehensive report with numbered findings, actual code snippets, severity ratings, and prioritized remediation recommendations.

**Input:** $ARGUMENTS (repository path, directory path, feature description, or scope to review)

## Instructions

### 1. Determine Review Scope

**IMPORTANT: Format questions clearly - each question MUST be on its own numbered line. DO NOT combine questions into a paragraph.**

Ask the user:

1. What is the scope of this review?
   A. Entire repository
   B. Specific feature or module (I'll describe which one)
   C. Specific directory or set of files
   D. Changes in a PR or branch diff

2. What should this review prioritize?
   A. Security vulnerabilities and data safety
   B. Bugs, defects, and correctness issues
   C. Architecture, design, and code quality
   D. Comprehensive - all of the above (recommended)

Wait for the user's answers before proceeding. The user can respond with shorthand like "1B, 2D".

### 2. Load Existing Context (if available)

- If reviewing a repo that has been previously analyzed with `/repo-analysis`, look for existing docs in `personal/projects/<repo-name>/` and load them for context
- If no prior analysis exists, that's fine — this command works standalone
- If the user specified a feature or module scope, identify the relevant source files before starting

### 3. Inventory Phase

Before reviewing any code, catalog the scope:

- **List every source file** in scope with approximate line count and purpose
- **Identify the technology stack** (languages, frameworks, databases, external services)
- **Map the architecture** — tiers, layers, or major components and how they connect
- **Note configuration files** that may contain secrets or important settings

This inventory becomes the "Codebase Inventory" section of the report and ensures no files are missed during review.

### 4. Deep Review Phase

Perform a **line-by-line review** of every file in the inventory. This is the core of the command — be thorough and specific. For each file, examine all of the following areas (filtered by the user's priority choice from Step 1):

#### Security (SEC-nn findings)
- Hardcoded credentials, API keys, connection strings, passwords in source
- SQL injection (string interpolation in queries vs. parameterized queries)
- XSS, command injection, path traversal
- Authentication/authorization gaps (unauthenticated endpoints, missing role checks)
- Cross-tenant data leakage in multi-tenant systems
- Overly permissive access (anonymous endpoints, broad CORS, open functions)
- Insecure deserialization, arbitrary code execution paths
- Secrets in configuration files committed to source control

#### Bugs & Defects (BUG-nn findings)
- Logic errors, off-by-one, copy-paste mistakes (wrong variable names, wrong constants)
- Null reference risks and unchecked return values
- Resource leaks (database connections, streams, readers not properly closed/disposed)
- Race conditions in concurrent or async code
- Return type mismatches between declaration and actual returns
- Dead code disguised as functional (stubs returning hardcoded data, mock responses in production)
- Incorrect calculations or misleading variable names (e.g., variable named "average" but computes max)
- Deprecated API usage that will break at runtime

#### Architecture & Design (ARCH-nn findings)
- God classes/controllers (500+ lines handling multiple unrelated responsibilities)
- Anti-patterns (static class abuse limiting testability, service locator, hidden dependencies)
- Significant code duplication (same logic block copied across 3+ locations)
- Testability barriers (no interfaces, no dependency injection, tightly coupled)
- Scalability concerns (in-memory state that won't work in multi-instance deployments)
- Missing resilience patterns (no retry logic, no circuit breaker for external calls)
- Inconsistent patterns across the codebase (different approaches to the same problem)
- Disconnected or duplicate implementations that should be consolidated

#### Code Quality (CQ-nn findings)
- Error handling inconsistencies (swallowed exceptions, lost stack traces, mixed patterns)
- Logging gaps (Console.WriteLine in production, no structured logging)
- Naming issues and typos in public APIs, routes, or user-facing strings
- Dependency anti-patterns (creating new HttpClient per request, mixed serializer libraries)
- Dead/commented-out code (large blocks that should be deleted, not commented)
- Missing input validation at system boundaries
- Dynamic typing where strong typing would prevent bugs

### 5. Finding Format

Every finding MUST follow this format:

```
### {CATEGORY}-{NN}: {Descriptive Title} [{SEVERITY}]

**Impact:** {One sentence describing the real-world consequence of this issue.}

**File(s):** `{filename}` line(s) {NN-NN}

{Description of the problem with context about why it matters.}

**Problematic code:**
```{language}
// {filename} line {NN}
{Actual code snippet showing the problem — include enough context to understand}
```

{If there's a correct example elsewhere in the codebase, show it as contrast:}
**Correct approach (found in {other file}):**
```{language}
{Code showing the right way}
```

**Recommendation:** {Specific, actionable fix. Not generic advice — tell the developer exactly what to change.}
```

Severity levels:
- **CRITICAL** — Security vulnerability or data loss risk requiring immediate remediation
- **HIGH** — Bug producing incorrect results, runtime failures, or significant risk
- **MEDIUM** — Architecture/design issues affecting maintainability or scalability
- **LOW** — Code quality, style, naming, or best practice violations

### 6. Component Grading

After reviewing all files, grade each major component or module separately:

```
### {Component Name} (Grade: {A/B/C/D/F}{+/-})

**Strengths:**
- {List genuine strengths — good patterns, clean APIs, proper validation}

**Weaknesses:**
- {List specific weaknesses with cross-references to finding IDs}
```

Use +/- modifiers for nuance (e.g., B+ is better than B, D+ is slightly better than D).

### 7. Generate Report

**Save location:**
- If project context is active: `personal/projects/<project-name>/<scope-name>-code-review.md`
- Otherwise: `personal/projects/<repo-or-scope-name>/<scope-name>-code-review.md`

**Filename guidance:** Use the most specific scope name. Examples:
- Whole repo "DTCloud" → `DTCloud-code-review.md`
- Feature 10 of DTCloud → `DTCloud-feature10-ai-code-review.md`
- Specific module → `payment-module-code-review.md`

**Document structure:**

```
# {Scope Name}: {Descriptive Title} - Deep Dive Code Review

**Date:** {YYYY-MM-DD}
**Scope:** {Description of exactly what was reviewed}
**Methodology:** Line-by-line review of all source files within scope

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Codebase Inventory](#codebase-inventory)
4. [Critical Security Findings](#critical-security-findings)
5. [Bugs & Defects](#bugs--defects)
6. [Architecture & Design Issues](#architecture--design-issues)
7. [Code Quality Issues](#code-quality-issues)
8. [Component-by-Component Review](#component-by-component-review)
9. [Recommendations](#recommendations)
10. [Priority Action Items](#priority-action-items)

---

## Executive Summary

{2-3 paragraph summary covering: what was reviewed, overall assessment, key statistics (X critical, Y high, Z medium findings), and the single most important takeaway.}

### Severity Summary

| Severity | Count | Category |
|----------|-------|----------|
| **CRITICAL** | {n} | {Brief description of what these cover} |
| **HIGH** | {n} | {Brief description} |
| **MEDIUM** | {n} | {Brief description} |
| **LOW** | {n} | {Brief description} |

---

## Architecture Overview

{Describe the system architecture BEFORE diving into findings. The reader needs context to understand the issues. Include:}

### {Tier/Layer 1 Name}
- {Component list with brief descriptions}

### {Tier/Layer 2 Name}
- {Component list}

### Technology Stack
- **{Category}:** {Technologies used}
{Repeat for each relevant technology category}

---

## Codebase Inventory

### Source Files Reviewed

| # | File | Location | Lines | Purpose |
|---|------|----------|-------|---------|
| 1 | `{filename}` | {path} | {n} | {one-line purpose} |
| 2 | `{filename}` | {path} | {n} | {one-line purpose} |
{Continue for all files reviewed}

---

## Critical Security Findings

{List all SEC-nn findings with CRITICAL or HIGH severity, using the finding format from Step 5. Include code snippets and specific file:line references.}

### SEC-01: {Title} [{SEVERITY}]
{Full finding format...}

---

### SEC-02: {Title} [{SEVERITY}]
{Full finding format...}

---

{Continue for all security findings}

---

## Bugs & Defects

{List all BUG-nn findings, using the finding format from Step 5.}

### BUG-01: {Title} [{SEVERITY}]
{Full finding format...}

---

{Continue for all bug findings}

---

## Architecture & Design Issues

{List all ARCH-nn findings, using the finding format from Step 5.}

### ARCH-01: {Title} [{SEVERITY}]
{Full finding format...}

---

{Continue for all architecture findings}

---

## Code Quality Issues

{List all CQ-nn findings, using the finding format from Step 5.}

### CQ-01: {Title} [{SEVERITY}]
{Full finding format...}

---

{Continue for all code quality findings}

---

## Component-by-Component Review

{Grade each major component separately using the format from Step 6.}

### {Component 1 Name} (Grade: {letter})

**Strengths:**
- {Genuine strength}

**Weaknesses:**
- {Weakness with finding cross-reference, e.g., "SQL injection vulnerabilities (SEC-02)"}

---

### {Component 2 Name} (Grade: {letter})
{Continue for all components...}

---

## Recommendations

### Immediate Actions (Week 1)

1. {Highest priority action — directly addresses a CRITICAL finding}
2. {Next priority}
{Continue...}

### Short-Term (Month 1)

{Numbered list of actions addressing HIGH findings and key architectural issues}

### Medium-Term (Quarter)

{Numbered list of actions addressing MEDIUM findings and longer-term improvements}

---

## Priority Action Items

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| P0 | {Action} | {Time estimate} | {What this prevents or enables} |
| P0 | {Action} | {Time estimate} | {Impact} |
| P1 | {Action} | {Time estimate} | {Impact} |
| P1 | {Action} | {Time estimate} | {Impact} |
| P2 | {Action} | {Time estimate} | {Impact} |
| P2 | {Action} | {Time estimate} | {Impact} |
| P3 | {Action} | {Time estimate} | {Impact} |
| P3 | {Action} | {Time estimate} | {Impact} |

Priority scale: P0 = Do today, P1 = This sprint, P2 = This month, P3 = This quarter

---

*This review was conducted on {date} against the current state of the codebase. All line numbers reference the code as read during this review session.*
```

### 8. Output

- Save the document to the path determined in Step 7
- Provide a concise summary to the user including:
  - Overall assessment (1-2 sentences)
  - Finding counts by severity
  - Top 3 most critical findings
  - Recommended first action
- Offer to discuss specific findings or dive deeper into any area
