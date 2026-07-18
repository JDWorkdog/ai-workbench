#!/bin/sh
# Keep the Codex skill mirror (.agents/skills/) synchronized with the
# canonical skill library (.claude/skills/). Claude is canonical for every
# skill in this kit: edit under .claude/skills/, then run this script.
# Never hand-edit .agents/skills/.
#
# Usage: scripts/sync-codex-skills.sh [--check|--write]
set -eu

WS_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CANON="$WS_ROOT/.claude/skills"
MIRROR="$WS_ROOT/.agents/skills"
MODE="${1:---write}"

skills() {
  for dir in "$CANON"/*/; do
    [ -d "$dir" ] || continue
    basename "$dir"
  done
}

case "$MODE" in
  --check)
    status=0
    for name in $(skills); do
      if ! diff -rq "$CANON/$name" "$MIRROR/$name"; then
        status=1
      fi
    done
    if [ -d "$MIRROR" ]; then
      for dir in "$MIRROR"/*/; do
        [ -d "$dir" ] || continue
        name="$(basename "$dir")"
        if [ ! -d "$CANON/$name" ]; then
          echo "Orphan mirror skill (no canonical source): .agents/skills/$name" >&2
          status=1
        fi
      done
    fi
    [ "$status" -eq 0 ] && echo "Skill mirrors are identical."
    exit "$status"
    ;;
  --write)
    mkdir -p "$MIRROR"
    for name in $(skills); do
      # --checksum: compare by content, not size+mtime, so a fresh checkout
      # with normalized timestamps can never skip a real difference.
      rsync -a --checksum --delete "$CANON/$name/" "$MIRROR/$name/"
    done
    for dir in "$MIRROR"/*/; do
      [ -d "$dir" ] || continue
      name="$(basename "$dir")"
      if [ ! -d "$CANON/$name" ]; then
        rm -rf "$dir"
        echo "Removed orphan mirror skill: .agents/skills/$name"
      fi
    done
    if ! "$0" --check >/dev/null; then
      echo "ERROR: mirror verification failed after write. Run '$0 --check' for details." >&2
      exit 1
    fi
    echo "Skill mirrors were synchronized and verified."
    ;;
  *)
    echo "Usage: $0 [--check|--write]" >&2
    exit 2
    ;;
esac
