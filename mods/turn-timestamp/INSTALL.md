# turn-timestamp: one-file installer

A Claude Code mod that prints the local date and time beneath every completed answer, so you can tell at a glance whether a VS Code tab or terminal session is from five minutes ago or five days ago.

```
Completed Fri, Oct 2, 2026, 5:41:07 AM EDT
```

This file is self-contained. Everything an assistant needs to install the mod is in the appendix below. You do not need to clone the repo it came from.

## Quick start: let your agent set this up

Pick one.

**You have this file saved locally.** Open Claude Code anywhere and paste this line, adjusting the path:

```
Read the file INSTALL.md in full, then follow its section "Agent setup instructions" exactly. Begin by asking me whether I want the mod on for every project or for the current project only.
```

**You only have the link.** Open Claude Code anywhere and paste this:

```
Fetch https://raw.githubusercontent.com/JDWorkdog/ai-workbench/main/mods/turn-timestamp/INSTALL.md and follow its section "Agent setup instructions" exactly. Begin by asking me whether I want the mod on for every project or for the current project only.
```

The assistant will check your Claude Code version, write the three mod files to a stable folder in your home directory, validate them with the Claude CLI, and (if you choose "every project") add one variable to your user settings with a backup of the file it touched. Nothing is written before you answer the first question.

Requirements: Claude Code 2.1.286 or newer. The mods API is marked early access by Anthropic, so expect it to change between releases.

## What you get

- A `Completed <date and time>` line under every finished main answer in the terminal and the VS Code extension, plus the same stamp pinned as a status line under the prompt, which every surface draws, including the desktop app's Code tab. A `display` option picks one or both.
- Labels that change with how the turn ended: `Completed`, `Interrupted`, `Ended with error`, or `Refused`.
- One stamp per response. Subagent turns are skipped.
- Nothing in the transcript is rewritten. The stamp is display only.

Source and a longer write-up: https://github.com/JDWorkdog/ai-workbench/tree/main/mods/turn-timestamp

## Agent setup instructions

These instructions are for the assistant (Claude Code) acting on this file. Follow them in order. Ask before every write.

### 1. Ask the scope question

Ask the user, with these two options:

1. **Every project (recommended).** Installs the mod folder under `~/.claude/mods/turn-timestamp/` and adds `CLAUDE_CODE_PLUGIN_DIRS` to the `env` block of `~/.claude/settings.json`. That file is user-level, so one edit covers every project on the machine and every VS Code tab. This is the only way the VS Code extension and desktop app can load a plugin folder, since they cannot take a command-line flag.
2. **Current project only.** Installs the mod folder under `~/.claude/mods/turn-timestamp/` and writes nothing to settings. The user starts the project with `claude --plugin-dir ~/.claude/mods/turn-timestamp` when they want the stamp. Tell them plainly that this option does not reach the VS Code extension or the desktop app.

Wait for the answer.

### 2. Check the Claude Code version

Run:

```bash
claude --version
```

The mods API needs 2.1.286 or newer. If the installed version is older, stop, report the version, and tell the user to update Claude Code first (`claude update`, or reinstall through their package manager). Do not write anything.

### 3. Inventory what exists

Check, and report in one short message:

- Does `~/.claude/mods/turn-timestamp/` already exist? If so, show the user the first lines of its `hooks/register.ts` and ask whether to overwrite or leave it.
- Does `~/.claude/settings.json` exist? If so, does its `env` block already contain `CLAUDE_CODE_PLUGIN_DIRS`? If it does, note the current value; the install appends to it rather than replacing it (see step 6).

### 4. Write the three mod files

Create the folder and write the files exactly as they appear in the appendix. Do not reformat them. Confirm the folder looks like this when done:

```
~/.claude/mods/turn-timestamp/
├── .claude-plugin/
│   └── plugin.json
└── hooks/
    ├── hooks.json
    └── register.ts
```

### 5. Validate

Run:

```bash
claude plugin validate ~/.claude/mods/turn-timestamp
```

