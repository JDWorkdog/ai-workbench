# Skills

Skills are modular capability packages Claude loads on demand. Drop a skill in this folder when you want Claude to gain a specific capability — API reference docs, domain knowledge, a specialized workflow — that shouldn't bloat `CLAUDE.md` because it's only needed sometimes.

## Skill vs Command vs Rule

| Use a… | When you want… |
|---|---|
| **Command** (`.claude/commands/*.md`) | A repeatable, user-invoked workflow. Triggered explicitly: `/prd`, `/research`. |
| **Skill** (`.claude/skills/<name>/SKILL.md`) | Domain knowledge or capability loaded only when relevant — e.g., an integration's API reference, a specialized analysis technique. Progressive disclosure via `references/`. |
| **Rule** (`.claude/rules/*.md`) | A standing instruction that shapes how Claude behaves across many tasks — naming conventions, autonomy boundaries, output routing. |

## Skill Folder Layout

```
.claude/skills/<skill-name>/
├── SKILL.md            # frontmatter + core skill content
└── references/         # optional deeper docs loaded on demand
    └── <topic>.md
```

The `SKILL.md` frontmatter should include:

```yaml
---
name: <skill-name>
description: One-line description of when this skill applies
---
```

## This Folder Is Empty

No skills are shipped with the base workspace. Add domain-specific skills as you need them — examples worth considering later:
- `intercom-analysis` / `customer-360` (if you integrate Intercom)
- `prd-author` (if PRD authoring gets opinionated enough to warrant its own skill)
- `meeting-summary` (if the summary format gets company-specific)
