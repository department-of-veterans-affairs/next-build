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
import { EventListing as FormattedEventListing } from './formatted-type'
import { EventWidgetTeaser } from '@/components/eventTeaser/formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  allEventTeasers?: {
    entities: EventWidgetTeaser[]
  }
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
  // Add data to the window object for event widgets
  useEffect(() => {
    window.allEventTeasers = { entities: events }
  }, [events])

  return (
    <SideNavLayout menu={menu}>
      <LovellSwitcher
        currentVariant={lovellVariant}
        switchPath={lovellSwitchPath}
      />

      <h1 id="article-heading">{title}</h1>
      <div className="va-introtext">{introText && <p>{introText}</p>}</div>

      {/* Events widget coming from vets-website */}
      <div data-widget-type="events" className="clearfix"></div>

      <ContentFooter />
    </SideNavLayout>
  )
}
