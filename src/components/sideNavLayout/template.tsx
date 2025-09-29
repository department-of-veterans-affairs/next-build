import React, { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import clsx from 'clsx'

interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

interface SideNavLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  menu: SideNavMenu
}

export function SideNavLayout({
  menu,
  children,
  className,
  ...props
}: SideNavLayoutProps) {
  // Populate the side nav data for the side nav widget to fill in. The side nav widget
  // is a "React widget" from the `static-pages` "app" in `vets-website`. It is not part
  // of next-build. We load our data into `window.sideNav`, and that app reads it and
  // renders the widget into our `[data-widget-type="side-nav"]` element.
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div className={clsx('vads-grid-container', className)} {...props}>
      {/* See comment above for more details about the side nav widget */}
      <nav aria-label="secondary" data-widget-type="side-nav" />
      <div className="vads-grid-row">
        <div className="vads-grid-col-12">{children}</div>
      </div>
    </div>
  )
}
