import { RegionalTopTasks } from '@/components/topTasks/template'
import { LocationsListing as FormattedLocationsListing } from './formatted-type'
import { FacilityListing } from '@/components/facilityListing/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'

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
  return (
    <SideNavLayout menu={menu}>
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
    </SideNavLayout>
  )
}
