import { useEffect } from 'react'

import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'
import { SideNavMenu } from '@/types/formatted/sideNav'

import { FacilityTopTasks } from '@/templates/components/topTasks'
import { numberToTimeString } from '@/lib/utils/numberToTimeString'
import { dayOfWeek } from '@/lib/utils/dayOfWeek'

import { LocationServices } from './LocationServices'
import { HealthServices } from './HealthServices'
import { OperatingStatusFlags } from './OperatingStatus'
import { Address } from './Address'
import { Phone } from './Phone'
import { Hours } from '@/templates/components/hours'
import { RelatedLinks } from '@/templates/common/relatedLinks'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { MediaImage } from '@/templates/common/mediaImage'
import { TextWithImage } from '@/templates/components/textWithImage'
import { VamcSystemSocialLinks } from '@/templates/components/vamcSystemSocialLinks'

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
  mainPhoneString,
  vaHealthConnectPhoneNumber,
  image,
  facilityLocatorApiId,
  geoLocation,
  mentalHealthPhoneNumber: fieldTelephone,
  relatedLinks,
  locationServices,
  socialLinks,
  lovellVariant,
  lovellSwitchPath,
  healthServices,
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
    telephone: mainPhoneString,
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

  // Used to get a base url path of a health care region from `path`
  // NOTE: Maybe could use entity.field_region_page.path.alias instead?
  // `content-build` does it this way, though.
  const regionBasePath = path.split('/')[1]

  return (
    <div className="interior">
      <div className="vads-grid-container">
        {/* Nav data fille in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        <div className="vads-grid-row">
          <div className="vads-grid-col-12">
            <article className="usa-content va-l-facility-detail">
              <LovellSwitcher
                currentVariant={lovellVariant}
                switchPath={lovellSwitchPath}
              />

              {title && <h1>{title}</h1>}

              {introText && (
                <div className="va-introtext">
                  <p>{introText}</p>
                </div>
              )}

              <FacilityTopTasks
                path={regionBasePath}
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
              <TextWithImage
                image={
                  <>
                    <MediaImage {...image} imageStyle="3_2_medium_thumbnail" />
                    <div
                      data-widget-type="facility-map"
                      data-facility={facilityLocatorApiId}
                    />
                  </>
                }
              >
                <div>
                  <OperatingStatusFlags
                    operatingStatusFacility={operatingStatusFacility}
                    basePath={menu.data.links[0].url.path}
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
                    <div className="vads-u-margin-bottom--3">
                      <Address address={address} title={title} />
                    </div>

                    <h3
                      className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                      id="phone-numbers"
                    >
                      Phone numbers
                    </h3>
                    <Phone
                      mainPhoneString={mainPhoneString}
                      vaHealthConnectPhoneNumber={vaHealthConnectPhoneNumber}
                      mentalHealthPhoneNumber={fieldTelephone}
                    />
                    <div data-testid="facility-hours">
                      <Hours allHours={officeHours} headerType="clinical" />
                    </div>
                  </section>
                </div>
              </TextWithImage>
              <LocationServices items={locationServices} />
              <RelatedLinks
                sectionTitle={relatedLinks.sectionTitle}
                links={relatedLinks.links}
              />
              <HealthServices
                healthServices={healthServices}
                mentalHealthPhoneNumber={fieldTelephone}
                mainPhoneString={mainPhoneString}
              />
              {facilityLocatorApiId.includes('vha_') && (
                <div
                  data-testid="patient-satisfaction-widget"
                  data-widget-type="facility-patient-satisfaction-scores"
                  data-facility={`"vha_${facilityLocatorApiId.split('_')[1].toUpperCase()}"`}
                />
              )}
              <VamcSystemSocialLinks {...socialLinks} />
              <va-back-to-top></va-back-to-top>
              <ContentFooter lastUpdated={lastUpdated} />
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
