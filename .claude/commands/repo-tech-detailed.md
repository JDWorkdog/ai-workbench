Generate an implementation-depth technical reference for a previously analyzed repository.

**Input:** $ARGUMENTS (repository name, project path in personal/projects/, or repository path)

## Instructions

### 1. Determine Analysis Goal

**IMPORTANT: Format questions clearly - each question MUST be on its own numbered line. DO NOT combine questions into a paragraph.**

Ask the user:

1. What lens should I use for this analysis?
   A. Onboarding & knowledge transfer (emphasize setup guides, configuration walkthrough, "how to do X" recipes)
   B. Tech debt & modernization planning (emphasize schema issues, API contract problems, infrastructure gaps)
   C. Executive/stakeholder visibility (emphasize architecture diagrams, deployment topology, risk areas)
   D. All of the above (comprehensive)

### 2. Load Existing Context

- Determine the repo name from the input (extract from path or use directly)
- Look for `{repo-name}-tech-stack.md` in `personal/projects/<repo-name>/`
- Look for `{repo-name}-functional.md` in `personal/projects/<repo-name>/`
- If neither exists, inform the user to run `/repo-analysis` first and stop
- Use the tech-stack spec's sections as the starting framework
- If other deep-dive docs exist (`-features-detailed.md`, `-code-review.md`, etc.), load them for additional context

### 3. Deep Technical Exploration

Access the actual repository codebase. Go beyond the technology inventory:
- **Database** — Read SQL scripts, EF/ORM model definitions, migration files to document actual schema, relationships, and indexes
- **APIs** — Read controllers, route definitions, request/response DTOs to document actual contracts and patterns
- **Auth** — Read middleware configuration, token validation, session management to document complete flows
- **Background jobs** — Read job definitions, triggers, schedules, retry configuration, dead-letter handling
- **Caching** — Read cache implementations, TTLs, invalidation strategies, consistency patterns
- **Logging** — Read log configuration, structured logging patterns, monitoring setup, alerting rules
- **Build/Deploy** — Read CI/CD configs, Dockerfiles, deployment scripts, environment configuration files
- **Local dev** — Read README, setup scripts, required tooling, environment variables, seed data

### 4. Generate Document

Save to: `personal/projects/<repo-name>/{repo-name}-tech-detailed.md`

Structure:
```
# {Product Name} - Technical Deep Dive

> Analysis lens: {selected lens}
> Based on: {repo-name}-tech-stack.md
> Repository: {repo path}
> Generated: {date}

## How to Read This Document

This document provides implementation-level technical detail for developers working in this codebase. Each section goes beyond "what technology" to "how it's configured, what the contracts look like, and how to work with it." Code examples reference actual files in the repository.

---

## 1. Database Schema

### Database Topology

```
[ASCII diagram showing all databases, their purposes, and relationships]

