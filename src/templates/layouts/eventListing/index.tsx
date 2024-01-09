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
import { useEffect } from "react"
import { EventListing as FormattedEventListing } from '@/types/formatted/eventListing';
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow


export function EventListing({ title, events, menu, lovellVariant, lovellSwitchPath }: LovellStaticPropsResource<FormattedEventListing>) {
  // Add data to the window object for the sidebar widget
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div>
      <h1>EVENT LISTING</h1>
      <p>{title}</p>

      {/* Widget coming from vets-website */}
      <nav
        data-template="navigation/facility_sidebar_nav"
        aria-label="secondary"
        data-widget-type="side-nav"
      ></nav>

      {events}
    </div>

    // <div className="interior vads-u-padding-bottom--3" id="content">
    //   <main className="va-l-detail-page va-facility-page">
    //     <div className="usa-grid usa-grid-full">
    //       <div className="events vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5 medium-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
    //         <h1 id="article-heading">{title}</h1>
    //         <div className="va-introtext">
    //           {fieldIntroText && (
    //             <p className="events-show" id="office-events-description">
    //               {fieldIntroText}
    //             </p>
    //           )}
    //         </div>
    //       </div>
    //       <div data-widget-type="events"></div>
    //     </div>
    //   </main>
    //   <div className="usa-grid usa-grid-full">
    //     <div className="last-updated vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
    //       <div className="vads-u-display--flex above-footer-elements-container">
    //         <div className="vads-u-flex--1 vads-u-text-align--right">
    //           <span className="vads-u-text-align--right">

    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
