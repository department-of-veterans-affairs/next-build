import { HealthServicesListing as FormattedHealthServicesListing } from '@/types/formatted/healthServicesListing'

export function HealthServicesListing({
  title,
  description,
  introText,
}: FormattedHealthServicesListing) {
  return (
    <div className="interior" id="content">
      <main className="va-l-detail-page">
        <div className="vads-grid-container">
          <div className="vads-grid-row">
            {/* TODO: Replace with <FacilitySidebarNav /> if needed */}
            {/* <aside className="vads-grid-col-3">Sidebar nav</aside> */}

            <div className="vads-grid-col-12">
              <article className="usa-content">
                {/* TODO: Lovell switch link */}
                {/* <LovellSwitchLink /> */}

                <h1 className="vads-u-margin-bottom--3p5">{title}</h1>

                {introText && (
                  <div className="va-introtext vads-u-margin-bottom--4">
                    <p>{introText}</p>
                  </div>
                )}

                {description && (
                  <div className="vads-u-margin-bottom--4">
                    <p>{description}</p>
                  </div>
                )}

                {/* TODO: Health Services Buttons Row */}
                <div className="vads-grid-row vads-u-margin-y--2">
                  {/* <HealthServicesButtons /> */}
                </div>

                {/* TODO: On This Page anchor nav */}
                <va-on-this-page />

                {/* TODO: Featured Content Section */}
                <section
                  id="featured-services"
                  className="vads-u-margin-bottom--4"
                >
                  <h2>In the spotlight</h2>
                  <div className="vads-grid-row">{/* <LinkTeaser /> */}</div>
                </section>

                {/* TODO: Health Services Listing by type */}
                {[
                  'Primary care',
                  'Mental health care',
                  'Specialty care',
                  'Social programs and services',
                  'Other services',
                ].map((type) => (
                  <section key={type}>
                    <h3>{type}</h3>
                    {/* <ServiceGroupListing typeOfCare={type} /> */}
                  </section>
                ))}

                {/* TODO: Fallback for empty service list */}
                {/* <div>No health services at this time.</div> */}

                <va-back-to-top />

                {/* TODO: Above-footer callouts */}
                {/* <AboveFooterElements /> */}
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
