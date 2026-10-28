import { expect, test } from 'claude-code/testing'

import { meterParts } from './register'

const BAND = {
  plugin: 'cost-meter',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
} as const

const usage = (fiveHour: number) => ({
  startedAt: 0,
  context: { window: 200000, percent: 18 },
  rateLimits: [
    { kind: 'five_hour', percentUsed: fiveHour },
    { kind: 'seven_day', percentUsed: 40 },
  ],
  cost: { usd: 1.234 },
})

test('the meter line reads cost, context and limits', async () => {
  const { text, over } = meterParts(usage(12) as never)
  expect(text).toBe('$1.23 · ctx 18% · 5h 12% · wk 40%')
  expect(over).toBe(null)
})

test('past 80% the band turns red and the line warns', async ($, on) => {
  const statuses: (string | undefined)[] = []
  on('session.usage', () => ({ value: usage(85) }))
  on('ui.status', (_, e) => {
    statuses.push(e.text)
    return { value: undefined }
  })
  on('ui.toast', () => ({ value: undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  expect(statuses.at(-1)).toBe('⚠ $1.23 · ctx 18% · 5h 85% · wk 40%')

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /5h rate limit at 85%/ }))?.text).toBeDefined()
  await ui.unmount()
})
