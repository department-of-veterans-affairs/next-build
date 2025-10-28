import { VaLink } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import React, { useEffect } from 'react'
import { VetCenterLocationListing as FormattedVetCenterLocationListing } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { VetCenterLocationInfo } from './VetCenterLocationInfo'
import { FieldAddress } from '@/types/drupal/field_type'

const widgetAddress = (address: FieldAddress) => ({
  addressLine1: address.address_line1,
  addressLine2: address.address_line2,
  administrativeArea: address.administrative_area,
  locality: address.locality,
  postalCode: address.postal_code,
})

// Extend the Window interface to include the properties needed for the nearby vet centers widget
declare global {
  interface Window {
    mainVetCenterPhone?: string
    mainVetCenterAddress?: ReturnType<typeof widgetAddress>
    mainVetCenterId?: string
    satteliteVetCenters?: string[]
  }
}

export function VetCenterLocationListing({
  title,
  mainOffice,
  nearbyMobileVetCenters,
  satelliteLocations,
  mobileVetCenters,
}: FormattedVetCenterLocationListing) {
  // Set up the global variables needed by widgets on this page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Needed by the nearby vet centers widget
      window.mainVetCenterPhone = mainOffice.phoneNumber
      window.mainVetCenterAddress = widgetAddress(mainOffice.address)
      window.mainVetCenterId = mainOffice.fieldFacilityLocatorApiId

      // Needed by both the facility map widgets and the nearby vet centers widget
      window.satteliteVetCenters = satelliteLocations.map(
        (location) => location.fieldFacilityLocatorApiId
      )
    }
  }, [mainOffice, satelliteLocations])

  const showSatelliteLocations =
    satelliteLocations.length > 0 ||
    nearbyMobileVetCenters.length > 0 ||
    mobileVetCenters.length > 0

  return (
    <div className="vads-grid-container">
      <article className="usa-content vads-u-padding-bottom--0">
        {title && <h1>{title}</h1>}

        <h2
          className="vads-u-margin-top--0 vads-u-margin-bottom--2p5 tablet:vads-u-margin-bottom--3"
          id="main-location"
        >
          Main location
        </h2>
        <VetCenterLocationInfo vetCenter={mainOffice} isMainOffice={true} />

        {showSatelliteLocations && (
          <>
            <h2
              className="vads-u-margin-top--3 tablet:vads-u-margin-top--5 vads-u-margin-bottom--2p5 tablet:vads-u-margin-bottom--4"
              id="satellite-locations"
            >
              Satellite locations
            </h2>
            <p className="vads-u-margin-bottom--2p5 tablet:vads-u-margin-bottom--4">
              If you can’t make it to our {mainOffice.title} we offer satellite
              locations that may be closer to you. These satellite facilities
              provide select services with the same community, care, and
              confidentiality in a non-medical setting. Call us for more
              information about these locations.
            </p>
            {satelliteLocations.map((location) => (
              <VetCenterLocationInfo
                key={location.id}
                vetCenter={location}
                mainOffice={mainOffice}
              />
            ))}

            {mobileVetCenters.map((location) => (
              <VetCenterLocationInfo
                key={location.id}
                vetCenter={location}
                mainOffice={mainOffice}
              />
            ))}

            {nearbyMobileVetCenters.map((location) => (
              <VetCenterLocationInfo
                key={location.id}
                vetCenter={location}
                mainOffice={mainOffice}
              />
            ))}
          </>
        )}

        <div data-widget-type="vet-center-nearby" />

        <h2
          className="vads-u-margin-top--3 tablet:vads-u-margin-top--5 vads-u-margin-bottom--2p5 tablet:vads-u-margin-bottom--3"
          id="vet-centers-other-areas"
        >
          Vet Centers in other areas
        </h2>
        <p className="vads-u-font-size--base">
          Looking for a Vet Center in another area?{' '}
          <VaLink
            href="/find-locations"
            text="Find a Vet Center location"
          ></VaLink>
        </p>

        <va-back-to-top></va-back-to-top>

        <ContentFooter />
      </article>
    </div>
  )
}
