import { useEffect } from 'react'

import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'
import { SideNavMenu } from '@/types/formatted/sideNav'

import { TopTasks } from '@/templates/components/topTasks'
import { numberToTimeString } from '@/lib/utils/numberToTimeString'
import { dayOfWeek } from '@/lib/utils/dayOfWeek'

import { LocationServices } from './LocationServices'
import { HealthServices } from './HealthServices'
import { OperatingStatusFlags } from './OperatingStatus'
import { Address } from './Address'
import { Phone } from './Phone'
import { Hours } from '@/templates/components/hours'
import { ImageAndStaticMap } from '@/templates/components/imageAndStaticMap'
import { RelatedLinks } from '@/templates/common/relatedLinks'
import { format } from 'date-fns'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function HealthCareLocalFacility({
  title,
  introText,
  lastUpdated,
  operatingStatusFacility,
  menu,
  path,
  administration,
  vamcEhrSystem,
  officeHours,
  address,
  phoneNumber,
  vaHealthConnectPhoneNumber,
  image,
  facilityLocatorApiId,
  geoLocation,
  fieldTelephone,
  relatedLinks,
  locationServices,
}: FormattedHealthCareLocalFacility) {
  // Populate the side nav data for the side nav widget to fill in
  // Note: The side nav widget is in a separate app in the static-pages bundle
  useEffect(() => {
    window.sideNav = menu
  })

  const structuredSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.address_line1}${
        address.address_line2 ? `, ${address.address_line2}` : ''
      }`,
      addressLocality: address.locality,
      addressRegion: address.administrative_area,
      postalCode: address.postal_code,
    },
    name: title,
    telephone: phoneNumber,
    openingHoursSpecification: officeHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayOfWeek(hours.day)}`,
      opens: numberToTimeString(hours.starthours),
      closes: numberToTimeString(hours.endhours),
    })),
    hasMap: `https://maps.google.com?saddr=Current+Location&daddr=${encodeURIComponent(
      `${address.address_line1}, ${address.locality}, ${address.postal_code}`
    )}`,
    // Shouldn't need all these optional chains, but because we're not
    // validating data during runtime, just in case...
    image: image?.links?.['2_1_large']?.href,
    branchCode: facilityLocatorApiId,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geoLocation?.lat ?? '',
      longitude: geoLocation?.lon ?? '',
    },
  }

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
            <div className="region-list usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row facility vads-u-margin-bottom--4">
              <div className="usa-width-two-thirds vads-u-padding-right--0p5">
                <div>
                  <OperatingStatusFlags
                    operatingStatusFacility={operatingStatusFacility}
                    menu={menu}
                  />
                  <section>
                    {/* Embedding structured data scripts for schema.org */}
                    <script
                      type="application/ld+json"
                      dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredSchemaData),
                      }}
                    />

                    <h3
                      className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                      id="address-heading"
                    >
                      Address
                    </h3>
                    <Address address={address} title={title} />

                    <h3
                      className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                      id="phone-numbers"
                    >
                      Phone numbers
                    </h3>
                    <Phone
                      phoneNumber={phoneNumber}
                      vaHealthConnectPhoneNumber={vaHealthConnectPhoneNumber}
                      fieldTelephone={fieldTelephone}
                    />
                    <Hours allHours={officeHours} headerType="clinical" />
                  </section>
                </div>
              </div>
              <ImageAndStaticMap
                image={image}
                facilityId={facilityLocatorApiId}
              />
            </div>
            <LocationServices items={locationServices} />
            <RelatedLinks
              sectionTitle={relatedLinks.sectionTitle}
              links={relatedLinks.links}
            />
            <HealthServices />
            <div>TODO: Patient satisfaction scores section</div>
            <div>TODO: Social links section</div>
            <va-back-to-top></va-back-to-top>
            <div className="last-updated usa-content vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
              <div className="mobile-lg:vads-u-display--flex above-footer-elements-container">
                <div className="vads-u-flex--auto">
                  <span className="vads-u-text-align--justify">
                    <p>
                      Last updated:{' '}
                      <time dateTime={format(lastUpdated, 'yyyy-MM-dd')}>
                        {format(lastUpdated, 'MMMM d, yyyy')}
                      </time>
                    </p>
                  </span>
                </div>
                <div className="vads-u-flex--1 vads-u-text-align--right">
                  <span className="vads-u-text-align--right">
                    <button
                      type="button"
                      className="feedback-button usa-button"
                      id="mdFormButton"
                      aria-label="give feedback"
                    >
                      Feedback
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
