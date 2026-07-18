# Workspace Instructions

@AGENTS.md

`AGENTS.md` is the canonical workspace guide for every assistant in this workspace (Claude Code and Codex). All workspace rules, including the writing style rules, live there. Claude-specific notes, when needed, go below this line.

- The auto-journal hook (`.claude/hooks/auto-journal-detect.sh`) and the delegation roster (`.claude/agents/`) are Claude Code features; their Codex equivalents live in `.codex/`.
- Local customization goes in `.claude/settings.local.json` (copy `.claude/settings.local.example.json`), never in tracked files.
