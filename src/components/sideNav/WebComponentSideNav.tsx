import React from 'react'
import { SideNavItem, SideNavMenu } from '@/types/formatted/sideNav'
// I don't think this will work until web components loading is cleaned up. I've started
// that process in another PR. I think the problem might be that this is working off an
// older version of the component library bundle.
// import {
//   VaSideNav,
//   VaSideNavItem,
//   VaSideNavSubmenu,
// } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { SideNavMenuIcon } from './formatted-type'

interface WebComponentSideNavProps {
  menu: SideNavMenu
  icon?: SideNavMenuIcon | null
}

export function WebComponentSideNav({ menu, icon }: WebComponentSideNavProps) {
  const renderLink = (link: SideNavItem) =>
    link.links.length > 0 ? (
      <va-sidenav-submenu
        key={link.url.path}
        href={link.url.path}
        label={link.label}
        onClick={() => {}}
      >
        {link.links.map(renderLink)}
      </va-sidenav-submenu>
    ) : (
      <va-sidenav-item
        key={link.url.path}
        href={link.url.path}
        label={link.label}
        onClick={() => {}}
      ></va-sidenav-item>
    )

  return (
    <div className="vads-grid-col-3">
      <va-sidenav
        header="Profile"
        icon-background-color={
          icon ? `vads-color-${icon.backgroundColor}` : undefined
        }
        icon-name={icon?.name}
      >
        {menu.data.links.map(renderLink)}
      </va-sidenav>
    </div>
  )
}
