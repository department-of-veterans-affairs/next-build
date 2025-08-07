import React from 'react'
import { VetCenterLocationListing as FormattedVetCenterLocationListing } from '@/types/formatted/vetCenterLocationListing'
import { ContentFooter } from '@/templates/common/contentFooter'
import { VetCenterLocationInfo } from './VetCenterLocationInfo'

export function VetCenterLocationListing({
  title,
  fieldOffice,
  nearbyMobileVetCenters,
  satelliteLocations,
  mobileVetCenters,
}: FormattedVetCenterLocationListing) {
  // console.log('satelliteLocations', satelliteLocations)
  // console.log('nearbyMobileVetCenters', nearbyMobileVetCenters)
  // console.log('mobileVetCenters', mobileVetCenters)
  const showSatelliteLocations =
    satelliteLocations.length > 0 ||
    nearbyMobileVetCenters.length > 0 ||
    mobileVetCenters.length > 0
  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
            {title && <h1>{title}</h1>}

            <h2
              className="vads-u-margin-top--0 vads-u-margin-bottom--2p5 medium-screen:vads-u-margin-bottom--3"
              id="main-location"
            >
              Main location
            </h2>
            <VetCenterLocationInfo
              vetCenter={fieldOffice}
              isMainOffice={true}
            />

            {showSatelliteLocations && (
              <>
                <h2
                  className="vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 vads-u-margin-bottom--2p5 medium-screen:vads-u-margin-bottom--4"
                  id="satellite-locations"
                >
                  Satellite locations
                </h2>
                <p className="vads-u-margin-bottom--2p5 medium-screen:vads-u-margin-bottom--4">
                  If you can’t make it to our {fieldOffice.title} we offer
                  satellite locations that may be closer to you. These satellite
                  facilities provide select services with the same community,
                  care, and confidentiality in a non-medical setting. Call us
                  for more information about these locations.
                </p>
                {satelliteLocations.map((location) => (
                  <VetCenterLocationInfo
                    key={location.id}
                    vetCenter={location}
                    mainVetCenterPhone={fieldOffice.phoneNumber}
                  />
                ))}

                {mobileVetCenters.map((location) => (
                  <VetCenterLocationInfo
                    key={location.id}
                    vetCenter={location}
                  />
                ))}

                {nearbyMobileVetCenters.map((location) => (
                  <VetCenterLocationInfo
                    key={location.id}
                    vetCenter={location}
                  />
                ))}
              </>
            )}

            <h2
              className="vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 vads-u-margin-bottom--2p5 medium-screen:vads-u-margin-bottom--3"
              id="vet-centers-other-areas"
            >
              Vet Centers in other areas
            </h2>
            <p className="vads-u-font-size--base">
              Looking for a Vet Center in another area?{' '}
              <va-link
                href="/find-locations"
                text="Find a Vet Center location"
              ></va-link>
            </p>

            <va-back-to-top></va-back-to-top>

            <ContentFooter />
          </article>
        </div>
      </div>
    </div>
  )
}
