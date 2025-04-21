import React from 'react'
import { getLovellVariantOfUrl } from '@/lib/drupal/lovell/utils'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

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
  lovellVariant?: LovellChildVariant
}

const StaffProfileSideBarNav: React.FC<SidebarNavProps> = ({
  sidebarData,
  lovellVariant,
}) => {
  const { link, parent } = sidebarData

  return (
    <nav
      aria-label="Secondary"
      data-template="navigation/facility_no_drupal_page_sidebar_nav"
      id="va-detailpage-sidebar"
      data-drupal-sidebar
      className="va-c-facility-sidebar usa-width-one-fourth va-sidebarnav"
    >
      <div>
        <div className="left-side-nav-title">
          <h4>{link.label}</h4>
        </div>
        <p className="vads-u-margin-y--0">
          <va-link
            data-testid="sidebar-nav-link"
            href={
              lovellVariant
                ? getLovellVariantOfUrl(parent.url.path, lovellVariant)
                : parent.url.path
            }
            text={parent.label}
            back
          />
        </p>
      </div>
    </nav>
  )
}

export default StaffProfileSideBarNav
