import { VetCenterOutstation as FormattedVetCenterOutstation } from '@/types/formatted/vetCenterOutstation'
import { GoogleMapsDirections } from '@/templates/common/googleMapsDirections'
import { Hours } from '@/templates/components/hours'
import { ImageAndStaticMap } from '@/templates/components/imageAndStaticMap'
import { WysiwygField } from '@/templates/components/wysiwyg'
import { FeaturedContent } from '@/templates/common/featuredContent'
import { QaSection } from '@/templates/components/qaSection'
import { Accordion } from '@/templates/components/accordion'
import { PhoneNumber } from '@/templates/common/phoneNumber'

export function VetCenterOutstation({
  address,
  ccNonTraditionalHours,
  ccVetCenterCallCenter,
  ccVetCenterFaqs,
  geolocation,
  featuredContent,
  introText,
  officeHours,
  officialName,
  phoneNumber,
  healthServices,
  image,
  prepareForVisit,
  title,
  fieldFacilityLocatorApiId,
  path,
}: FormattedVetCenterOutstation) {
  const directionsString = [
    address?.address_line1,
    address?.locality,
    address?.administrative_area,
  ]

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
      dayOfWeek: `https://schema.org/${hours.day}`,
      opens: hours.starthours,
      closes: hours.endhours,
    })),
    hasMap: `https://maps.google.com?saddr=Current+Location&daddr=${encodeURIComponent(
      `${address.address_line1}, ${address.locality}, ${address.postal_code}`
    )}`,
    image: image?.links?.['2_1_large']?.href,
    branchCode: fieldFacilityLocatorApiId,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geolocation.lat.toString(),
      longitude: geolocation.lon.toString(),
    },
  }

  const generateStructuredDataForHealthServices = (
    healthServices,
    title,
    fieldAddress
  ) => {
    return healthServices.map((service) => ({
      '@context': 'https://schema.org',
      '@type': 'GovernmentService',
      name: title,
      alternateName: service?.fieldVetCenterFriendlyName || null,
      serviceType: service?.vetCenterTypeOfCare || null,
      serviceOperator: {
        '@type': 'GovernmentOrganization',
        name: 'US Department of Veterans Affairs',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: fieldAddress?.administrative_area || null,
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'Veteran',
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: 'https://www.va.gov',
        servicePhone: {
          '@type': 'ContactPoint',
          telephone: service?.phoneNumber || null,
        },
      },
      provider: {
        '@type': 'GovernmentOrganization',
        name: 'Veterans Affairs',
        url: 'https://www.va.gov',
      },
      serviceLocation: {
        '@type': 'Place',
        name: title,
        address: {
          '@type': 'PostalAddress',
          streetAddress:
            fieldAddress.address_line1 +
            (address.address_line2
              ? `${address.address_line1}${address.address_line2}`
              : address.address_line1),
          addressLocality: fieldAddress?.locality,
          addressRegion: fieldAddress?.administrative_area,
          postalCode: fieldAddress?.postal_code,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: geolocation.lat.toString(),
          longitude: geolocation.lon.toString(),
        },
      },
    }))
  }

  const structuredDataHealthServices = generateStructuredDataForHealthServices(
    healthServices,
    title,
    address
  )

  const PrepareForVisitComponent = ({ visitItems }) => {
    if (visitItems.length === 0) return null
    return (
      <>
        <h2
          id="prepare-for-your-visit"
          className="vads-u-margin-top--0 vads-u-font-size--lg mobile-lg:vads-u-font-size--xl vads-u-margin-bottom--2"
        >
          Prepare for your visit
        </h2>
        <p>Click on a topic for more details.</p>
        <div className="vads-u-margin-bottom--3">
          <Accordion
            id={'prepare-for-your-visit'}
            bordered
            items={prepareForVisit}
          />
        </div>
      </>
    )
  }

  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-width-three-fourths">
        <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
          {title && (
            <>
              <h1 aria-describedby="vet-center-title">{title}</h1>
              {officialName && title !== officialName && (
                <p
                  id="vet-center-title"
                  className="vads-u-line-height--4 vads-u-font-family--serif vads-u-font-size--lg vads-u-font-weight--bold vads-u-padding-bottom--0p5"
                >
                  Also called the {officialName}
                </p>
              )}
            </>
          )}
          {introText && (
            <div className="va-introtext">
              <p>{introText}</p>
            </div>
          )}
          <va-on-this-page />

          <h2
            id="location-and-contact-information"
            className="vads-u-margin-bottom--3"
          >
            Location and contact information
          </h2>
          <div
            className="region-list usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--column
          mobile-lg:vads-u-flex-direction--row facility"
          >
            <div className="usa-width-two-thirds vads-u-display--block vads-u-width--full">
              <div>
                <div className="vads-c-facility-detail">
                  <section className="vads-facility-detail vads-u-padding-bottom--5">
                    {/* TODO: put operating status here */}
                    <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                      Address
                    </h3>
                    <div className="vads-u-margin-bottom--3">
                      <address>
                        <div>{address.address_line1}</div>
                        {address.address_line2 && (
                          <div>{address.address_line2}</div>
                        )}
                        <div>{`${address.locality}, ${address.administrative_area} ${address.postal_code}`}</div>
                      </address>
                      <GoogleMapsDirections
                        address={directionsString}
                        location={title}
                      />
                    </div>

                    <div className="vads-u-margin-bottom--3">
                      <PhoneNumber
                        number={phoneNumber}
                        label="Main phone"
                        className="main-phone vads-u-margin-bottom--1"
                      />
                      {ccVetCenterCallCenter && (
                        <>
                          <PhoneNumber
                            number={phoneNumber}
                            label="After hours"
                            className="main-phone vads-u-margin-bottom--1"
                          />
                          <div className="vads-u-margin-bottom--2">
                            Need help after hours? We are available 24/7. Call
                            us anytime.
                          </div>
                        </>
                      )}
                    </div>

                    <Hours
                      headerType="standard"
                      allHours={officeHours}
                      nonTraditionalMessage={ccNonTraditionalHours}
                    />
                  </section>
                </div>
              </div>
            </div>
            <ImageAndStaticMap
              image={image}
              facilityId={fieldFacilityLocatorApiId}
            />
          </div>

          <h2 id="in-the-spotlight" className="vads-u-margin-y--2">
            In the spotlight
          </h2>
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-u-flex-direction--row vads-u-margin-bottom--4 ">
            {featuredContent &&
              featuredContent.map((content, index) => (
                <FeaturedContent
                  key={index}
                  title={content.title}
                  description={content.description}
                  link={content.link}
                  id={content.id || ''}
                />
              ))}
          </div>

          {/* Prepare for Your Visit */}
          {prepareForVisit && prepareForVisit.length > 0 && (
            <PrepareForVisitComponent visitItems={prepareForVisit} />
          )}

          {/* FAQs */}
          {ccVetCenterFaqs && <QaSection {...ccVetCenterFaqs} />}

          {/* Other locations */}
          <div className="vads-u-margin-bottom--3">
            <h2
              id="other-nearby-vet-centers"
              className="vads-u-font-size--lg vads-u-line-height--1 vads-u-margin-bottom--1"
            >
              Other nearby Vet Centers
            </h2>
            <div>
              <p className="vads-u-margin-bottom--0 vads-u-line-height--4">
                Vet Centers are community based to be more accessible in areas
                where you live. Find a nearby Vet Center location.
              </p>
              <va-link
                href={`${path}/locations`}
                text="Find a nearby Vet Center location"
              />
            </div>
          </div>

          <va-back-to-top></va-back-to-top>

          {/* Embedding structured data scripts for schema.org */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredSchemaData),
            }}
          />
          {structuredDataHealthServices.map((service, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
            />
          ))}
        </article>
      </div>
    </div>
  )
}
