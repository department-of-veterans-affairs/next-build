import { datadogRum } from '@datadog/browser-rum'

datadogRum.init({
  applicationId: '8845ff93-4fad-4547-86f0-b8ce1ad6bf3b',
  clientToken: 'pube6808760cc4b1fe50945959d7d9f14a9',
  // `site` refers to the Datadog site parameter of your organization
  // see https://docs.datadoghq.com/getting_started/site/
  site: 'ddog-gov.com',
  //  service: 'my-web-application',
  //  env: 'production',
  //  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
  enablePrivacyForActionName: true,
})
