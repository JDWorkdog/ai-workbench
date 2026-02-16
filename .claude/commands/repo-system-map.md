Generate a cross-repository system map showing how multiple repositories form one integrated platform.

**Input:** $ARGUMENTS (optional: comma-separated list of project names in personal/projects/, or "all" to use all analyzed repos)

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

- Scan `personal/projects/` for all analyzed repositories
- For each repo found, load available analysis docs:
  - `{repo-name}-functional.md` (required — skip repos without this)
  - `{repo-name}-tech-stack.md` (required — skip repos without this)
  - `{repo-name}-features-detailed.md` (optional, enriches analysis)
  - `{repo-name}-code-review.md` (optional, enriches analysis)
  - `{repo-name}-tech-detailed.md` (optional, enriches analysis)
  - `{repo-name}-arch-review.md` (optional, enriches analysis)
- If $ARGUMENTS specifies specific repos, filter to only those
- If fewer than 2 repos have been analyzed, inform the user to analyze more repos first and stop
- List the repos found and confirm with the user before proceeding

### 3. Cross-Repo Analysis Phase

Synthesize across all loaded repo analyses to identify:
- **Shared technologies and version discrepancies** across repos
- **Shared infrastructure** (databases, auth providers, message buses, storage)
- **API producer/consumer relationships** between repos
- **Data flow paths** across system boundaries
- **Deployment dependencies and sequencing** requirements
- **Cross-repo feature overlap and redundancy**
- **Shared codebases** (common libraries, packages, compiled binaries)

If repository source code is accessible, explore the actual codebases to validate and deepen the analysis beyond what the docs capture.

### 4. Generate Document

Save to: `personal/projects/system-map.md` (top-level, not inside any single repo folder)

Structure:
```
# {Platform Name} - Cross-Repository System Map

> Analysis lens: {selected lens}
> Repositories analyzed: {list of repo names}
> Generated: {date}
> Scope: Multi-repository system architecture

## Executive Summary

[5-7 sentences describing the system as a whole. What is this platform? How many repositories compose it? What are the major architectural boundaries? What are the top 3 cross-repo risks? What is the overall system health assessment?]

---

## 1. System Context

### What the Platform Looks Like from Outside

```
[C4 System Context-level ASCII diagram showing the platform, its users, and external systems]

                    ┌────────────────────┐
                    │   Primary Users    │
                    └────────┬───────────┘
                             │
                    ┌────────v───────────┐
                    │                    │
                    │   {Platform Name}  │
                    │                    │         ┌──────────────┐
                    │  [Repo A]          │────────>│ External     │
                    │  [Repo B]          │         │ Service A    │
                    │  [Repo C]          │         └──────────────┘
                    │  ...               │
                    │                    │         ┌──────────────┐
                    └────────┬───────────┘────────>│ External     │
                             │                     │ Service B    │
                    ┌────────v───────────┐         └──────────────┘
                    │  Secondary Users   │
                    └────────────────────┘
```

### System Actors

| Actor | Role | Primary Repos | Access Method |
|-------|------|---------------|---------------|
| {User type} | {What they do} | {Which repos they interact with} | {Web/Mobile/API/Desktop} |

---

## 2. Repository Map & Relationships

### Repository Overview

| Repository | Type | Primary Purpose | Tech Stack Summary |
|-----------|------|----------------|-------------------|
| {Repo name} | {Backend/Frontend/Mobile/AI/Integration/etc.} | {One-sentence purpose} | {Key technologies} |

### Repository Relationship Diagram

```
[ASCII diagram showing how repos connect to each other]

┌─────────────────────────────────────────────────┐
│                  Infrastructure                  │
│  (Databases, Auth, Storage, Message Bus, etc.)  │
└───────────────────────┬─────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────v────┐    ┌─────v─────┐   ┌────v────┐
   │Backend  │    │Backend    │   │ AI/ML   │
   │Repo A   │<──>│Repo B     │   │ Repo    │
   └────┬────┘    └───────────┘   └────┬────┘
        │                              │
   ┌────┼──────────┬──────────┐       │
   │    │          │          │       │
┌──v──┐┌v────────┐┌v────────┐│  ┌───v────┐
│Web  ││Portal   ││Mobile   ││  │AI UI   │
│App  ││App      ││App      ││  │        │
└─────┘└─────────┘└─────────┘│  └────────┘
                              │
                         ┌────v────┐
                         │Desktop  │
                         │Integr.  │
                         └─────────┘
```

### Relationship Details

| From Repo | To Repo | Relationship | Interface | Notes |
|-----------|---------|-------------|-----------|-------|
| {Consumer repo} | {Provider repo} | {API consumer/Shared DB/Shared library/Event-driven} | {REST/gRPC/DB/Queue} | {Key details} |

---

## 3. Data Flow Map

### Primary Data Flows

For each major business workflow, trace how data moves across repository boundaries.

#### Flow 1: {Workflow Name}

```
[ASCII diagram tracing data path across repos]

{Repo A} (User action)
    │
    │ API call
    v
{Repo B} (Processes and persists)
    │
    │ Event or query
    v
{Repo C} (Reads and transforms)
    │
    v
