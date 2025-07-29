'use client'

import { useEffect } from 'react'
import { LeadershipListing as FormattedLeadershipListing } from '@/products/leadershipListing/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ContentFooter } from '@/templates/common/contentFooter'
import { StaffProfileTeaser } from '@/templates/components/staffProfileTeaser'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow
export function LeadershipListing({
  title,
  introText,
  menu,
  profiles,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedLeadershipListing>) {
  useEffect(() => {
    window.sideNav = menu
  })
  return (
    <div className="vads-grid-container">
      <nav aria-label="secondary" data-widget-type="side-nav" />
      <div className="vads-grid-row">
        <div className="vads-grid-col-12">
          <article className="usa-content">
            <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            />
            <h1 className="vads-u-margin-bottom--3">{title}</h1>
            <div className="va-introtext">
              <p>{introText}</p>
            </div>
            {profiles.map((profile) => (
              <StaffProfileTeaser {...profile} key={profile.id} />
            ))}
            <ContentFooter />
          </article>
        </div>
      </div>
    </div>
  )
}
