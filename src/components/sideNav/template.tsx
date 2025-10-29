import React, { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'

interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

interface SideNavProps {
  menu: SideNavMenu
}

export function SideNav({ menu }: SideNavProps) {
  // Populate the side nav data for the side nav widget to fill in. The side nav widget
  // is a "React widget" from the `static-pages` "app" in `vets-website`. It is not part
  // of next-build. We load our data into `window.sideNav`, and that app reads it and
  // renders the widget into our `[data-widget-type="side-nav"]` element.
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return <nav aria-label="secondary" data-widget-type="side-nav" />
}
