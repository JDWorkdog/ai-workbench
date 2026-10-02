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
