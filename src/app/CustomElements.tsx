'use client'

import { useEffect } from 'react'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'

export function CustomElements() {
  useEffect(() => {
    defineCustomElements()
  }, [])

  return null
}
