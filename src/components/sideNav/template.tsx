import React from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { WidgetSideNav } from './WidgetSideNav'
import { WebComponentSideNav } from './WebComponentSideNav'
import { SideNavMenuIcon } from './formatted-type'

interface SideNavProps {
  menu: SideNavMenu
  icon?: SideNavMenuIcon | null
  useWidget?: boolean
}

export function SideNav({ menu, icon, useWidget = true }: SideNavProps) {
  if (useWidget) {
    return <WidgetSideNav menu={menu} />
  }

  return <WebComponentSideNav menu={menu} icon={icon} />
}
