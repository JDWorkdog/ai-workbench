# Skills

Skills are modular capability packages loaded on demand. A capability is written once as a skill and both runtimes discover it: Claude Code reads this folder directly, and Codex reads the synchronized mirror in `.agents/skills/`. This folder is the canonical home; after editing any skill, run:

```bash
./scripts/sync-codex-skills.sh --write
```

Never hand-edit `.agents/skills/`.

## Shipped Skills

| Skill | Purpose |
|---|---|
| `setup` | First-run workspace setup: pick runtimes, personalize settings, walk the connector checklist |
| `recall` | Answer history questions from the journal system (dossiers, rollups, targeted dailies) |
| `tune-my-harness` | Install or upgrade the model-routing and delegation layer in any project |

## Skill vs Command vs Rule

| Use a... | When you want... |
|---|---|
| **Command** (`.claude/commands/*.md`) | A repeatable, user-invoked workflow: `/prd`, `/research`. |
| **Skill** (`.claude/skills/<name>/SKILL.md`) | A capability or domain knowledge loaded only when relevant, with progressive disclosure via `references/`. |
| **Rule** (`.claude/rules/*.md`) | A standing instruction that shapes behavior across many tasks: naming, autonomy, output routing. |

## Skill Folder Layout

```
.claude/skills/<skill-name>/
├── SKILL.md            # frontmatter + core skill content
└── references/         # optional deeper docs loaded on demand
```

Frontmatter: `name` plus a `description` that is short and selection-oriented (what problem, when to use). Codex loads skill descriptions under a bounded discovery budget, so long descriptions hurt routing.
