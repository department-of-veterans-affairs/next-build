import { useEffect, useState } from 'react'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
import { HeaderFooterData } from '@/types/formatted/headerFooter'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  VetsGov?: {
    headerFooter?: HeaderFooterData
  }
}
declare const window: customWindow

// This wrapper allows us to render components from VADS/vets-website inside next-build storybook.
// I moved this file here so it could be conditionally loaded to stories that need it.
// Currently it is added to every story via global decorator in .storybook/preview.tsx
// TODO: figure out if there's a better way to handle all of this so that web components "just work"
const WebComponentProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    defineCustomElements()

    // Without this, errors thrown on any web-component page except for wrapper.stories.tsx,
    // which has the div in its template already
    if (!window.location.href.includes('layouts-wrapper')) {
      window.VetsGov = {}
      window.VetsGov.headerFooter = {
        footerData: [],
        megaMenuData: [],
      }

      const emptyFooter = document.createElement('div')
      emptyFooter.id = 'footerNav'
      // @ts-expect-error custom data attr doesn't exist on HTMLDivElement
      emptyFooter.dataMinimalFooter = 'false'
      emptyFooter.style.display = 'none' // so the fake footer isn't visible. (:
      document.body.appendChild(emptyFooter)
    }

    // Load vets-website assets for storybook components
    const scriptTag = document.createElement('script')
    scriptTag.src = '/generated/static-pages.entry.js'
    scriptTag.addEventListener('load', () => setLoaded(true))
    document.body.appendChild(scriptTag)
  }, [])

  return <>{children}</>
}

export default WebComponentProvider
