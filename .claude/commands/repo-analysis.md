Analyze a repository and generate comprehensive documentation.

**Input:** $ARGUMENTS (repository path or GitHub URL)

## Planning Phase

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

## Instructions

### 1. Determine Input Type
- If input starts with `http` or `git@`, treat as remote GitHub repository
- Otherwise, treat as local path

### 2. Access the Repository
- **Remote:** Clone to a temporary location or use `gh` CLI to explore
- **Local:** Navigate to the specified path

### 3. Exploration Phase
Thoroughly explore the codebase:
- Read README, CONTRIBUTING, and documentation files
- Examine package.json, requirements.txt, Cargo.toml, go.mod, or equivalent dependency files
- Review directory structure and architecture
- Analyze key source files to understand patterns
- Check configuration files (Docker, CI/CD, infrastructure)
- Look at tests to understand expected behavior

### 4. Generate Two Documents

#### Document 1: Functional Overview
Save to: `{repo-name}-functional.md`

Structure:
```
# {Product Name} - Functional Overview

## Executive Summary
[2-3 sentence description of what this product does and who it's for]

## Core Purpose
[What problem does this solve? What is the primary value proposition?]

## Key Features
### Feature 1: {Name}
- Description
- User benefit
- Key capabilities

[Repeat for each major feature]

## User Workflows
[Describe primary user journeys and how features connect]

## Integrations & Dependencies
[External services, APIs, or systems this connects to]

## Current Limitations
[Known constraints or boundaries of functionality]

## Glossary
[Domain-specific terms used in the product]
```

#### Document 2: Technical Stack Reference
Save to: `{repo-name}-tech-stack.md`

Structure:
```
# {Product Name} - Technical Stack Reference

## Overview
[Brief technical summary - architecture style, deployment model]

## Core Technologies

### Language & Runtime
- Primary language(s) and version(s)
- Runtime requirements

### Framework
- Framework name and version
- Key framework features used
- Configuration approach

### Database & Storage
- Database type and version
- ORM/query layer
- Schema management approach
- Caching strategy (if any)

### API Layer
- API style (REST, GraphQL, tRPC, etc.)
- Authentication method
- Key endpoints or operations pattern

### Frontend (if applicable)
- Framework/library
- State management
- Styling approach
- Build tooling

### Infrastructure & DevOps
- Containerization
- CI/CD pipeline
- Hosting/deployment target
- Environment configuration

## Project Structure
[Directory layout with purpose of each major folder]

## Key Patterns & Conventions
- Code organization patterns
- Naming conventions
- Error handling approach
- Testing strategy

## Dependencies
### Production Dependencies
[List critical dependencies with purpose]

### Development Dependencies
[Build tools, testing frameworks, linters]

## Configuration Reference
[Key environment variables and configuration options]

## Replication Notes
[Specific guidance for recreating this stack on a new project]
```

### 5. Output
- Create a project folder named after the repository: `personal/projects/<repo-name>/`
- Save both documents to that project folder
- Provide a brief summary of findings
