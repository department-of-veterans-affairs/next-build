import { canInitDatadogApm } from './datadogConnector/utils/canInitDatadogApm'
export async function register() {
  await import('./datadogConnector/DatadogApmConnector')
}
