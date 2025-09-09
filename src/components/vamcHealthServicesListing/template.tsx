import { VamcHealthServicesListing as FormattedVamcHealthServicesListing } from './formatted-type'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { FacilityTopTasks } from '@/components/topTasks/template'
import { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { FeaturedContent } from '@/components/featuredContent/template'
import { ContentFooter } from '../contentFooter/template'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function VamcHealthServicesListing({
  title,
  introText,
  lovellVariant,
  lovellSwitchPath,
  path,
  administration,
  vamcEhrSystem,
  menu,
  featuredContent,
}: FormattedVamcHealthServicesListing) {
  // Extract the region base path from the full path (same as healthCareLocalFacility)
  const regionBasePath = path ? path.split('/')[1] : ''
  // Note: The side nav widget is in a vets-website
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <main className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        {/* Nav data filled in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        <div className="usa-width-three-fourths">
          <article className="usa-content">
            <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            />

            <h1 className="vads-u-margin-bottom--1 tablet:vads-u-margin-bottom--2">
              {title}
            </h1>

            <div className="va-introtext">
              {introText && <p id="office-events-description">{introText}</p>}
            </div>

            {/* Top Task links */}
            {path && (
              <div>
                <FacilityTopTasks
                  path={regionBasePath}
                  administration={administration}
                  vamcEhrSystem={vamcEhrSystem}
                />
              </div>
            )}

            <div className="usa-grid usa-grid-full vads-u-margin-top--0p5 vads-u-margin-bottom--4">
              <div className="usa-grid usa-grid-full vads-u-margin-y--0 vads-u-margin-bottom--0">
                {/* TODO: Add health services buttons here */}
                <p> TODO: Add health services buttons here </p>
              </div>
            </div>

            <va-on-this-page />

            {/* Featured Content Section - conditional on fieldFeaturedContentHealthser */}
            {featuredContent && featuredContent.length > 0 && (
              <section id="featured-services">
                <h2 id="in-the-spotlight">In the spotlight</h2>
                <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between tablet:vads-u-flex-direction--row vads-u-margin-bottom--4">
                  {featuredContent.map((item) => (
                    <FeaturedContent
                      key={item.id}
                      title={item.title}
                      description={item.summary}
                      link={{
                        id: item.id,
                        url: item.uri,
                        label: 'Read more',
                      }}
                      id={item.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* TODO: Health Services Listing by type - using health_services_listing_services.liquid includes */}
            {[
              { id: 'primary-care', title: 'Primary care' },
              { id: 'mental-health-care', title: 'Mental health care' },
              { id: 'specialty-care', title: 'Specialty care' },
              {
                id: 'social-programs-and-services',
                title: 'Social programs and services',
              },
              { id: 'other-services', title: 'Other services' },
            ].map(({ id, title }) => (
              <section key={id} id={id}>
                <h2 id={`${id}-services`}>{title}</h2>
                {/* TODO: Replace with actual ServiceGroupListing component from health_services_listing_services.liquid */}
                {/* Example using existing HealthServices component: */}
                <p> TODO: Add HealthServices component here </p>
              </section>
            ))}

            {/* TODO: Fallback for empty service list - conditional on clinicalHealthServices.length == 0 */}
            <div className="no-services-message">
              <p>No health services at this time. (conditional)</p>
            </div>

            <va-back-to-top />
            <ContentFooter />
          </article>
        </div>
      </div>
    </main>
  )
}
