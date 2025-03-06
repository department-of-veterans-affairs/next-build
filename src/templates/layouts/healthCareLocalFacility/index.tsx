import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'

export function HealthCareLocalFacility({
  title,
  introText,
  operatingStatusFacility,
}: FormattedHealthCareLocalFacility) {
  return (
    <div className="interior" id="content">
      <main className="va-l-detail-page va-facility-page">
        <div className="usa-grid usa-grid-full">
          <div>TODO: Sidebar nav</div>
          <div className="usa-width-three-fourths">
            <article className="usa-content va-l-facility-detail">
              <div>TODO: Lovell switch link</div>

              {title && <h1>{title}</h1>}

              {introText && (
                <div className="va-introtext">
                  <p>{introText}</p>
                </div>
              )}

              <div className="usa-grid usa-grid-full vads-u-margin-y--1p5 vads-u-margin-bottom--6">
                <div>TODO: facilities_health_services_buttons</div>
              </div>

              <va-on-this-page></va-on-this-page>

              {/* Main content */}
              <h2 className="vads-u-line-height--1 vads-u-margin-bottom--3">
                Location and contact information
              </h2>
              <div className="region-list usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row facility vads-u-margin-bottom--2p5 vads-u-margin-bottom--4">
                <div className="usa-width-two-thirds vads-u-display--block vads-u-width--full">
                  <div>
                    <div className="vads-c-facility-detail">
                      <div>TODO: Operating status flags</div>
                      <section className="vads-facility-detail">
                        <script type="application/ld+json">
                          {/* TODO: Fill this in */}
                        </script>

                        <h3 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
                          Address
                        </h3>
                        <div>TODO: Address stuff</div>

                        <h3 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
                          Phone numbers
                        </h3>
                        <div>TODO: Phone numbers</div>
                        <div>TODO: Office hours</div>
                      </section>
                    </div>
                  </div>
                </div>
                <div>TODO: Image and static map</div>
              </div>
              <div>TODO: Location services section</div>
              <div>TODO: List of links section</div>
              <div>TODO: Local health services section</div>
              <div>TODO: Patient satisfaction scores section</div>
              <div>TODO: Social links section</div>
              <va-back-to-top></va-back-to-top>
              <div>TODO: Last updated & feedback button</div>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}

const OperatingStatusFlags = ({
  operatingStatusFacility,
}: Pick<FormattedHealthCareLocalFacility, 'operatingStatusFacility'>) => {
  if (operatingStatusFacility == 'notice') {
    return (
      <va-alert status="info" slim visible>
        <va-link
          class="vads-u-font-weight--bold operating-status-link"
          onclick="recordEvent({
            'event': 'nav-info-box-click',
            'infoBoxText': 'Facility notice'});"
          href="{{ facilitySidebar.links.0.url.path }}/operating-status"
          text="Facility notice"
        />
      </va-alert>
    )
  }

  if (operatingStatusFacility == 'limited') {
    return (
      <va-alert status="warning" slim visible>
        <va-link
          class="vads-u-font-weight--bold operating-status-link"
          onclick="recordEvent({
            'event': 'nav-info-box-click',
            'infoBoxText': 'Facility limited'});"
          href="{{ facilitySidebar.links.0.url.path }}/operating-status"
          text="Limited services and hours"
        />
      </va-alert>
    )
  }

  if (operatingStatusFacility == 'closed') {
    return (
      <va-alert status="error" slim visible>
        <va-link
          class="vads-u-font-weight--bold operating-status-link"
          onclick="recordEvent({
            'event': 'nav-info-box-click',
            'infoBoxText': 'Facility closed'});"
          href="{{ facilitySidebar.links.0.url.path }}/operating-status"
          text="Facility closed"
        />
      </va-alert>
    )
  }

  return null
}
