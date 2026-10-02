export type TurnStamp = string

declare module 'claude-code' {
  interface PluginState {
    'turn-timestamp': { last: TurnStamp | null }
  }
}
