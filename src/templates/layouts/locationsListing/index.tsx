import { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { RegionalTopTasks } from '@/templates/components/topTasks'
import { LocationsListing as FormattedLocationsListing } from '@/types/formatted/locationsListing'

interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function LocationsListing({
  title,
  menu,
  vamcEhrSystem,
  administration,
  path,
}: FormattedLocationsListing) {
  useEffect(() => {
    window.sideNav = menu
  }, [menu])
  return (
    <div className="interior" id="content">
      <main className="va-l-detail-page va-facility-page">
        <div className="usa-grid usa-grid-full">
          {/* Sidebar Navigation */}
          <nav aria-label="secondary" data-widget-type="side-nav" />
          {/* Main Content */}
          <div className="usa-width-three-fourths">
            <article className="usa-content">
              <div>TODO: Lovell switch link</div>

              <h1 className="vads-u-margin-bottom--3p5">{title}</h1>
              <RegionalTopTasks
                path={path}
                administration={administration}
                vamcEhrSystem={vamcEhrSystem}
              />
              <section className="locations clearfix">
                <h2
                  className="vads-u-margin-top--1p5 medium-screen:vads-u-margin-top--3p5 vads-u-font-size--xl"
                  id="main-locations"
                >
                  Main locations
                </h2>
                <div>TODO: Main location list</div>

                <h2
                  className="medium-screen:vads-u-margin-bottom--4"
                  id="community-clinic-locations"
                >
                  Health clinic locations
                </h2>
                <div>TODO: Other facility list (sorted)</div>

                <h2
                  className="medium-screen:vads-u-margin-bottom--4"
                  id="mobile-clinic-locations"
                >
                  Mobile clinics
                </h2>
                <div>TODO: Mobile facility list (sorted)</div>

                <h2
                  className="medium-screen:vads-u-margin-bottom--4"
                  id="other-nearby-va-locations"
                >
                  Other nearby VA locations
                </h2>
                <div>TODO: Data widget for other VA locations</div>
              </section>

              <va-back-to-top />

              <div>TODO: Above-footer elements</div>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}