Output / User
```

[Repeat for 3-5 major cross-repo workflows]

### Data Ownership Map

| Data Domain | Source of Truth (Repo/DB) | Consumers | Sync Mechanism | Freshness |
|------------|--------------------------|-----------|---------------|-----------|
| {Data domain} | {Which repo/DB owns this data} | {Who reads it} | {Direct API/Sync job/Event/Shared DB} | {Real-time/Near-real-time/Batch} |

---

## 4. Shared Infrastructure

### Shared Services

| Service | Used By | Configuration | Risk |
|---------|---------|---------------|------|
| {Infrastructure service} | {List of repos} | {Shared or isolated config} | {Outage impact} |

### Shared Libraries & Code

| Library/Package | Used By Repos | Version Consistency | Notes |
|----------------|---------------|--------------------|----|
| {Shared library} | {List of repos} | {Same version/Different versions} | {Risk assessment} |

### Technology Version Matrix

| Technology | {Repo A} | {Repo B} | {Repo C} | {Repo D} | ... |
|-----------|----------|----------|----------|----------|-----|
| {Language/Framework} | {Version} | {Version} | {N/A} | {Version} | |
| {UI Framework} | {N/A} | {Version} | {N/A} | {Version} | |
| {Auth Library} | {Version} | {Version} | {Version} | {Version} | |
| {Database ORM} | {Version} | {N/A} | {Version} | {N/A} | |

---

## 5. Deployment Topology

### System Deployment Diagram

```
[ASCII diagram showing how ALL repos deploy to infrastructure]

Cloud Provider
├── Compute
│   ├── {Backend services from Repo A}
│   ├── {Frontend apps from Repo B}
│   ├── {Background workers from Repo A}
│   ├── {AI services from Repo C}
│   └── {Portal apps from Repo D}
├── Data
│   ├── {Databases (which repos use which)}
│   ├── {Cache services}
│   └── {File/blob storage}
├── Messaging
│   └── {Message bus / queues}
└── Identity
    └── {Auth providers}

On-Premise (if applicable)
├── {Desktop applications}
└── {Connectors/bridges}
```

### Deployment Dependencies

| Component | Depends On | Deployment Order | Notes |
|-----------|-----------|-----------------|-------|
| {Component from Repo X} | {What must be running first} | {Sequence position} | {Why this order matters} |

### Deployment Risk Matrix

| Scenario | Impact | Affected Repos | Mitigation |
|---------|--------|---------------|------------|
| {Schema change to shared tables} | {What breaks} | {Which repos} | {How to deploy safely} |
| {Auth provider config change} | {What breaks} | {Which repos} | {How to deploy safely} |
| {API contract change} | {What breaks} | {Which repos} | {How to deploy safely} |
| {Shared library/config update} | {What breaks} | {Which repos} | {How to deploy safely} |

---

## 6. Cross-Repo Dependency Risks

### Critical Dependencies

| Dependency | From | To | Failure Impact | Current Mitigation | Risk Level |
|-----------|------|-----|---------------|-------------------|------------|
| {Critical shared dependency} | {Consuming repos} | {Provider} | {What happens on failure} | {Current protection} | {Critical/High/Medium/Low} |

### Version Drift Analysis

| Technology | Repos with Oldest Version | Repos with Newest Version | Gap Size | Risk |
|-----------|--------------------------|--------------------------|----------|------|
| {Technology} | {Repo (version)} | {Repo (version)} | {How many versions apart} | {Security/compatibility risk} |

### Feature Overlap & Redundancy

| Feature/Capability | Implemented In | Duplication Risk | Recommendation |
|-------------------|---------------|-----------------|----------------|
| {Duplicated capability} | {List of repos implementing it} | {High/Medium/Low} | {Share, consolidate, or acceptable} |

### Cross-Repo Change Impact Matrix

| If You Change... | You Must Also Update... | Risk of Missing |
|-----------------|----------------------|-----------------|
| {A database schema in Repo A} | {Repos B, C that query those tables} | {High/Medium/Low} |
| {An API contract in Repo A} | {All consumer repos} | {Risk level} |
| {Auth configuration} | {All repos using that auth provider} | {Risk level} |
| {A shared library} | {All repos consuming that library} | {Risk level} |

---

## 7. System Health Summary

### Overall System Assessment

| Dimension | Rating | Key Finding |
|-----------|--------|------------|
| {System Cohesion} | {High/Medium/Low} | {How well repos form a unified system} |
| {Deployment Independence} | {Rating} | {Can repos be deployed independently?} |
| {Technology Consistency} | {Rating} | {How aligned are technology choices?} |
| {Data Integrity} | {Rating} | {How clean are data ownership boundaries?} |
| {Operational Visibility} | {Rating} | {Can you monitor the system end-to-end?} |
| {Change Safety} | {Rating} | {How safe is it to change one repo?} |

### Top 5 System-Level Risks

| # | Risk | Likelihood | Impact | Affected Repos | Mitigation |
|---|------|-----------|--------|---------------|------------|
| 1 | {Highest priority risk} | {High/Medium/Low} | {Critical/High/Medium} | {Repos} | {Recommended action} |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

### Recommended System-Level Initiatives

| Initiative | Scope | Effort | Impact | Priority |
|-----------|-------|--------|--------|----------|
| {Cross-cutting improvement} | {Which repos affected} | {Time estimate} | {What it enables} | {Critical/High/Medium} |
```

### 5. Output
- Save the document to `personal/projects/system-map.md`
- Provide a summary of: number of repos mapped, top 3 system-level risks, and most important cross-repo initiative
