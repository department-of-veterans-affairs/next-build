import React, { useEffect } from 'react'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'

const WebComponentProvider = ({ children }) => {
  useEffect(() => {
    defineCustomElements()
  }, [])

  return <>{children}</>
}

export default WebComponentProvider
