import React from 'react'

import { recordEvent } from '@/lib/analytics/recordEvent'

type Link = {
  url: { path: string }
  label: string
  links?: Link[]
}

type SidebarData = {
  link: { label: string; links?: Link[] }
  parent: { url: { path: string }; label: string }
}

type SidebarNavProps = {
  sidebarData: SidebarData
  entityUrlPath?: string
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  sidebarData,
  entityUrlPath,
}) => {
  const { link, parent } = sidebarData
  const deepLinks = link.links || []

  return (
    <nav
      aria-label="Secondary"
      data-template="navigation/facility_no_drupal_page_sidebar_nav"
      id="va-detailpage-sidebar"
      data-drupal-sidebar
      className="va-c-facility-sidebar usa-width-one-fourth va-sidebarnav"
    >
      <div>
        <button
          className="va-btn-close-icon va-sidebarnav-close"
          type="button"
          aria-label="Close this menu"
        ></button>
        <div className="left-side-nav-title">
          <h4>{link.label}</h4>
        </div>
        <div className="sidenav-previous-page">
          <a href={parent.url.path}>{parent.label}</a>
        </div>
        {deepLinks.length > 0 && (
          <ul className="usa-sidenav-list">
            {deepLinks.map((linkItem) => (
              <li
                key={linkItem.url.path}
                className={
                  entityUrlPath === linkItem.url.path ? 'active-level' : ''
                }
              >
                <a
                  href={linkItem.url.path}
                  className={
                    entityUrlPath === linkItem.url.path ? 'usa-current' : ''
                  }
                  onClick={() => recordEvent({ event: 'nav-sidenav' })}
                >
                  {linkItem.label}
                </a>
                {linkItem.links && linkItem.links.length > 0 && (
                  <ul className="usa-sidenav-sub_list">
                    {linkItem.links.map((subLink) => (
                      <li key={subLink.url.path}>
                        <a
                          href={subLink.url.path}
                          className={
                            entityUrlPath === subLink.url.path
                              ? 'usa-current'
                              : ''
                          }
                          onClick={() => recordEvent({ event: 'nav-sidenav' })}
                        >
                          {subLink.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}

export default SidebarNav
