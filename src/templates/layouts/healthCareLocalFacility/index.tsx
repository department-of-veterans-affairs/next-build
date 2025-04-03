import { useEffect } from 'react'

import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'
import { SideNavMenu } from '@/types/formatted/sideNav'

import { LocationServices } from './LocationServices'
import { HealthServices } from './HealthServices'
import { TopTasks } from '@/templates/components/topTasks'
import { OperatingStatusFlags } from './OperatingStatus'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function HealthCareLocalFacility({
  title,
  introText,
  operatingStatusFacility,
  menu,
  path,
  administration,
  vamcEhrSystem,
}: FormattedHealthCareLocalFacility) {
  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  })

  return (
    <div className="interior" id="content">
      <div className="usa-grid usa-grid-full">
        {/* Nav data fille in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        <div className="usa-width-three-fourths">
          <article className="usa-content va-l-facility-detail">
            <div>TODO: Lovell switch link</div>

            {title && <h1>{title}</h1>}

            {introText && (
              <div className="va-introtext">
                <p>{introText}</p>
              </div>
            )}

            <TopTasks
              path={path}
              administration={administration}
              vamcEhrSystem={vamcEhrSystem}
            />

            <va-on-this-page></va-on-this-page>

            {/* Main content */}
            <h2
              id="location-and-contact-information"
              className="vads-u-margin-bottom--3"
            >
              Location and contact information
            </h2>
            <div className="region-list usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row facility vads-u-margin-bottom--4">
              <div className="usa-width-two-thirds">
                <div>
                  <OperatingStatusFlags
                    operatingStatusFacility={operatingStatusFacility}
                    menu={menu}
                  />
                  <section>
                    <script type="application/ld+json">
                      {/* TODO: Fill this in */}
                    </script>

                    <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                      Address
                    </h3>
                    <div>TODO: Address stuff</div>

                    <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                      Phone numbers
                    </h3>
                    <div>TODO: Phone numbers</div>
                    <div>TODO: Office hours</div>
                  </section>
                </div>
              </div>
              <div>TODO: Image and static map</div>
            </div>
            <LocationServices />
            <div>TODO: List of links section</div>
            <HealthServices />
            <div>TODO: Patient satisfaction scores section</div>
            <div>TODO: Social links section</div>
            <va-back-to-top></va-back-to-top>
            <div>TODO: Last updated & feedback button</div>
          </article>
        </div>
      </div>
    </div>
  )
}
