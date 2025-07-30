'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
import { TAG_MANAGER_ARGS, pageview } from '@/lib/analytics'
import TagManager from 'react-gtm-module'
import DatadogRumConnector from '@/datadogConnector/DatadogRumConnector'

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    TagManager.initialize(TAG_MANAGER_ARGS)
    defineCustomElements()
  }, [])

  useEffect(() => {
    pageview(pathname)
  }, [pathname])

  return (
    <>
      <DatadogRumConnector />
      {children}
    </>
  )
}

export function reportWebVitals(metric: object) {
  // eslint-disable-next-line no-console
  // console.log(metric)
}
