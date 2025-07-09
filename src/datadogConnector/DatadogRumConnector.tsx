'use client'
import { datadogRum } from '@datadog/browser-rum'
import { useEffect } from 'react'
import { BUILD_TYPES } from '@/lib/constants/environment'
import { canInitDatadog } from '@/datadogConnector/utils/canInitDatadog'

const DatadogRumConnector = () => {
  useEffect(() => {
    const initDDRum = () => {
      datadogRum.init({
        applicationId: process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID || '',
        clientToken: process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN || '',
        site: 'ddog-gov.com',
        service: process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE || '',
        env: process.env.NEXT_PUBLIC_BUILD_TYPE || BUILD_TYPES.LOCAL,
        //  version: '1.0.0',
        silentMultipleInit: true, // silently ignore multiple inits
        sessionSampleRate:
          Number(process.env.NEXT_PUBLIC_DATADOG_RUM_SESSION_SAMPLE_RATE) || 10,
        sessionReplaySampleRate: 0,
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: false,
        trackAnonymousUser: true,
        enablePrivacyForActionName: true,
      })
    }

    if (canInitDatadog()) {
      initDDRum()
    }
  }, [])

  return <></>
}

export default DatadogRumConnector
