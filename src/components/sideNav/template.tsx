import React from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { WidgetSideNav } from './WidgetSideNav'
import { CustomSideNav } from './CustomSideNav'
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

  return <CustomSideNav menu={menu} icon={icon} />
}
