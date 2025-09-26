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
  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div className={clsx('vads-grid-container', className)} {...props}>
      {/* Nav data filled in by a separate script from `window.sideNav` */}
      <nav aria-label="secondary" data-widget-type="side-nav" />
      <div className="vads-grid-row">
        <div className="vads-grid-col-12">{children}</div>
      </div>
    </div>
  )
}
