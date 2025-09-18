export const canInitDatadogApm = (): boolean =>
  process.env.NEXT_RUNTIME === 'nodejs' &&
  process.env.DD_TRACE_ENABLED === 'true'
