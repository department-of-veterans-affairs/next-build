import { VetCenter as FormattedVetCenter } from '@/types/formatted/vetCenter'
import { GoogleMapsDirections } from '@/templates/common/googleMapsDirections'
import { Hours } from '@/templates/components/hours'
import { ImageAndStaticMap } from '@/templates/components/imageAndStaticMap'
import { AlertBlock } from '@/templates/components/alertBlock'
import { WysiwygField } from '@/templates/components/wysiwyg'
import HealthServices from '@/templates/components/healthServices'
import { FeaturedContent } from '@/templates/common/featuredContent'
import { QaSection } from '@/templates/components/qaSection'
export function VetCenter({
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
  counselingHealthServices,
  referralHealthServices,
  otherHealthServices,
  image,
  prepareForVisit,
  title,
  fieldFacilityLocatorApiId,
  path,
}: FormattedVetCenter) {
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
    // "image": [media.entity.image.derivative.url],
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
          className="vads-u-margin-top--0 vads-u-font-size--lg small-screen:vads-u-font-size--xl vads-u-margin-bottom--2"
        >
          Prepare for your visit
        </h2>
        <p>Click on a topic for more details.</p>
        <div className="vads-u-margin-bottom--3">
          {/* TODO: Look at this again after paragraph/basic_accordion work is complete */}
          <va-accordion bordered id="prepare-for-your-visit-accordion">
            {visitItems.map((item, index) => (
              <va-accordion-item
                key={`prepare-for-your-visit-accordion-item-${index}`}
                class="va-accordion-item"
                id={`prepare-for-your-visit-accordion-item-${index}`}
                header={item.field_header}
                level="3"
              >
                <WysiwygField html={item.field_rich_wysiwyg.processed} />
              </va-accordion-item>
            ))}
          </va-accordion>
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
                <p id="vet-center-title" className="field-official-name">
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
          <va-on-this-page class="vads-u-margin-left--1 vads-u-margin-bottom--0 vads-u-padding-bottom--0"></va-on-this-page>

          {/* Locations and contact */}
          <h2 id="locations-and-contact-information">
            Locations and contact information
          </h2>
          <div
            className="region-list usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--column
          small-screen:vads-u-flex-direction--row facility"
          >
            <div className="usa-width-two-thirds vads-u-display--block vads-u-width--full">
              <div>
                <div className="vads-c-facility-detail">
                  <section className="vads-facility-detail">
                    <h3 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
                      Main Location
                    </h3>

                    {/* For the ExpandableOperatingStatus widget in vets-website */}

                    {/* TODO: potential change to the vets-website widget to not use facilityId as a prop on div */}
                    {/* <div
                      data-widget-type={`expandable-operating-status-${fieldFacilityLocatorApiId}`}
                      facilityId={fieldFacilityLocatorApiId}
                      status={operatingStatusFacility}
                      info={operatingStatusMoreInfo}
                    /> */}

                    <div className="vads-u-margin-bottom--3">
                      <address>
                        <div>{address.address_line1}</div>
                        {address.address_line2 && (
                          <div>{address.address_line2}</div>
                        )}
                        <div>{`${address.locality}, ${address.administrative_area} ${address.postal_code}`}</div>
                      </address>
                      <GoogleMapsDirections
                        title={title}
                        address={directionsString}
                      />
                    </div>

                    <h4 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
                      Direct line
                    </h4>
                    <div className="vads-u-margin-bottom--3">
                      <div className="main-phone vads-u-margin-bottom--1">
                        <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                      </div>
                    </div>

                    <Hours headerType="standard" allHours={officeHours} />
                  </section>
                </div>
              </div>
            </div>
            <ImageAndStaticMap
              image={image}
              facilityId={fieldFacilityLocatorApiId}
            />
          </div>

          {/* Other locations */}
          <div className="vads-u-margin-bottom--3">
            <h3 className="vads-u-font-size--lg vads-u-line-height--1 vads-u-margin-bottom--1">
              Other Locations
            </h3>
            <div>
              <p className="vads-u-margin-bottom--0 vads-u-line-height--4">
                Vet Centers are community based to be more accessible in areas
                where you live.
              </p>
              <a href={`${path}/locations`}>View more {title} locations</a>
            </div>
          </div>

          {ccNonTraditionalHours && (
            <div
              className="vads-u-font-weight--bold"
              id="field-cc-non-traditional-hours"
            >
              <WysiwygField html={ccNonTraditionalHours.html} />
            </div>
          )}

          {/* Call Center Information */}
          {ccVetCenterCallCenter && (
            <div className="vads-u-margin-bottom--2">
              <AlertBlock
                alertType="info"
                id="field-cc-vet-call-center"
                title="Need help after hours?"
                content={ccVetCenterCallCenter}
              />
            </div>
          )}

          {/* Prepare for Your Visit */}
          {prepareForVisit && prepareForVisit.length > 0 && (
            <PrepareForVisitComponent visitItems={prepareForVisit} />
          )}

          {/* Featured Content */}
          <h2
            id="in-the-spot-light"
            className="vads-u-margin-top--0 vads-u-font-size--lg
          small-screen:vads-u-font-size--xl vads-u-margin-bottom--2"
          >
            In the spotlight at {title}
          </h2>
          <div
            id="field-vet-center-feature-content"
            className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-u-flex-direction--row vads-u-margin-bottom--4 "
          >
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

          {/* Health Services */}
          <HealthServices
            services={counselingHealthServices}
            typeOfCare={'counseling'}
          />
          <HealthServices
            services={referralHealthServices}
            typeOfCare={'referral'}
          />
          <HealthServices services={otherHealthServices} typeOfCare={'other'} />

          {/* FAQs */}
          {ccVetCenterFaqs && <QaSection {...ccVetCenterFaqs} />}

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
