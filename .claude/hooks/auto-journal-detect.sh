#!/usr/bin/env bash
# UserPromptSubmit hook — detects day-talk in the user's prompt and reminds
# Claude to append to today's journal before ending the turn.
#
# Claude Code passes the user's prompt to this hook via JSON on stdin:
#   {"prompt": "...", ...}
# We emit context to stdout, which Claude Code injects into the session.
# Exit non-zero ONLY on genuine error — we must never block the turn.

set -u

# Read stdin; tolerate non-JSON or missing jq by falling back to the raw body.
raw=$(cat || true)

prompt=""
if command -v jq >/dev/null 2>&1; then
  prompt=$(printf '%s' "$raw" | jq -r '.prompt // empty' 2>/dev/null || true)
fi
if [ -z "$prompt" ]; then
  prompt="$raw"
fi

# Day-talk keyword match (case-insensitive).
pattern='\b(today|this morning|this afternoon|yesterday|just finished|just shipped|wrapped up|meeting with|standup|1:?1|accomplished|completed|working on|kicked off|kicking off|heads down|blocked on|stuck on)\b'

if printf '%s' "$prompt" | grep -qiE "$pattern"; then
  date_str=$(date +%Y-%m-%d)
  day_str=$(date +%a | tr '[:lower:]' '[:upper:]')
  journal_file="personal/journal/${date_str}-${day_str}.md"
  cat <<EOF
<system-reminder>
Auto-journal hint: the user's prompt reads like day-talk. Per workspace convention, append any accomplishments, tasks, meetings, or plans you extract from this turn to \`${journal_file}\`. Create the file with the standard header if it doesn't exist. If a project context is active, write to that project's journal folder instead.
</system-reminder>
EOF
fi

exit 0
