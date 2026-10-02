# turn-timestamp: a date and time under every Claude Code answer

A tiny Claude Code mod that prints the local date and time beneath every completed response, so you can tell at a glance whether the tab you just clicked on is from five minutes ago or five days ago.

```
Completed Fri, Oct 2, 2026, 5:41:07 AM EDT
```

It works in the terminal, the VS Code extension, and the desktop app's Code tab. It is four small files and under a hundred lines of TypeScript, and Claude Code wrote the first version in one turn when asked.

## The problem

If you run Claude Code in several VS Code tabs, or keep a handful of terminal sessions open, the transcripts all look the same. Nothing in the UI tells you when a given response landed. You click into a tab, read the last message, and have no idea if you are looking at today's work or something from last week.

## What the mod does

Claude Code now supports **mods**: plugins written as function hooks that run inside the session and can draw panes, status lines, toasts, or react to events. One of those events is `turn.complete`, which fires every time a response finishes. A hook on that event can return a short line of text, and the engine shows it beneath the answer.

This mod hooks `turn.complete`, reads the clock, and returns a stamp. Not every surface draws that returned text: the terminal and VS Code do, the desktop app's Code tab does not. So the mod also draws a band directly above the prompt input with the latest stamp, using the `AbovePrompt` render component, which the terminal and the desktop Code tab support. Between the two channels every surface shows a visible stamp without anything collapsed or hidden.

- Only the main answer gets a stamp. Subagent turns end inside the main turn and are skipped, so you never see a pile of timestamps from one response.
- The label changes with how the turn ended: `Completed`, `Interrupted`, `Ended with error`, or `Refused`.
- Two settings, changeable from `/config` without editing code: `display` (`auto`, `answer`, `band`, `status`, or `log`) and `timeZone`.
- The transcript itself is never rewritten. The stamp is display-only.

## Install

You need Claude Code 2.1.286 or newer. The mods API is marked early access by Anthropic, so expect it to change.

**Fastest: one file, no clone**

[`INSTALL.md`](INSTALL.md) is a self-contained installer. It carries the three mod files in an appendix plus step-by-step instructions for your assistant: version check, inventory, write, validate, and (if you want it everywhere) one user-level settings edit with a backup. Open Claude Code anywhere and paste:

```
Fetch https://raw.githubusercontent.com/JDWorkdog/ai-workbench/main/mods/turn-timestamp/INSTALL.md and follow its section "Agent setup instructions" exactly. Begin by asking me whether I want the mod on for every project or for the current project only.
```

Or save the file locally and paste `Read the file INSTALL.md in full, then follow its section "Agent setup instructions" exactly.` The options below are the manual equivalents.

**Option 1: try it in one terminal session**

```bash
git clone https://github.com/JDWorkdog/ai-workbench.git
claude --plugin-dir ~/path/to/ai-workbench/mods/turn-timestamp
```

**Option 2: load it everywhere, including VS Code and the desktop app**

The VS Code extension and desktop app cannot take a command-line flag, so they read plugin folders from the `CLAUDE_CODE_PLUGIN_DIRS` variable in the `env` block of your user settings. Because `~/.claude/settings.json` is user-level, one edit here covers every project on your machine and every VS Code tab, which is what you want if the goal is never losing track of a tab again. Add this (merge with what is already there):

```json
{
  "env": {
    "CLAUDE_CODE_PLUGIN_DIRS": "~/path/to/ai-workbench/mods/turn-timestamp"
  }
}
```

Separate several folders with `:` on macOS and Linux, `;` on Windows. Restart Claude Code and every new session will carry the stamp. This variable is only read from user settings or the process environment, never from a project's `.claude/settings.json`, so there is no per-project version of this option. If you want the stamp in a single project only, use Option 1 when you start that project.

**Option 3: have Claude build it for you**

Open Claude Code and ask:

> Load the plugin-authoring skill and build me a mod that prints the local date and time beneath every completed answer using the turn.complete hook. Skip subagent turns.

Claude writes the mod into a hot-reloading dev folder, asks once whether to enable hot reloading for the session, and the stamp appears on its next reply. That is how this one was made.

## Verify it

```bash
claude plugin validate mods/turn-timestamp
```

You should see `hooks: turn.complete, ui.render{component=AbovePrompt}` in the output, a `state writes: turn-timestamp.last` line, and `Validation passed`.

## The code

`.claude-plugin/plugin.json`

```json
{
  "name": "turn-timestamp",
  "version": "0.3.0",
  "description": "Shows the date and time of every completed answer so you can tell how fresh a tab is.",
  "author": {
    "name": "John Workman"
  },
  "types": "./types/index.d.ts",
  "userConfig": {
    "display": {
      "type": "string",
      "title": "Where to show the stamp",
      "description": "auto draws a line beneath each answer (terminal, VS Code) and a band above the prompt with the latest stamp (terminal, desktop Code tab). answer, band, status and log each pick one channel; status pins a plugin status line, which the desktop folds into a collapsed notice.",
      "default": "auto",
      "options": ["auto", "answer", "band", "status", "log"]
    },
    "timeZone": {
      "type": "string",
      "title": "Time zone",
      "description": "An IANA zone such as America/New_York. Empty uses the machine's zone, or TZ when set.",
      "default": ""
    }
  }
}
```

