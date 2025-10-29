import React from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import clsx from 'clsx'
import { SideNav } from '@/components/sideNav/template'

interface SideNavLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  menu: SideNavMenu
}

export function SideNavLayout({
  menu,
  children,
  className,
  ...props
}: SideNavLayoutProps) {
  return (
    <div className={clsx('vads-grid-container', className)} {...props}>
      <SideNav menu={menu} />
      <div className="vads-grid-row">
        <div className="vads-grid-col-12">{children}</div>
      </div>
    </div>
  )
}
