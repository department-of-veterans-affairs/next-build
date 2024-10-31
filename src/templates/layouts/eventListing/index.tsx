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
import { EventWidgetTeaser } from '@/types/formatted/event'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
  pastEvents?: {
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

    // This populates the whole events widget, even upcoming events. IDK!
    window.pastEvents = { entities: events }
  }, [menu, events])

  return (
    <>
      <div key={id} className="usa-grid usa-grid-full vads-u-padding-bottom--3">
        {/* Widget coming from vets-website */}
        {menu && <nav aria-label="secondary" data-widget-type="side-nav"></nav>}

        <div className="events vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5 medium-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
          <LovellSwitcher
            currentVariant={lovellVariant}
            switchPath={lovellSwitchPath}
          />

          <h1 id="article-heading">{title}</h1>
          <div className="va-introtext">
            {introText && <p id="office-events-description">{introText}</p>}
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