Expected output includes `hooks: turn.complete`, `calls: $.clock.now, $.env.get, $.ui.log, $.ui.status`, and `Validation passed`. If validation fails, show the user the full output and stop. Do not continue to the settings step with a mod that does not validate.

### 6. Wire it up (scope "every project" only)

Skip this step entirely if the user chose "current project only".

1. Back up the settings file first: copy `~/.claude/settings.json` to `~/.claude/settings.json.bak-turn-timestamp`. If the settings file does not exist, create it with `{}` and skip the backup.
2. Parse the file as JSON. Preserve every existing key and the key order.
3. Set `env.CLAUDE_CODE_PLUGIN_DIRS`:
   - If it is unset, set it to `~/.claude/mods/turn-timestamp`.
   - If it is already set, append `~/.claude/mods/turn-timestamp` to the existing value using the platform's path-list separator (`:` on macOS and Linux, `;` on Windows), unless the path is already present.
4. Write the file back with two-space indentation and a trailing newline. Re-read it and confirm it parses as JSON.
5. Show the user the resulting `env` block.

Do not touch any project-level `.claude/settings.json`. The variable is only read from user settings or the process environment.

### 7. Finish

Tell the user, in a few lines:

- Where the mod lives.
- That the stamp appears in new sessions after they restart Claude Code (quit and reopen the terminal session, the desktop app, or reload the VS Code window). Already-open sessions are not affected.
- For scope "current project only", the exact command to start a session with the mod.
- How to uninstall: delete `~/.claude/mods/turn-timestamp/` and remove the path from `CLAUDE_CODE_PLUGIN_DIRS` in `~/.claude/settings.json` (or restore the `.bak-turn-timestamp` copy).
- Two options they can change without editing code, from `/config` in any session or under `pluginConfigs."turn-timestamp".options` in `~/.claude/settings.json`: `display` (`both` by default; `answer` draws the stamp beneath each answer only, `status` pins the latest stamp under the prompt only, `log` adds a dim transcript line for hosts that draw neither) and `timeZone` (an IANA zone such as `America/New_York`; empty uses the machine's zone). The desktop app's Code tab does not draw the beneath-the-answer text, so desktop users rely on the status line, which the default already includes.

Do not offer to install anything else. Do not add the mod to any project's instructions file.

## Appendix: the mod files

Write these verbatim.

### `.claude-plugin/plugin.json`

```json
{
  "name": "turn-timestamp",
  "version": "0.2.0",
  "description": "Shows the date and time of every completed answer so you can tell how fresh a tab is.",
  "author": {
    "name": "John Workman"
  },
  "userConfig": {
    "display": {
      "type": "string",
      "title": "Where to show the stamp",
      "description": "answer draws it beneath each answer (terminal and VS Code). status pins the latest stamp under the prompt and updates it every answer (all surfaces, including the desktop Code tab). both does both. log adds a dim transcript line, for hosts that draw neither.",
      "default": "both",
      "options": ["both", "answer", "status", "log"]
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

### `hooks/hooks.json`

```json
{ "modules": ["./register.ts"] }
```

### `hooks/register.ts`

```ts
import type { Register } from 'claude-code'

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
  const display = String(options.display ?? 'both')
  const pinnedZone = String(options.timeZone ?? '').trim()

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

    // Pinned under the prompt; every surface draws it. Replaced each answer.
    if (display === 'status' || display === 'both') $.ui.status(line)

    // A dim transcript row, for hosts that draw neither of the above.
    if (display === 'log') $.ui.log(line)

    // Drawn beneath the answer where the surface supports it.
    if (display === 'answer' || display === 'both') return { ...result, text: line }
    return result
  })
}
```

### How to read `register.ts`

`register` receives an `on` function and the `options` the manifest's `userConfig` declares, defaults filled in. `on('turn.complete', hook)` adds a hook that runs when a response finishes. Every hook gets `$` (the engine interface), `e` (the event input), and `next` (the rest of the chain). Calling `next(e)` lets the engine finish normally and hands back its result, which for this event is `{ text }`. Returning a different `text` makes the engine show that text beneath the answer. The transcript itself is never changed.
