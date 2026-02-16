# Plan: Repo Deep-Dive Slash Commands

## Context

The workspace has `/repo-analysis` which generates two documents per repo: a functional spec (`-functional.md`) and tech-stack spec (`-tech-stack.md`). These are excellent inventory-level docs across 7 analyzed repos (DTCloud, DTCloudAI, DTCloudApp, DTCloudMobile, DTCloudSource, DTPartnerApp, DTSI).

The user wants to go deeper with additional document types. Each should be a reusable slash command that can run in its own session to avoid context window issues. Each command should ask about the analysis lens (onboarding, tech debt, exec visibility, or all) at runtime.

## What We're Creating

**5 new command files** in `.claude/commands/` + **CLAUDE.md update**:

| # | Command File | Slash Command | Output File | Purpose |
|---|-------------|---------------|-------------|---------|
| 1 | `repo-features.md` | `/repo-features` | `{name}-features-detailed.md` | Feature-by-feature deep dive (extends functional spec) |
| 2 | `repo-code-review.md` | `/repo-code-review` | `{name}-code-review.md` | Repo-wide code quality assessment |
| 3 | `repo-tech-detailed.md` | `/repo-tech-detailed` | `{name}-tech-detailed.md` | Implementation-depth technical reference (extends tech spec) |
| 4 | `repo-arch-review.md` | `/repo-arch-review` | `{name}-arch-review.md` | Evaluative architecture fitness assessment |
| 5 | `repo-system-map.md` | `/repo-system-map` | `system-map.md` | Cross-repo system map (one doc, not per-repo) |

All per-repo output goes to `personal/projects/<repo-name>/`. System map goes to `personal/projects/`.

## Command Design (Shared Pattern)

Every command follows the established pattern from `repo-analysis.md`:
- **Line 1**: One-sentence description
- **Input**: `$ARGUMENTS` (repo path or project name)
- **Step 1**: Ask lens question (A. Onboarding, B. Tech debt, C. Exec visibility, D. All)
- **Step 2**: Load existing docs from `personal/projects/<repo-name>/` as context; error if `/repo-analysis` hasn't been run
- **Step 3**: Deep exploration of actual codebase
- **Step 4**: Generate document using defined template
- **Step 5**: Save output and provide summary

## Document Templates (Key Sections)

### 1. `/repo-features` — Feature Deep Dive
For EACH feature in the functional spec, expand into:
- **Business Rules & Validation** — Table of rules with enforcement points and violation behavior
- **Data Model** — Entities, tables, key fields, relationships (ASCII diagrams)
- **State Lifecycle** — Status transitions with ASCII state diagrams, transition rules table
- **Permission Model** — Actions, required permissions, role summary
- **Integration Touchpoints** — Direction, trigger, data exchanged per integration
- **Edge Cases & Error Scenarios** — Scenario, current behavior, severity
- **Feature Dependencies** — What this feature depends on and what depends on it

Plus cross-feature sections:
- Dependency matrix (features vs features)
- Shared services table
- Feature maturity assessment scorecard

### 2. `/repo-code-review` — Code Quality Review
- **Executive Summary** with overall grade (A-F)
- **Code Health Scorecard** — 8 dimensions graded A-F
- **Pattern Consistency** — Established patterns table + violation inventory
- **Code Complexity** — Hotspots with file/method/issue/recommendation
- **Error Handling** — Strengths + concerns table by category
- **Security Assessment** — OWASP Top 10 checklist with pass/concern/fail per category
- **Performance Concerns** — Issues with category/location/impact/fix effort
- **Test Coverage** — Current state by test type + recommendations
- **Technical Debt Inventory** — Items with ID, severity, effort, business impact
- **Dependency Health** — Outdated packages, beta deps in prod, CVEs
- **Top 10 Findings** — Prioritized summary table

### 3. `/repo-tech-detailed` — Tech Stack Deep Dive
- **Database Schema** — Topology diagram, core tables by domain, sharding implementation, schema change process
- **API Contracts** — Inventory table, common patterns (headers, pagination, errors), key endpoint contracts with request/response examples
- **Authentication Flows** — Sequence diagram, token structure, permission system, session management
- **Background Processing** — Job inventory table, per-job detail (trigger, logic, retry, idempotency), message bus config
- **Caching Strategy** — Implementations table with type/scope/TTL/invalidation, consistency concerns
- **Logging & Observability** — Architecture table, log schema, monitoring gaps
- **Build & Deployment** — Build config table, deployment topology diagram, environment config, CI/CD pipeline
- **Local Development Setup** — Prerequisites, step-by-step setup, common tasks
- **Configuration Key Reference** — Complete key listing

### 4. `/repo-arch-review` — Architecture Review
- **Executive Summary** with overall fitness verdict
- **Architecture Fitness Scorecard** — 10 dimensions graded A-F with trend indicators
- **10 Assessment Sections** (each with current state, strengths, concerns, evidence, verdict):
  1. Separation of Concerns
  2. Coupling & Cohesion
  3. Scalability
  4. Resilience & Fault Tolerance
  5. Security Architecture
  6. Data Architecture
  7. API Design Maturity
  8. Observability
  9. DevOps Maturity
  10. Evolvability
- **Prioritized Recommendations** — Matrix with impact/effort/risk-if-ignored
- **Quick Wins** vs **Strategic Initiatives** vs **Not Recommended**
- **Architecture Characteristics Radar** (text-based)

### 5. `/repo-system-map` — Cross-Repo System Map
- **System Context** — C4-style ASCII diagram showing platform from outside
- **Repository Map** — Overview table + ASCII relationship diagram + relationship details
- **Data Flow Map** — Per-workflow data traces across repos, data ownership map
- **Shared Infrastructure** — Services, libraries, technology version matrix across all repos
- **Deployment Topology** — Full system deployment diagram, dependency order, risk matrix
- **Cross-Repo Risks** — Critical dependencies, version drift, feature overlap, change impact matrix
- **System Health Summary** — Overall ratings + top 5 risks + recommended initiatives

## Implementation Order

1. `repo-features.md` — Create command file with full template
2. `repo-code-review.md` — Create command file with full template
3. `repo-tech-detailed.md` — Create command file with full template
4. `repo-arch-review.md` — Create command file with full template
5. `repo-system-map.md` — Create command file with full template
6. Update `.claude/CLAUDE.md` — Add 5 new commands to the command table

## Files to Modify

| File | Action |
|------|--------|
| `.claude/commands/repo-features.md` | **Create** |
| `.claude/commands/repo-code-review.md` | **Create** |
| `.claude/commands/repo-tech-detailed.md` | **Create** |
| `.claude/commands/repo-arch-review.md` | **Create** |
| `.claude/commands/repo-system-map.md` | **Create** |
| `.claude/CLAUDE.md` | **Edit** — Add commands to table |

Reference files (read-only):
- `.claude/commands/repo-analysis.md` — Pattern to follow for command structure
- `personal/projects/DTCloud/DTCloud-functional.md` — Reference for feature listing format
- `personal/projects/DTCloud/DTCloud-tech-stack.md` — Reference for tech detail format

## Verification

After creating all commands:
1. Run `ls .claude/commands/repo-*.md` to confirm all 5 files exist
2. Read each file to verify proper structure (first-line description, Input, Instructions, template)
3. Read `.claude/CLAUDE.md` to confirm the command table includes all 5 new entries
4. The user can then test by running `/repo-features DTCloud` (or similar) in a new session
