import { canInitDatadogApm } from './datadogConnector/utils/canInitDatadogApm'
export async function register() {
  await import('./datadogConnector/DatadogApmConnector')
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}
