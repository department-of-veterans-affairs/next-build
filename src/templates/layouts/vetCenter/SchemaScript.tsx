import { VetCenter as FormattedVetCenter } from '@/types/formatted/vetCenter'

interface SchemaScriptProps {
  vetCenter: FormattedVetCenter
}

export function SchemaScript({ vetCenter }: SchemaScriptProps) {
  const {
    address,
    geolocation,
    officeHours,
    phoneNumber,
    title,
    fieldFacilityLocatorApiId,
    image,
    healthServices,
  } = vetCenter

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
        serviceLocation: {
          '@type': 'Place', // Changed from 'GovernmentOffice' in production
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
      },
      provider: {
        '@type': 'GovernmentOrganization',
        name: 'Veterans Affairs',
        url: 'https://www.va.gov',
      },
    }))
  }

  const structuredDataHealthServices = generateStructuredDataForHealthServices(
    healthServices,
    title,
    address
  )

  return (
    <>
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
    </>
  )
}
