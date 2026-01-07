import { VetCenterOutstation as FormattedVetCenterOutstation } from './formatted-type'
import { GoogleMapsDirections } from '@/components/googleMapsDirections/template'
import { Hours } from '@/components/hours/template'
import { PhoneNumber } from '@/components/phoneNumber/template'
import { TextWithImage } from '@/components/textWithImage/template'
import { MediaImage } from '@/components/mediaImage/template'
import { ExpandableOperatingStatus } from '@/components/expandableOperatingStatus/template'
import { Accordion } from '@/components/accordion/template'
import { AccordionItem } from '@/components/accordion/formatted-type'
import { FeaturedContent } from '@/components/featuredContent/template'
import { QaSection } from '@/components/qaSection/template'
import { AlertBlock } from '@/components/alertBlock/template'
import { ContentFooter } from '@/components/contentFooter/template'
import VetCenterHealthServices from '@/components/vetCenterHealthServices/template'

const PrepareForVisitSection = ({
  visitItems,
}: {
  visitItems: AccordionItem[]
}) => {
  if (visitItems.length === 0) return null
  return (
    <>
      <h2
        id="prepare-for-your-visit"
        className="vads-u-margin-top--0 vads-u-font-size--lg mobile-lg:vads-u-font-size--xl vads-u-margin-bottom--2"
      >
        Prepare for your visit
      </h2>
      <p>Select a topic to learn more.</p>
      <div className="vads-u-margin-bottom--3">
        <Accordion id="prepare-for-your-visit" bordered items={visitItems} />
      </div>
    </>
  )
}

export function VetCenterOutstation({
  address,
  geolocation,
  introText,
  officeHours,
  officialName,
  operatingStatusFacility,
  operatingStatusMoreInfo,
  phoneNumber,
  healthServices,
  counselingHealthServices,
  referralHealthServices,
  otherHealthServices,
  image,
  title,
  fieldFacilityLocatorApiId,
  path,
  prepareForVisit,
  featuredContent,
  ccNonTraditionalHours,
  ccVetCenterCallCenter,
  ccVetCenterFaqs,
}: FormattedVetCenterOutstation) {
  const dayOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const

  const normalizedOfficeHours = officeHours ?? []
  const outstationOrTitle = title || officialName || ''

  const inferredOfficePath = path.includes('/')
    ? `/${path.split('/').filter(Boolean).slice(0, -1).join('/')}`
    : null
  const locationsLink =
    inferredOfficePath && inferredOfficePath !== '/'
      ? `${inferredOfficePath}/locations`
      : `${path}/locations`

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
    name: outstationOrTitle,
    telephone: phoneNumber,
    openingHoursSpecification: normalizedOfficeHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayOfWeek[hours.day] ?? dayOfWeek[0]}`,
      opens: hours.starthours,
      closes: hours.endhours,
    })),
    hasMap: `https://maps.google.com?saddr=Current+Location&daddr=${encodeURIComponent(
      `${address.address_line1}, ${address.locality}, ${address.postal_code}`
    )}`,
    image: image?.links?.['2_1_large']?.href,
    branchCode: fieldFacilityLocatorApiId,
    geo: geolocation
      ? {
          '@type': 'GeoCoordinates',
          latitude: geolocation.lat.toString(),
          longitude: geolocation.lon.toString(),
        }
      : undefined,
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
      alternateName: service?.vetCenterFriendlyName || null,
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
          telephone: phoneNumber || null,
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
          streetAddress: `${fieldAddress.address_line1}${
            fieldAddress.address_line2 ? `, ${fieldAddress.address_line2}` : ''
          }`,
          addressLocality: fieldAddress?.locality,
          addressRegion: fieldAddress?.administrative_area,
          postalCode: fieldAddress?.postal_code,
        },
        geo: geolocation
          ? {
              '@type': 'GeoCoordinates',
              latitude: geolocation.lat.toString(),
              longitude: geolocation.lon.toString(),
            }
          : undefined,
      },
    }))
  }

  const structuredDataHealthServices = generateStructuredDataForHealthServices(
    healthServices,
    outstationOrTitle,
    address
  )

  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-width-three-fourths">
        <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
          {outstationOrTitle && (
            <>
              <h1 aria-describedby="vet-center-title">{outstationOrTitle}</h1>
              {officialName && outstationOrTitle !== officialName && (
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
          <TextWithImage
            image={
              <>
                {image && (
                  <MediaImage {...image} imageStyle="3_2_medium_thumbnail" />
                )}
                <div
                  data-widget-type="facility-map"
                  data-facility={fieldFacilityLocatorApiId}
                />
              </>
            }
          >
            <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              Address
            </h3>
            {operatingStatusFacility && (
              <ExpandableOperatingStatus
                operatingStatusFlag={operatingStatusFacility}
                operatingStatusMoreInfo={operatingStatusMoreInfo ?? null}
              />
            )}
            <div className="vads-u-margin-bottom--3">
              <address>
                <div>{address.address_line1}</div>
                {address.address_line2 && <div>{address.address_line2}</div>}
                <div>{`${address.locality}, ${address.administrative_area} ${address.postal_code}`}</div>
              </address>
              <GoogleMapsDirections
                address={address}
                location={outstationOrTitle}
              />
            </div>

            <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              Phone number
            </h3>
            <PhoneNumber
              className="vads-u-margin-top--0 vads-u-margin-bottom--3"
              label="Main phone"
              number={phoneNumber}
            />

            <Hours
              headerType="standard"
              allHours={normalizedOfficeHours}
              nonTraditionalMessage={ccNonTraditionalHours}
            />
          </TextWithImage>

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

          {featuredContent && featuredContent.length > 0 && (
            <>
              <h2 id="in-the-spotlight" className="vads-u-margin-y--2">
                In the spotlight
              </h2>
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-u-flex-direction--row vads-u-margin-bottom--4">
                {featuredContent.map((content, index) => (
                  <FeaturedContent
                    key={index}
                    title={content.title}
                    description={content.description}
                    link={content.link}
                    id={content.id || ''}
                  />
                ))}
              </div>
            </>
          )}

          {prepareForVisit && prepareForVisit.length > 0 && (
            <PrepareForVisitSection visitItems={prepareForVisit} />
          )}

          <VetCenterHealthServices
            services={counselingHealthServices}
            typeOfCare="counseling"
          />
          <VetCenterHealthServices
            services={referralHealthServices}
            typeOfCare="referral"
          />
          <VetCenterHealthServices
            services={otherHealthServices}
            typeOfCare="other"
          />

          {ccVetCenterFaqs && <QaSection {...ccVetCenterFaqs} />}

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
                href={locationsLink}
                text="Find a nearby Vet Center location"
              />
            </div>
          </div>

          <va-back-to-top></va-back-to-top>

          <ContentFooter />

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
