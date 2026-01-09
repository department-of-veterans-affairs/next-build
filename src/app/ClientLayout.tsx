'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
import { TAG_MANAGER_ARGS, pageview } from '@/lib/analytics'
import TagManager from 'react-gtm-module'
import DatadogRumConnector from '@/datadogConnector/DatadogRumConnector'
import FamilyCaregiverDatadogRum from '@/datadogConnector/FamilyCaregiverDatadogRum'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    TagManager.initialize(TAG_MANAGER_ARGS)
    defineCustomElements()
  }, [])

  useEffect(() => {
    // Track pageview on route change
    if (pathname) {
      pageview(pathname)
    }
  }, [pathname])

  return (
    <>
      <DatadogRumConnector />
      <FamilyCaregiverDatadogRum entityPath={pathname || '/'} />
      {children}
    </>
  )
}
