import React from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import clsx from 'clsx'
import { SideNav } from '@/components/sideNav/template'
import { SideNavMenuIcon } from '@/components/sideNav/formatted-type'

interface SideNavLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  menu: SideNavMenu | null
  menuIcon?: SideNavMenuIcon | null
  useWidget?: boolean
}

export function SideNavLayout({
  menu,
  menuIcon,
  useWidget = true,
  children,
  className,
  ...props
}: SideNavLayoutProps) {
  return (
    <div className={clsx('vads-grid-container', className)} {...props}>
      <div
        className={clsx(
          menu &&
            !useWidget &&
            'va-sidebarnav-wrapper vads-grid-row vads-u-flex-wrap--nowrap'
        )}
      >
        {menu && <SideNav menu={menu} icon={menuIcon} useWidget={useWidget} />}
        <div className="vads-grid-row">
          <div className="vads-grid-col-12">{children}</div>
        </div>
      </div>
    </div>
  )
}
