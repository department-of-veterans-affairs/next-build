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
import { EventListing as FormattedEventListing } from '@/products/eventListing/formatted-type'
import { EventWidgetTeaser } from '@/products/event/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
  allEventTeasers?: {
    entities: EventWidgetTeaser[]
  }
}
declare const window: customWindow

export function EventListing({
  title,
  id,
  introText,
  events,
  menu,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedEventListing>) {
  // Add data to the window object for the sidebar & event widgets
  useEffect(() => {
    window.sideNav = menu

    // This populates the whole events widget.
    window.allEventTeasers = { entities: events }
  }, [menu, events])

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-min-height--full-screen">
      <div className="vads-u-flex--1">
        <div key={id} className="vads-grid-container vads-u-padding-bottom--3">
          {menu && (
            <nav
              data-template="navigation/facility_sidebar_nav"
              aria-label="secondary"
              data-widget-type="side-nav"
            ></nav>
          )}

          <div className="events vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5 tablet:vads-u-padding-x--0 vads-u-padding-bottom--2">
            <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            />
            <h1 id="article-heading">{title}</h1>
            {introText && (
              <div className="va-introtext">
                <p id="office-events-description">{introText}</p>
              </div>
            )}
          </div>

          <div data-widget-type="events"></div>
        </div>
      </div>

      <div className="vads-u-flex--0">
        <div className="vads-grid-container">
          <ContentFooter />
        </div>
      </div>
    </div>
  )
}
