# turn-timestamp: a date and time under every Claude Code answer

A tiny Claude Code mod that prints the local date and time beneath every completed response, so you can tell at a glance whether the tab you just clicked on is from five minutes ago or five days ago.

```
Completed Fri, Oct 2, 2026, 5:41:07 AM EDT
```

It works in the terminal, the desktop app, and the VS Code extension. It is three files and about forty lines of TypeScript, and Claude Code wrote it in one turn when asked.

## The problem

If you run Claude Code in several VS Code tabs, or keep a handful of terminal sessions open, the transcripts all look the same. Nothing in the UI tells you when a given response landed. You click into a tab, read the last message, and have no idea if you are looking at today's work or something from last week.

## What the mod does

Claude Code now supports **mods**: plugins written as function hooks that run inside the session and can draw panes, status lines, toasts, or react to events. One of those events is `turn.complete`, which fires every time a response finishes. A hook on that event can return a short line of text, and the engine shows it beneath the answer.

This mod hooks `turn.complete`, reads the clock, and returns a stamp. That is the whole thing.

- Only the main answer gets a stamp. Subagent turns end inside the main turn and are skipped, so you never see a pile of timestamps from one response.
- The label changes with how the turn ended: `Completed`, `Interrupted`, `Ended with error`, or `Refused`.
- The transcript itself is never rewritten. The stamp is display-only.

## Install

You need Claude Code 2.1.286 or newer. The mods API is marked early access by Anthropic, so expect it to change.

**Option 1: try it in one terminal session**

```bash
git clone https://github.com/JDWorkdog/ai-workbench.git
claude --plugin-dir ~/path/to/ai-workbench/mods/turn-timestamp
```

**Option 2: load it everywhere, including VS Code and the desktop app**

The VS Code extension and desktop app cannot take a command-line flag, so they read plugin folders from the `CLAUDE_CODE_PLUGIN_DIRS` variable in the `env` block of your user settings. Add this to `~/.claude/settings.json` (merge with what is already there):

```json
{
  "env": {
    "CLAUDE_CODE_PLUGIN_DIRS": "~/path/to/ai-workbench/mods/turn-timestamp"
  }
}
```

Separate several folders with `:` on macOS and Linux, `;` on Windows. Restart Claude Code and every new session will carry the stamp.

**Option 3: have Claude build it for you**

Open Claude Code and ask:

> Load the plugin-authoring skill and build me a mod that prints the local date and time beneath every completed answer using the turn.complete hook. Skip subagent turns.

Claude writes the mod into a hot-reloading dev folder, asks once whether to enable hot reloading for the session, and the stamp appears on its next reply. That is how this one was made.

## Verify it

```bash
claude plugin validate mods/turn-timestamp
```

You should see `hooks: turn.complete` and `calls: $.clock.now, $.env.get` in the output, and `Validation passed`.

## The code

`.claude-plugin/plugin.json`

```json
{
  "name": "turn-timestamp",
  "version": "0.1.0",
  "description": "Shows the date and time beneath every completed answer so you can tell how fresh a tab is."
}
```

`hooks/hooks.json`

```json
{ "modules": ["./register.ts"] }
```

`hooks/register.ts`

```ts
import type { Register } from 'claude-code'

function stamp(ms: number, timeZone: string | undefined): string {
  const d = new Date(ms)
  try {
    const f = new Intl.DateTimeFormat('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
      ...(timeZone ? { timeZone } : {}),
    })
    return f.format(d)
  } catch {
    return d.toISOString()
  }
}

export const register: Register = on => {
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined) return result   // subagent turn: leave it alone

    const now = await $.clock.now()
    const tz = await $.env.get('TZ')
    const label =
      e.reason === 'answer' ? 'Completed'
      : e.reason === 'aborted' ? 'Interrupted'
      : e.reason === 'error' ? 'Ended with error'
      : 'Refused'

    return { ...result, text: `${label} ${stamp(now, tz)}` }
  })
}
```

How to read it: `register` gets an `on` function. `on('turn.complete', hook)` adds a hook. Every hook receives `$` (the engine interface), `e` (the event input), and `next` (the rest of the chain). Calling `next(e)` lets the engine finish normally and hands back its result, which for this event is `{ text }`. Returning a different `text` makes the engine show that text beneath the answer.

## Customize it

- **Pin a time zone.** Replace `await $.env.get('TZ')` with a literal such as `'America/New_York'`.
- **Shorter stamp.** Drop `weekday` and `year` from the format options for something like `Oct 2, 5:41 AM EDT`.
- **Add the duration.** `e.durationMs` is on the event. Append `Math.round(e.durationMs / 1000)` seconds to the line.
- **Add token cost.** `e.usage` carries the turn's token counts when the turn had any.

Saving the file while a session is running hot-reloads the hook, so you can tweak and see the result on the next reply.

## Why this matters beyond timestamps

The interesting part is not the stamp, it is how little it took. The mods API gives you typed events for prompts, tool calls, model steps, turn boundaries, and UI rendering, with a hot-reload loop built into the session. Anything you have wanted Claude Code to do automatically at a turn boundary is now a hook away, and Claude can write the hook for you.

## Credits

Built with Claude Code's `plugin-authoring` skill. Part of the [AI Workbench](https://github.com/JDWorkdog/ai-workbench) starter kit.
