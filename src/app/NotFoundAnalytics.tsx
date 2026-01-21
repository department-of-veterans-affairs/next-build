'use client'

import { useEffect } from 'react'
import { recordEvent } from '@/lib/analytics/recordEvent'

export function NotFoundAnalytics() {
  useEffect(() => {
    recordEvent({ event: 'nav-404-error' })
  }, [])

  return null
}
