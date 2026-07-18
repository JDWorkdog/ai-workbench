# Onboarding

The first-week path through the AI Workbench. Each step works on its own; stop wherever your needs are met.

## 1. Install an assistant and open the workbench

- Claude Code: [resources/getting-started/install-claude-code.md](resources/getting-started/install-claude-code.md)
- Codex: [resources/getting-started/install-codex.md](resources/getting-started/install-codex.md)

Clone the repo and open the folder in your assistant:

```bash
git clone https://github.com/JDWorkdog/ai-workbench.git
cd ai-workbench
```

## 2. Run /setup

In your first session, run `/setup` (or say "set up this workbench"). It asks whether you use Claude Code, Codex, or both, prunes what you do not need, personalizes your local settings, and walks the connector checklist. It leaves a receipt at `personal/docs/setup-receipt.md`.

## 3. Produce something real

Pick the command that matches your day job and run it on a real task:

- `/prd` for a feature you are speccing
- `/research` for a question you actually need answered
- `/meeting-summary` on a transcript in `temp-files/`
- `/repo-analysis` on a codebase you work in

Everything lands in `personal/` (gitignored). The full command table is in [AGENTS.md](AGENTS.md).

## 4. Turn on the journal

The workbench's flagship habit: a journal that writes itself from your calendar, meetings, email, and chat, and stays answerable for years. Follow [guides/journaling-guide.md](guides/journaling-guide.md) to set up the two scheduled tasks. From then on, `/recall` answers questions like "when did we last meet Dana" or "what did we promise Acme Corp".

Even without the scheduled pipeline, talking about your day updates the journal automatically, and `/daily` works any time.

## 5. Learn the routing layer

Read [guides/model-routing-guide.md](guides/model-routing-guide.md). The short version: the frontier model is the manager, not the typist. The workspace ships a five-role roster (fetcher, summarizer, implementer, qa-reviewer, architect) with pinned model tiers, and a routing table in `AGENTS.md` that says which work goes where. Two standing rules: escalate anything risky to the frontier tier, and never let a cheap tier certify its own work.

Want the same layer in another project? Run `/tune-my-harness` there.

## 6. Make it yours

- Set a project context ("I'm working on my-app") and watch output route to `personal/projects/my-app/`.
- Copy `resources/_examples/sample-tags.md` and `sample-organization.md` to `personal/resources/` to teach `/meeting-journal` your people and task routing.
- Workspace rules live in `AGENTS.md` and only there. After changing them, run the checks:

```bash
python3 scripts/check-ai-harness-rules.py
./scripts/sync-codex-skills.sh --check
```

## The habits that make it stick

1. One home per rule: `AGENTS.md` is canonical; nothing gets duplicated into other instruction files.
2. Artifacts over re-derivation: plans, findings, and handoffs go in files (`/handover` before ending a long session).
3. Clean after every major model upgrade: run `/harness-review` and ask "what can I remove", not "what can I add".
