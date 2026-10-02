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
