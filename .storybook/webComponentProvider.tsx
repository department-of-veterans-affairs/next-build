import { useEffect, useState } from 'react'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'

const WebComponentProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    defineCustomElements()

    // load vets-website assets for storybook components
    const scriptTag = document.createElement('script')
    scriptTag.src = '/generated/static-pages.entry.js'
    scriptTag.addEventListener('load', () => setLoaded(true))
    document.body.appendChild(scriptTag)
  }, [])

  return <>{children}</>
}

export default WebComponentProvider
