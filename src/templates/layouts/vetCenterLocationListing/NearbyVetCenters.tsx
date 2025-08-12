import React, { useEffect } from 'react'
import { VetCenterLocationListing } from '@/types/formatted/vetCenterLocationListing'
import { FieldAddress } from '@/types/drupal/field_type'

// Extend the Window interface to include the properties needed for the nearby vet centers widget
declare global {
  interface Window {
    mainVetCenterPhone?: string
    mainVetCenterAddress?: FieldAddress
    mainVetCenterId?: string
    satteliteVetCenters?: string[]
  }
}

type NearbyVetCentersProps = Pick<
  VetCenterLocationListing,
  'mainOffice' | 'satelliteLocations'
>

export function NearbyVetCenters({
  mainOffice,
  satelliteLocations,
}: NearbyVetCentersProps) {
  useEffect(() => {
    // Set up the JavaScript variables that the nearby vet centers widget needs
    if (typeof window !== 'undefined') {
      window.mainVetCenterPhone = mainOffice.phoneNumber
      window.mainVetCenterAddress = mainOffice.address
      window.mainVetCenterId = mainOffice.fieldFacilityLocatorApiId
      window.satteliteVetCenters = satelliteLocations.map(
        (location) => location.fieldFacilityLocatorApiId
      )
    }
  }, [mainOffice, satelliteLocations])

  return <div data-widget-type="vet-center-nearby" />
}
