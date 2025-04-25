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
      className="va-c-facility-sidebar vads-u-padding-left--2 desktop:vads-u-padding-x--0"
    >
      <div>
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
          {link.label}
        </h4>
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
