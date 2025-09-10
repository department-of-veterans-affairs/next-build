import { canInitDatadogApm } from './datadogConnector/utils/canInitDatadogApm'
export async function register() {
  if (canInitDatadogApm()) {
    await import('./datadogConnector/DatadogApmConnector')
  }
}
