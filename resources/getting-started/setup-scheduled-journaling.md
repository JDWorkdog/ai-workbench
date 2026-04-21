# Setting Up Scheduled Journaling

Automate your daily journal: pull activity from Gmail, Google Calendar, Granola, and Slack on a morning and evening schedule so your journal stays current without you running `/daily` manually.

Once configured, a typical day looks like this:

- **7:00am** — a scheduled task runs `/morning-sync`. When you sit down at your desk, today's journal file already has a Morning Catchup section with your calendar, overnight emails, recent Granola meetings, and Slack DMs. Pending items from yesterday are pulled forward.
- **During the day** — you use `/daily` or just talk to Claude. The `auto-journal-detect` hook captures day-talk as you work.
- **10:00pm** — a scheduled task runs `/evening-sync`. A Day Wrap section is appended: meetings attended, outgoing emails, Slack activity, and a Pending Tomorrow list.

---

## How Scheduled Tasks Work in Claude Code

Claude Code has three different scheduling mechanisms. Pick based on where the work needs to run.

| | Desktop scheduled tasks | Cloud Routines | `/loop` |
|---|---|---|---|
| Runs on | Your machine | Anthropic cloud | Your current session |
| Machine must be on | Yes | No | Yes |
| Local file access | Full | None — repo clones only | Full |
| Connectors (Gmail, Calendar, Slack, Granola) | Yes + local MCPs | Yes | Yes |
| Works when VS Code is closed | Yes (Desktop app runs separately) | Yes | No |
| Persists across sessions | Yes | Yes | No |
| Created from | Desktop app Schedule UI | `/schedule`, web UI, or Desktop app | `/loop` in any session |
| Minimum interval | 1 minute | 1 hour | 1 minute |

**For this workbench, use Desktop scheduled tasks.** The journal lives in local `personal/journal/*.md` files — Cloud Routines can't write to those because they only operate on cloned GitHub repositories.

