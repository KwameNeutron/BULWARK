import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionUsage } from 'claude-code'

import type { Warning } from '../types'

// Past this share of a rate limit the meter warns.
export const LIMIT_WARN = 80

const warning = atom({ plugin: 'cost-meter', key: 'warning' } as const, null as Warning)
// Windows already announced by toast, so the alert fires once per crossing.
const alerted = atom({ plugin: 'cost-meter', key: 'alerted' } as const, [] as string[])

const LABELS: Record<string, string> = { five_hour: '5h', seven_day: 'wk' }

const label = (kind: string) => LABELS[kind] ?? kind.replace(/_/g, ' ')

export const meterParts = (usage: SessionUsage) => {
  const parts: string[] = []
  if (usage.cost) parts.push(`$${usage.cost.usd.toFixed(2)}`)
  if (usage.context.percent !== undefined) parts.push(`ctx ${Math.round(usage.context.percent)}%`)
  for (const limit of usage.rateLimits) parts.push(`${label(limit.kind)} ${Math.round(limit.percentUsed)}%`)

  const worst = usage.rateLimits.reduce<SessionUsage['rateLimits'][number] | undefined>(
    (top, limit) => (top && top.percentUsed >= limit.percentUsed ? top : limit),
    undefined,
  )
  const over: Warning =
    worst && worst.percentUsed > LIMIT_WARN ? { label: label(worst.kind), percent: Math.round(worst.percentUsed) } : null
  const overKinds = usage.rateLimits.filter(l => l.percentUsed > LIMIT_WARN).map(l => l.kind)

  return { text: parts.join(' · '), over, overKinds }
}

const refresh = async ($: EngineInterface) => {
  const { text, over, overKinds } = meterParts(await $.session.usage())

  // The band above the prompt draws only on terminal and desktop, so the
  // status line carries the warning too (it reaches mobile as well).
  $.ui.status(text === '' ? undefined : over ? `⚠ ${text}` : text)
  await update($, warning, () => over)

  const seen = await read($, alerted)
  const fresh = overKinds.filter(k => !seen.includes(k))
  if (fresh.length > 0 && over) {
    $.ui.toast(`cost-meter: ${over.label} limit at ${over.percent}%`, { timeoutMs: 8000 })
  }
  // Drop windows that fell back under, so a later crossing alerts again.
  await update($, alerted, () => overKinds)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    $.ui.toast('cost-meter loaded') // Diagnostic: remove once the meter is confirmed on screen.
    await refresh($)

    return started
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    await refresh($)

    return done
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const over = await read($, warning)
    if (e.props.hasSurvey || over === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box backgroundColor="red" paddingX={1}>
        <Text color="white" bold>
          {over.label} rate limit at {over.percent}%
        </Text>
      </Box>
    )
  })
}
