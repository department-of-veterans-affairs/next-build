import { VamcHealthServicesListing as FormattedVamcHealthServicesListing } from '@/products/vamcHealthServicesListing/formatted-type'

export function VamcHealthServicesListing({
  title,
  introText,
}: FormattedVamcHealthServicesListing) {
  return (
    <main className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        {/* TODO: Replace with actual FacilitySidebarNav component */}
        <div className="usa-width-one-fourth">
          <div className="facility-sidebar-nav">
            <p>TODO: Add Sidebar </p>
          </div>
        </div>

        <div className="usa-width-three-fourths">
          <article className="usa-content">
            {/* TODO: Replace with actual LovellSwitchLink component */}
            <div className="lovell-switch-link">
              <va-link href="#TODO" text="TODO: Lovell switch link text" />
            </div>

            <h1 className="vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
              {title}
            </h1>

            <div className="va-introtext">
              {introText && <p id="office-events-description">{introText}</p>}
            </div>

            <div className="usa-grid usa-grid-full vads-u-margin-top--0p5 vads-u-margin-bottom--4">
              <div className="usa-grid usa-grid-full vads-u-margin-y--0 vads-u-margin-bottom--0">
                {/* TODO: Add health services buttons here */}
                <p> TODO: Add health services buttons here </p>
              </div>
            </div>

            <va-on-this-page />

            {/* TODO: Featured Content Section - conditional on fieldFeaturedContentHealthser */}
            <section id="featured-services">
              <h2 id="in-the-spotlight">In the spotlight</h2>
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-u-flex-direction--row vads-u-margin-bottom--4">
                {/* TODO: Replace with actual LinkTeaser components from fieldFeaturedContentHealthser */}
                <p> TODO: Add LinkTeaser components here </p>
              </div>
            </section>

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

            {/* TODO: Add above footer elements here */}
            <p>TODO: Add above footer elements here</p>
          </article>
          {/* TODO: Last updated & feedback button */}
        </div>
      </div>
    </main>
  )
}
