import { numberToTimeString } from '@/lib/utils/numberToTimeString'
import { dayOfWeek } from '@/lib/utils/dayOfWeek'
import { VamcFacility } from './formatted-type'

export function SchemaScript({
  title,
  address,
  mainPhoneString,
  officeHours,
  image,
  facilityLocatorApiId,
  geoLocation,
}: VamcFacility) {
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

  return (
    <>
      {/* Embedding structured data scripts for schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredSchemaData),
        }}
      />
    </>
  )
}