`hooks/hooks.json`

```json
{ "modules": ["./register.tsx"] }
```

`types/index.d.ts` (the state contract for the one value the band reads)

```ts
export type TurnStamp = string

declare module 'claude-code' {
  interface PluginState {
    'turn-timestamp': { last: TurnStamp | null }
  }
}
```

`hooks/register.tsx`

```tsx
import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { TurnStamp } from '../types'

// The latest stamp, kept in session state so the band survives a hot reload.
const last = atom<TurnStamp | null>({ plugin: 'turn-timestamp', key: 'last' } as const, null)

// Formats the wall-clock time as "Fri, Oct 2, 2026, 3:42:07 PM EDT".
// An invalid or empty zone falls back to the sandbox's own zone, then to ISO.
function stamp(ms: number, timeZone: string | undefined): string {
  const d = new Date(ms)
  const opts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }
  try {
    return new Intl.DateTimeFormat('en-US', timeZone ? { ...opts, timeZone } : opts).format(d)
  } catch {
    try {
      return new Intl.DateTimeFormat('en-US', opts).format(d)
    } catch {
      return d.toISOString()
    }
  }
}

export const register: Register = (on, options) => {
  const display = String(options.display ?? 'auto')
  const pinnedZone = String(options.timeZone ?? '').trim()
  const wants = (channel: string) =>
    display === channel || (display === 'auto' && (channel === 'answer' || channel === 'band'))

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)

    // Subagent turns end inside the main turn; only stamp the main answer.
    if (e.agentId !== undefined) return result

    const now = await $.clock.now()
    const zone = pinnedZone || (await $.env.get('TZ')) || undefined
    const label =
      e.reason === 'answer'
        ? 'Completed'
        : e.reason === 'aborted'
          ? 'Interrupted'
          : e.reason === 'error'
            ? 'Ended with error'
            : 'Refused'
    const line = `${label} ${stamp(now, zone)}`

    // The band above the prompt reads this; writing it redraws the band.
    if (wants('band')) await update($, last, () => line)

    // A plugin status line under the prompt. The desktop shows it as a
    // collapsed "Claude Code notice", so it is off unless chosen.
    if (wants('status')) $.ui.status(line)

    // A dim transcript row, for hosts that draw none of the above.
    if (wants('log')) $.ui.log(line)

    // Drawn beneath the answer where the surface supports it (terminal, VS Code).
    return wants('answer') ? { ...result, text: line } : result
  })

  // The band directly above the prompt input. Raised on the terminal and the
  // desktop Code tab; VS Code does not raise it and shows the answer line instead.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!wants('band')) return next(e)
    const line = await read($, last)
    if (e.props.hasSurvey || line === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text dimColor>
          {e.props.isWorking ? `Working. Last answer: ${line}` : `Last answer: ${line}`}
        </Text>
      </Box>
    )
  })
}
```

How to read it: `register` gets an `on` function and the `options` from the manifest's `userConfig`, defaults filled in. `on('turn.complete', hook)` adds a hook. Every hook receives `$` (the engine interface), `e` (the event input), and `next` (the rest of the chain). Calling `next(e)` lets the engine finish normally and hands back its result, which for this event is `{ text }`. Returning a different `text` makes the terminal and VS Code show that text beneath the answer. The `ui.render` hook on `AbovePrompt` draws the band: it reads the latest stamp from session state, and the write in the first hook redraws it.

## Customize it

- **Pin a time zone.** Set `timeZone` in `/config` (or under `pluginConfigs."turn-timestamp".options` in `~/.claude/settings.json`) to an IANA zone such as `America/New_York`.
- **Choose where it shows.** Set `display` to `answer` for the beneath-the-answer line only, `band` for the above-prompt band only, `status` for a plugin status line (the desktop folds this into a collapsed notice, which is why it is not in the default), or `log` for a dim transcript row. The default `auto` draws the answer line and the band.
- **Shorter stamp.** Drop `weekday` and `year` from the format options for something like `Oct 2, 5:41 AM EDT`.
- **Add the duration.** `e.durationMs` is on the event. Append `Math.round(e.durationMs / 1000)` seconds to the line.
- **Add token cost.** `e.usage` carries the turn's token counts when the turn had any.

Saving the file while a session is running hot-reloads the hook, so you can tweak and see the result on the next reply.

## Why this matters beyond timestamps

The interesting part is not the stamp, it is how little it took. The mods API gives you typed events for prompts, tool calls, model steps, turn boundaries, and UI rendering, with a hot-reload loop built into the session. Anything you have wanted Claude Code to do automatically at a turn boundary is now a hook away, and Claude can write the hook for you.

## Keeping INSTALL.md in sync

The appendix in `INSTALL.md` embeds the three source files verbatim. If you change `register.tsx`, `index.d.ts`, `hooks.json`, or `plugin.json`, update the appendix to match, or the one-file installer will hand out an older mod than the folder does.

## Credits

Built with Claude Code's `plugin-authoring` skill. Part of the [AI Workbench](https://github.com/JDWorkdog/ai-workbench) starter kit.