> If you'd rather keep the journal in a private GitHub repo and get execution that doesn't depend on your machine being on, the [Cloud Routines section](#alternative-cloud-routines) at the bottom covers that path.

---

## Prerequisites

- **macOS or Windows.** Desktop scheduled tasks require the Claude Code Desktop app, which ships for both.
- **Claude Code Desktop app installed.** Not the VS Code extension — the standalone app. Available from [claude.ai/code](https://claude.ai/code).
- **Pro, Max, Team, or Enterprise plan.** Scheduled tasks draw from the same usage pool as interactive sessions.
- **The workbench cloned locally.** You need a path on disk you can point the scheduled task at as its working directory.

You can still use VS Code as your primary editor. The Desktop app just needs to be running when the schedule fires — it does not need to be in focus.

---

## Step 1: Connect Your Services

Connectors are Anthropic-hosted integrations. Configure them once at the account level and any scheduled task (or interactive session) can use them.

Go to **[claude.ai/settings/connectors](https://claude.ai/settings/connectors)** and connect each service below. All four use OAuth — no API keys or tokens to manage.

### Gmail

1. In the Connectors page, find **Google Workspace** (Gmail is a sub-connector).
2. Click **Connect**.
3. In the OAuth flow, choose the Google account that owns your inbox.
4. Grant the requested permissions. The connector needs read access to messages and the ability to create drafts (for future commands that might use it).
5. Back in the Connectors page, verify you see `Gmail — Connected`.

### Google Calendar

Same Google Workspace connector covers Calendar. If Gmail is already connected, Calendar is usually included — check the scopes listed on the connector card.

If Calendar isn't showing as connected:
1. Click **Manage** on the Google Workspace card.
2. Add the Calendar scope: read events, list calendars.
3. Re-authenticate if prompted.

### Slack

1. Find **Slack** in the Connectors page.
2. Click **Connect**.
3. You'll be redirected to your Slack workspace. Choose which workspace to connect (you can connect multiple).
4. Grant the bot user the needed scopes: `channels:read`, `channels:history`, `im:read`, `im:history`, `search:read`, `users:read`.
5. Back in the Connectors page, verify `Slack — Connected` with the correct workspace name.

### Granola

1. Find **Granola** in the Connectors page. If it's not there, add it via the **Add Custom Connector** flow using the Granola MCP URL from [docs.granola.ai](https://docs.granola.ai/help-center/sharing/integrations/mcp).
2. Click **Connect**.
3. Sign in to Granola via the browser OAuth flow.
4. Verify `Granola — Connected`.

**Free-tier caveat:** Granola's free plan limits MCP access to the last 30 days of meetings and doesn't expose transcripts — only summaries and metadata. The `/morning-sync` and `/evening-sync` commands handle this gracefully.

### Verify All Four

In any Claude Code session (VS Code terminal is fine), start a quick test:

```
List my connectors and show today's calendar events.
```

If Claude reports all four connectors available and returns calendar data, you're ready.

---

## Step 2: Schedule the Morning and Evening Tasks

Open the Claude Code Desktop app. Click the **Schedule** (or **Tasks**) icon in the sidebar.

### Morning Task

Click **New Task** and fill in:

| Field | Value |
|---|---|
| Name | `Morning Journal Catchup` |
| Prompt | `/morning-sync` |
| Working directory | `/path/to/your/ai-workbench` *(full path to your clone)* |
| Cron | `0 7 * * 1-5` *(weekdays at 7:00am local time)* |
| Run in background | Yes |
| Notify on completion | Your preference — see Troubleshooting for what this looks like |

Save the task. It should appear in your task list with a "Next run" timestamp.

**Cron quick reference** (if you want to adjust):
- `0 7 * * 1-5` — 7am Mon–Fri
- `0 7 * * *` — 7am every day
- `0 8 * * *` — 8am every day
- `30 6 * * 1-5` — 6:30am Mon–Fri

### Evening Task

Click **New Task** again:

| Field | Value |
|---|---|
| Name | `Evening Journal Wrap` |
| Prompt | `/evening-sync` |
| Working directory | *(same path as morning task)* |
| Cron | `0 22 * * *` *(every night at 10:00pm local time)* |
| Run in background | Yes |

Save.

---

## Step 3: Verify

Right-click the Morning task in the Schedule page and pick **Run Now** (or the equivalent menu item).

Expected outcome:
1. A new session starts in the background.
2. `/morning-sync` runs, pulls from the four connectors, and writes to today's journal.
3. The task completes with a success status.
4. Opening `personal/journal/<today>-<DAY>.md` in your editor shows a `## Morning Catchup` section.

If the task fails, see Troubleshooting below.

Once you've verified Morning Catchup works, run Evening Wrap the same way. It should append a `## Day Wrap` section to the same file.

---

## Troubleshooting

**The scheduled task didn't run at all.**
- Check that Claude Code Desktop was open at the scheduled time. Unlike Cloud Routines, Desktop tasks require the app to be running.
- If your Mac went to sleep, the task likely skipped. Check **System Settings → Battery → Prevent automatic sleep when display is off** or use the "Keep computer awake" option in Claude Code Desktop preferences.
- Check the task's **Run History** — a failed launch usually has an entry with an error reason.

**The task ran but the journal wasn't updated.**
- Confirm the **Working directory** field points to your clone, not a parent folder. The commands use relative paths like `personal/journal/` that require the right cwd.
- Check whether the task ran against a different date — timezone drift can cause a 7am task to see yesterday's date if the task host's timezone doesn't match your local one.

**A connector says "Skipped — connector not configured" but I did connect it.**
- Go back to [claude.ai/settings/connectors](https://claude.ai/settings/connectors) and check whether the connection is **Active** vs **Expired**. OAuth tokens expire; reconnecting usually fixes this.
- Some connectors need to be explicitly attached to scheduled tasks. In the task edit view, scroll down to **Connectors** and tick the ones you want available.

**Granola returned no meetings.**
- If you're on the free tier, you only get the last 30 days. Older meetings won't appear.
- Granola's MCP sometimes needs the desktop app to have synced recently. Open Granola on your machine and let it sync.

**The briefing shows full names / real email addresses when I'd rather see domains.**
- The commands lean toward domains/handles by default, but they adapt to existing journal content. If previous entries used full names, new entries will match that style. Manually edit a few entries to use domains and the pattern will stick.

**I want Morning Catchup to include items from a specific Slack channel.**
- Star or save that channel in Slack (click the bookmark icon on the channel). The command's Slack query includes starred channels by default.

**Running the task twice creates duplicate sections.**
- Both commands are designed to be idempotent on the same day — the Day Wrap block, for example, should get replaced rather than duplicated. If you see duplicates, it's usually because the task ran at 11:59pm one day and 12:01am the next and they resolved to different dates. Check timestamps.

---

## Alternative: Cloud Routines

If you'd prefer scheduled tasks that run regardless of whether your machine is on, migrate the journal to a private GitHub repo and use Cloud Routines instead.

High-level steps:
1. Create a private GitHub repo, e.g., `your-handle/journal`.
2. Move `personal/journal/` content there and adjust `/morning-sync` and `/evening-sync` to clone + commit back to that repo rather than write local files.
3. At [claude.ai/code/routines](https://claude.ai/code/routines) (or via `/schedule` in any CLI session), create a Routine for each sync:
   - Repository: `your-handle/journal`
   - Connectors: Gmail, Calendar, Slack, Granola
   - Prompt: adapted `/morning-sync` or `/evening-sync` that writes + commits
   - Schedule: 1-hour minimum interval applies (so `0 7 * * 1-5` is fine; `*/15 * * * *` is not)

This path isn't shipped as a ready-made command in the workbench because it requires user-specific choices (repo name, branch strategy, commit cadence). If you go this route, the existing commands are a good starting point — fork them into `/morning-sync-cloud` and `/evening-sync-cloud` variants.

Official docs for Cloud Routines: [code.claude.com/docs/en/web-scheduled-tasks](https://code.claude.com/docs/en/web-scheduled-tasks).

---

## One-Time vs. Recurring

Desktop scheduled tasks also support one-shot scheduling (e.g., "run this prompt tomorrow at 9am"). That's useful for reminders but not for journaling. Use cron expressions for anything recurring.

## Where Everything Lives

- **Commands:** [`.claude/commands/morning-sync.md`](../../.claude/commands/morning-sync.md), [`.claude/commands/evening-sync.md`](../../.claude/commands/evening-sync.md)
- **Task configuration:** Claude Code Desktop app → Schedule (stored in your local app data, not in this repo)
- **Journal output:** `personal/journal/YYYY-MM-DD-DAY.md` (or `personal/projects/<name>/journal/` when a project is active)
- **Related commands:** [`/daily`](../../.claude/commands/daily.md) for manual capture, [`/meeting-journal`](../../.claude/commands/meeting-journal.md) for transcript-driven entries, [`/ai-news-digest`](../../.claude/commands/ai-news-digest.md) and [`/claude-code-news`](../../.claude/commands/claude-code-news.md) for release tracking (both invoked by `/morning-sync` automatically)