Example:
┌──────────────┐    ┌─────────────────┐    ┌───────────┐
│  MasterDB    │    │  TenantDB       │    │  AnalyticsDB│
│  (global)    │    │  (per-tenant)   │    │  (reporting) │
├──────────────┤    ├─────────────────┤    ├───────────┤
│ Accounts     │───>│ Projects        │───>│ BI_Data    │
│ Users        │    │ Orders          │    └───────────┘
│ Sessions     │    │ Clients         │
└──────────────┘    └─────────────────┘
```

### Core Tables by Domain

For each major domain area, document the actual table structure discovered in the codebase.

#### {Domain: e.g., Sales}

| Table | Key Columns | Indexes | Notes |
|-------|-------------|---------|-------|
| {Table name} | {Column names with types, PK/FK markers} | {Index names} | {Soft delete, auditing, etc.} |

[Repeat for each domain area: Projects, Orders, Service, Catalog, Payments, etc.]

### Multi-Tenancy / Sharding Implementation (if applicable)

- **Tenant isolation strategy** — {How tenants are separated: shared DB, schema-per-tenant, DB-per-tenant, sharding}
- **Connection routing** — {How the application determines which database to connect to}
- **Cross-tenant queries** — {How/whether cross-tenant queries are handled}
- **Provisioning** — {How new tenants/shards are created}

### Schema Change Process

- **Script/migration location** — {Path in repo}
- **Naming convention** — {How scripts are named}
- **Application method** — {Manual, automated, EF migrations, Flyway, etc.}
- **Rollback strategy** — {How failed schema changes are reversed}
- **Multi-environment deployment** — {How schema changes propagate across environments}

---

## 2. API Contracts

### API Inventory

| API Service | Base URL Pattern | Auth Method | Docs Location | Primary Entities |
|-------------|-----------------|-------------|---------------|-----------------|
| {Service name} | {URL pattern} | {JWT/API Key/Basic/Session} | {Swagger path or N/A} | {Main entities served} |

### Common Request/Response Patterns

#### Request Headers
```
[Document the standard headers required across all APIs]
Authorization: Bearer <jwt_token>
Content-Type: application/json
[Any custom headers]
```

#### Response Envelope
```json
[Document the standard response shape]
{
  "success": true,
  "data": { ... },
  "message": "string"
}
```

#### Pagination Pattern
```
[Document how list endpoints handle pagination - query params, response shape]
```

### Key Endpoint Contracts (by domain)

For each major domain, document 3-5 key endpoints with full request/response examples:

#### {Domain: e.g., Orders}

**List {Entities}**
```
GET /api/v1/{entity}/list
Query: ?pageIndex=0&pageSize=25&{common filters}
Response 200: { items: [...], totalCount: n }
Response 401: { message: "Unauthorized" }
```

**Get {Entity} by ID**
```
GET /api/v1/{entity}/{id}
Response 200: { full entity shape }
Response 404: { message: "Not found" }
```

**Create {Entity}**
```
POST /api/v1/{entity}/create
Body: { required fields }
Response 200: { created entity }
Response 400: { validation errors }
```

[Repeat for each major domain]

### Error Response Codes

| HTTP Status | Exception/Error Type | When It Occurs | Response Body |
|-------------|---------------------|----------------|---------------|
| 400 | {Validation failure} | {Invalid input} | {Error shape} |
| 401 | {Auth failure} | {Invalid/expired token} | {Error shape} |
| 403 | {Authorization failure} | {Insufficient permissions} | {Error shape} |
| 404 | {Not found} | {Entity doesn't exist} | {Error shape} |
| 409 | {Conflict} | {Business rule violation} | {Error shape} |
| 429 | {Rate limit} | {Too many requests} | {Error shape} |
| 500 | {Server error} | {Unhandled exception} | {Error shape} |

---

## 3. Authentication & Authorization Flows

### Authentication Flow Diagram

```
[ASCII sequence diagram for the primary auth flow]

User/Client          Frontend App          Identity Provider          API Service
     │                    │                      │                        │
     │──Login────────────>│                      │                        │
     │                    │──Auth Request────────>│                        │
     │<──────────────────────Login Page───────────│                        │
     │──Credentials───────────────────────────────>│                        │
     │<──────────────────────Token────────────────│                        │
     │                    │<──Token───────────────│                        │
     │                    │──API Call + Token─────────────────────────────>│
     │                    │                      │      Validate Token    │
     │                    │                      │      Check Permissions │
     │                    │<──Response────────────────────────────────────│
