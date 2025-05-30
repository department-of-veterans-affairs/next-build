import { useEffect } from 'react'
import { LeadershipListing as FormattedLeadershipListing } from '@/types/formatted/leadershipListing'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ContentFooter } from '@/templates/common/contentFooter'
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow
export function LeadershipListing({
  title,
  introText,
  menu,
}: FormattedLeadershipListing) {
  useEffect(() => {
    window.sideNav = menu
  })
  return (
    <div className="interior" id="content">
      <div className="usa-grid usa-grid-full">
        <nav aria-label="secondary" data-widget-type="side-nav" />
        <div className="usa-width-three-fourths">
          <article>
            <div>*TODO Lovell Switch*</div>
            <h1 className="vads-u-margin-bottom--3">{title}</h1>
            <div className="va-introtext">
              <p>{introText}</p>
            </div>
            <div>*TODO Staff Profile teasers*</div>
            <ContentFooter />
          </article>
        </div>
      </div>
    </div>
  )
}
