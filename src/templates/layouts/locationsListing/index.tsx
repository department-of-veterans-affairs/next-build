'use client'

import { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { RegionalTopTasks } from '@/templates/components/topTasks'
import { LocationsListing as FormattedLocationsListing } from '@/types/formatted/locationsListing'
import { FacilityListing } from '@/templates/components/facilityListing'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'

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
  mainFacilities,
  healthClinicFacilities,
  mobileFacilities,
  lovellVariant,
  lovellSwitchPath,
  otherVaLocationIds,
}: LovellStaticPropsResource<FormattedLocationsListing>) {
  useEffect(() => {
    window.sideNav = menu
  }, [menu])
  return (
    <div className="interior">
      <main className="va-l-detail-page va-facility-page">
        <div className="vads-grid-container">
          {/* Sidebar Navigation */}
          <nav aria-label="secondary" data-widget-type="side-nav" />
          {/* Main Content */}
          <div className="vads-grid-row">
            <div className="vads-grid-col-12">
              <article className="usa-content">
                <LovellSwitcher
                  currentVariant={lovellVariant}
                  switchPath={lovellSwitchPath}
                />

                <h1 className="vads-u-margin-bottom--3p5">{title}</h1>
                <RegionalTopTasks
                  path={path}
                  administration={administration}
                  vamcEhrSystem={vamcEhrSystem}
                />
                <section className="locations clearfix">
                  {mainFacilities.length > 0 && (
                    <>
                      <h2
                        className="vads-u-margin-top--1p5 tablet:vads-u-margin-top--3p5 vads-u-font-size--xl"
                        id="main-locations"
                      >
                        Main locations
                      </h2>
                      {mainFacilities.map((facility) => (
                        <FacilityListing
                          key={facility.title}
                          facility={facility}
                          basePath={path}
                        />
                      ))}
                    </>
                  )}
                  {healthClinicFacilities.length > 0 && (
                    <>
                      <h2
                        className="tablet:vads-u-margin-bottom--4"
                        id="community-clinic-locations"
                      >
                        Health clinic locations
                      </h2>
                      {healthClinicFacilities.map((facility) => (
                        <FacilityListing
                          key={facility.title}
                          facility={facility}
                          basePath={path}
                        />
                      ))}
                    </>
                  )}
                  {mobileFacilities.length > 0 && (
                    <>
                      <h2
                        className="tablet:vads-u-margin-bottom--4"
                        id="mobile-clinic-locations"
                      >
                        Mobile clinics
                      </h2>
                      {mobileFacilities.map((facility) => (
                        <FacilityListing
                          key={facility.title}
                          facility={facility}
                          basePath={path}
                          type="mobile"
                        />
                      ))}
                    </>
                  )}
                  {otherVaLocationIds.length > 0 && (
                    <>
                      <h2
                        className="tablet:vads-u-margin-bottom--4"
                        id="other-nearby-va-locations"
                      >
                        Other nearby VA locations
                      </h2>
                      <div
                        data-widget-type="other-facility-locations-list"
                        data-facilities={otherVaLocationIds.join(',')}
                      />
                    </>
                  )}
                </section>

                <va-back-to-top />
                <ContentFooter />
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
