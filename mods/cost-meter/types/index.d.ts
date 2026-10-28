export type Warning = { label: string; percent: number } | null

declare module 'claude-code' {
  interface PluginState {
    'cost-meter': { warning: Warning; alerted: string[] }
  }
}
