'use client'
import { datadogRum } from '@datadog/browser-rum'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { isBot } from './utils/canInitDatadog'

interface FamilyCaregiverDatadogRumProps {
  entityPath?: string
}

const FamilyCaregiverDatadogRum = ({
  entityPath,
}: FamilyCaregiverDatadogRumProps) => {
  const pathname = usePathname()

  useEffect(() => {
    // Check if we're on a family and caregiver benefits page
    const isOnFamilyCaregiverPage =
      entityPath?.includes('/family-and-caregiver-benefits/') ||
      pathname?.includes('/family-and-caregiver-benefits/')

    if (!isOnFamilyCaregiverPage) {
      datadogRum.stopSession()
      return
    }

    const initDDRum = () => {
      datadogRum.init({
        applicationId: '8eb3ffe5-db3c-49a4-88d8-506ca2f9babd',
        clientToken: 'pubd7a6c99934887d257e49455e667b1bcd',
        site: 'ddog-gov.com',
        service: 'family-and-caregiver-benefit-hub',
        env: 'production',
        version: '1.0.0',
        silentMultipleInit: true, // silently ignore multiple inits
        sessionSampleRate: 10,
        sessionReplaySampleRate: 10,
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
        trackAnonymousUser: true,
        enablePrivacyForActionName: true,
        defaultPrivacyLevel: 'mask-user-input',
      })

      // Start session replay recording
      datadogRum.startSessionReplayRecording()
    }

    // Only initialize if not a bot and on production hostname
    const canInit =
      !isBot() &&
      typeof window !== 'undefined' &&
      (window.location?.hostname === 'www.va.gov' ||
        window.location?.hostname === 'localhost')

    if (canInit) {
      initDDRum()
    }
  }, [entityPath, pathname])

  return null
}

export default FamilyCaregiverDatadogRum
