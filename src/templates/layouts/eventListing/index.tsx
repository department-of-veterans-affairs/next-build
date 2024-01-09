/**
 * ### Overview
 * Event Listing represents the collection pages for Events within a facility.
 *
 * Event Listing expects data of type {@link FormattedEventListing}.
 *
 * ### Examples
 * @see https://va.gov/butler-health-care/events/
 *
 */
import { useEffect } from 'react'
import { EventListing as FormattedEventListing } from '@/types/formatted/eventListing'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function EventListing({
  title,
  introText,
  events,
  menu,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedEventListing>) {
  // Add data to the window object for the sidebar widget
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <>
      <div
        key={'foo'}
        className="usa-grid usa-grid-full vads-u-padding-bottom--3"
      >
        {/* Widget coming from vets-website */}
        <nav
          data-template="navigation/facility_sidebar_nav"
          aria-label="secondary"
          data-widget-type="side-nav"
        ></nav>

        <div className="events vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5 medium-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
          <LovellSwitcher
            currentVariant={lovellVariant}
            switchPath={lovellSwitchPath}
          />

          <h1 id="article-heading">{title}</h1>
          <div className="va-introtext">
            {introText && (
              <p className="events-show" id="office-events-description">
                {introText}
              </p>
            )}
          </div>
        </div>

        {/* Events widget coming from vets-website */}
        <div data-widget-type="events"></div>
      </div>

      <div className="usa-grid usa-grid-full">
        <ContentFooter />
      </div>
    </>
  )
}
