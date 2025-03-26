import { useEffect } from 'react'
import { LeadershipListing as FormattedLeadershipListing } from '@/types/formatted/leadershipListing'
import PersonProfileTeaser from '@/templates/components/personProfileTeaser'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ContentFooter } from '@/templates/common/contentFooter'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}

declare const window: customWindow

/**
 * Staff images and details with a left sidebar.
 */
export function LeadershipListing({
  introText,
  leadership,
  menu,
  title,
}: FormattedLeadershipListing) {
  useEffect(() => {
    window.sideNav = menu
  })

  return (
    <div className="usa-grid usa-grid-full">
      <nav aria-label="secondary" data-widget-type="side-nav" />
      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <h1 className="vads-u-margin-bottom--3">{title}</h1>
          {introText &&
            <div className="va-introtext vads-u-padding-bottom--2p5">
              {introText}
            </div>
          }
          {leadership?.length && leadership.map((leader, index) => (
            <PersonProfileTeaser
              key={index}
              {...leader}
              office={leader.office?.title || ''}
            />
          ))}
        </article>
        <ContentFooter />
      </div>
    </div>
  )
}