```

### Token Structure

| Claim/Field | Purpose | Example Value |
|------------|---------|---------------|
| {List all relevant claims in JWT or session tokens} | | |

### Permission System

| Permission ID/Name | Description | Typical Roles |
|-------------------|-------------|---------------|
| {List all permissions discovered in the codebase} | | |

### Session Management
- **Session creation** — {When and how sessions are created}
- **Session storage** — {Where sessions are stored}
- **Session expiry** — {TTL and renewal behavior}
- **Rate limiting** — {Limits per session/user/IP}
- **Concurrent sessions** — {Multiple sessions per user allowed?}

---

## 4. Background Processing

### Job Inventory

| Job/Worker | Trigger Type | Schedule/Queue | Singleton | Purpose |
|-----------|-------------|----------------|-----------|---------|
| {Job name} | {Timer/Queue/Event/Manual} | {Cron expression or queue name} | {Yes/No} | {What it does} |

### Job Details

For each significant background job:

#### {Job Name}

- **Trigger**: {Timer schedule, queue name, or event}
- **Entry point**: {File path and method name}
- **Input**: {What data it receives or processes}
- **Processing logic**: {Step-by-step description}
- **Output/Side effects**: {What changes when this job runs}
- **Error handling**: {Retry? Email? Dead letter? Silent fail?}
- **Retry policy**: {Count, backoff strategy, max delay}
- **Idempotency**: {Safe to re-run? How is idempotency ensured?}
- **Dependencies**: {External services, databases, APIs required}

### Message Bus Configuration (if applicable)

- **Service**: {Azure Service Bus / RabbitMQ / Kafka / etc.}
- **Queues**: {List all queues with purpose}
- **Topics/Exchanges**: {List with subscribers}
- **Dead letter policy**: {How failed messages are handled}
- **Message format**: {Typical message schema}

---

## 5. Caching Strategy

### Cache Implementations

| Cache | Type | Scope | TTL | Invalidation | Purpose |
|-------|------|-------|-----|-------------|---------|
| {Cache name} | {In-memory/Redis/CDN} | {Per-instance/Distributed/Global} | {Duration} | {How invalidated} | {What it caches} |

### Cache Consistency Concerns

[Document scenarios where cache staleness could cause problems. Example: "Permission changes take up to {TTL} to propagate across instances."]

---

## 6. Logging & Observability

### Logging Architecture

| Component | Log Destination | Format | Level |
|-----------|----------------|--------|-------|
| {Component name} | {File/DB/Cloud service} | {Structured/Unstructured} | {Error/Warn/Info/Debug} |

### Log Schema

| Field | Type | Purpose |
|-------|------|---------|
| {List fields in the standard log entry} | | |

### Monitoring & Alerting

| What's Monitored | Tool | Alerting | Assessment |
|-----------------|------|----------|-----------|
| {Metric or event} | {Tool name} | {How alerts are sent} | {Adequate/Gap} |

### Monitoring Gaps

[What questions cannot be answered with current observability?]
- "What is the p99 latency of {API}?" — {Can/Cannot answer}
- "How many errors occurred in the last hour?" — {Can/Cannot answer}
- "Which tenant is causing the most load?" — {Can/Cannot answer}

---

## 7. Build & Deployment Pipeline

### Build Configuration

| Component | Build Tool | Config File | Output | Notes |
|-----------|-----------|-------------|--------|-------|
| {Component name} | {Build tool} | {Config file path} | {Artifact type} | {Special considerations} |

### Deployment Topology

```
[ASCII diagram showing where components are deployed]

Cloud Provider / Infrastructure
├── Compute
│   ├── {API services}
│   ├── {Frontend apps}
│   └── {Background workers}
├── Data
│   ├── {Databases}
│   ├── {Cache}
│   └── {File storage}
├── Messaging
│   └── {Message bus}
└── Identity
    └── {Auth provider}
```

### Environment Configuration

| Environment | Purpose | Key Differences from Production |
|-------------|---------|-------------------------------|
| {Dev} | {Development} | {Key differences} |
| {Staging} | {Pre-production} | {Key differences} |
| {Production} | {Live} | {Baseline} |

### CI/CD Pipeline

[Document whatever CI/CD configuration exists in the repo. If none exists, note that explicitly.]

- **Pipeline tool**: {Name or "Not found in repo"}
- **Build triggers**: {On push, on PR, manual, etc.}
- **Stages**: {Build -> Test -> Deploy sequence}
- **Deployment method**: {Blue-green, rolling, direct, etc.}
- **Rollback strategy**: {How to revert a bad deployment}

---

## 8. Local Development Setup

### Prerequisites

| Tool | Version | Purpose | Install Command |
|------|---------|---------|----------------|
| {Tool name} | {Required version} | {Why it's needed} | {How to install} |

### Setup Steps

1. **Clone**: {Clone command}
2. **Configuration**: {What config files need to be created/modified, what secrets are needed}
3. **Database**: {How to set up local databases, run migrations/scripts, seed data}
4. **Build**: {How to build the project}
5. **Run**: {How to run the application locally}
6. **Verify**: {How to confirm everything is working}

### Common Development Tasks

| Task | Command/Steps |
|------|--------------|
| {Run a single service} | {Exact command} |
| {Run frontend dev server} | {Exact command} |
| {Apply schema changes} | {Steps to update local DB} |
| {Add a new endpoint} | {Steps following established pattern} |
| {Run tests} | {Test command} |

---

## Appendix: Configuration Key Reference

[Complete listing of all configuration keys found in the codebase]

| Key | Category | Description | Example Value |
|-----|----------|-------------|---------------|
| {Config key} | {Auth/DB/Cache/Integration/Feature} | {What it controls} | {Example (redact secrets)} |
```

### 5. Output
- Save the document to `personal/projects/<repo-name>/{repo-name}-tech-detailed.md`
- Provide a summary of: key technical findings, any areas that couldn't be fully documented (e.g., secrets, external configs), and recommended follow-up
