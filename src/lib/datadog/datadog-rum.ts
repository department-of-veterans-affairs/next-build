'use client'

import { datadogRum } from '@datadog/browser-rum'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { isBot } from './utils/isBot'
import { parseSampleRate } from './utils/parseSampleRate'

const getDefaultConfig = () => ({
  applicationId: process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID || '',
  clientToken: process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN || '',
  site: 'ddog-gov.com',
  service: process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE || '',
  env: process.env.NEXT_PUBLIC_BUILD_TYPE || BUILD_TYPES.LOCAL,
  //  version: '1.0.0',
  sessionSampleRate:
    parseSampleRate(process.env.NEXT_PUBLIC_DATADOG_RUM_SESSION_SAMPLE_RATE) ??
    10,
  sessionReplaySampleRate: 0,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: false,
  trackAnonymousUser: true,
  enablePrivacyForActionName: true,
})

const FAMILY_CAREGIVER_CONFIG = {
  applicationId: '8eb3ffe5-db3c-49a4-88d8-506ca2f9babd',
  clientToken: 'pubd7a6c99934887d257e49455e667b1bcd',
  site: 'ddog-gov.com',
  service: 'family-and-caregiver-benefit-hub',
  env: 'production',
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 10,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
  trackAnonymousUser: true,
  enablePrivacyForActionName: true,
  defaultPrivacyLevel: 'mask-user-input',
} as const

export function initDatadogRum() {
  // Short circuit if we're not in a browser environment for the sake of the Pages Router
  if (typeof window === 'undefined') return

  if (isBot()) return

  const isFamilyCaregiverPage = window.location.pathname.includes(
    '/family-and-caregiver-benefits/'
  )
  const hasDefaultConfig =
    !!process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID &&
    !!process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN &&
    !!process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE

  if (isFamilyCaregiverPage) {
    datadogRum.init(FAMILY_CAREGIVER_CONFIG)
  } else if (hasDefaultConfig) {
    datadogRum.init(getDefaultConfig())
  }
}
