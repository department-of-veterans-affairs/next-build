/**
 * ### Overview
 * Press Release Listing represents the collection pages for News Stories in a facility.
 *
 * Press Release Listing expects data of type {@link FormattedPressReleaseListing}.
 *
 * ### Examples
 * @see https://www.va.gov/milwaukee-health-care/news-releases/
 * @see https://www.va.gov/bronx-health-care/news-releases/
 *
 */

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { PressReleaseListing as FormattedPressReleaseListing } from '@/types/formatted/pressReleaseListing'
import { PressReleaseTeaser as FormattedPressReleaseTeaser } from '@/types/formatted/pressRelease'
import { PressReleaseTeaser } from '@/templates/components/pressReleaseTeaser'
import { ContentFooter } from '@/templates/common/contentFooter'
import { useEffect } from 'react'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function PressReleaseListing({
  id,
  title,
  introText,
  releases,
  menu,
  currentPage,
  totalPages,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedPressReleaseListing>) {
  // Add data to the window object for the sidebar widget
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  const pressReleaseTeasers =
    releases?.length > 0 ? (
      releases?.map((story: FormattedPressReleaseTeaser) => (
        <li key={story.id}>
          <PressReleaseTeaser {...story} />
        </li>
      ))
    ) : (
      <li className="clearfix-text">No stories at this time.</li>
    )

  return (
    <div key={id} className="usa-grid usa-grid-full">
      {/* Widget coming from vets-website */}
      <nav
        data-template="navigation/facility_sidebar_nav"
        aria-label="secondary"
        data-widget-type="side-nav"
      ></nav>
      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <LovellSwitcher
            currentVariant={lovellVariant}
            switchPath={lovellSwitchPath}
          />
          <h1 id="article-heading">{title}</h1>
          <div className="vads-l-grid-container--full">
            <div className="va-introtext">
              {introText &&
              <p className="events-show" id="office-events-description">{introText}</p>}
            </div>
            {}
          </div>
        </article>
      </div>
    </div>
  )
}
