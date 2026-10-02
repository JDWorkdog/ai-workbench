import type { Register } from 'claude-code'

// Formats the local wall-clock time as "Fri Oct 2, 2026 at 3:42:07 PM (EDT)".
// Falls back to the TZ env var when the module's sandbox has no local zone.
function stamp(ms: number, timeZone: string | undefined): string {
  const d = new Date(ms)
  try {
    const f = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
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

    // Subagent turns end inside the main turn; only stamp the main answer.
    if (e.agentId !== undefined) return result

    const now = await $.clock.now()
    const tz = await $.env.get('TZ')
    const label =
      e.reason === 'answer'
        ? 'Completed'
        : e.reason === 'aborted'
          ? 'Interrupted'
          : e.reason === 'error'
            ? 'Ended with error'
            : 'Refused'

    return { ...result, text: `${label} ${stamp(now, tz)}` }
  })
}
