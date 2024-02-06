import { useEffect } from 'react'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'

const WebComponentProvider = ({ children }) => {
  useEffect(() => {
    defineCustomElements()
  }, [])

  return (
    <>
      {children}
      <script src="/generated/static-pages.entry.js"></script>
    </>
  )
}

export default WebComponentProvider
