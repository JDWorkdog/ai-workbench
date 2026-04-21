# Hooks

Bash scripts invoked by Claude Code at well-defined session events. Hooks are registered in `.claude/settings.json` under the `hooks` key.

## Scripts in this folder

| Script | Event | Purpose |
|---|---|---|
| `auto-journal-detect.sh` | `UserPromptSubmit` | Scans the user's prompt for day-talk (mentions of today, meetings, accomplishments, etc.) and injects a reminder telling Claude to append to `personal/journal/YYYY-MM-DD-DAY.md` before ending the turn. |

## Adding a hook

1. Write the script in this folder and `chmod +x` it.
2. Register it in `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "UserPromptSubmit": [
         {
           "hooks": [
             { "type": "command", "command": "bash .claude/hooks/<your-script>.sh" }
           ]
         }
       ]
     }
   }
   ```
3. Hooks get the event payload on stdin (JSON). They can emit context via stdout, which Claude Code injects into the session.
4. Never block the turn on failure — hooks should exit 0 even when their logic doesn't fire.

## Design rules

- **Keep hooks fast.** They run inline on every matching event.
- **Don't write files directly** (except logs). Emit a `<system-reminder>` telling Claude what to do; let Claude handle file writes with its normal tools.
- **Fail open.** If `jq` is missing, if stdin isn't JSON, if the script errors — exit 0 and skip. A broken hook should never block your prompts.
