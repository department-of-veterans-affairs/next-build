import React from 'react'
import { VetCenterLocationListing as FormattedVetCenterLocationListing } from '@/types/formatted/vetCenterLocationListing'
import { ContentFooter } from '@/templates/common/contentFooter'
import { VetCenterInfo } from './VetCenterInfo'

export function VetCenterLocationListing({
  title,
  fieldOffice,
  fieldNearbyMobileVetCenters,
}: FormattedVetCenterLocationListing) {
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

            {fieldOffice && (
              <VetCenterInfo vetCenter={fieldOffice} isMainOffice={true} />
            )}

            {/* TODO: Check if satellite locations exist */}
            <div>TODO: Satellite locations section</div>

            {/* TODO: Nearby vet centers component */}
            <div>TODO: Nearby vet centers component</div>

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
