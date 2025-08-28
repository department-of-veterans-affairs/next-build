import { PublishedEntity } from '@/types/formatted/publishedEntity'
import {
  FieldAddress,
  FieldGeoLocation,
  FieldOfficeHours,
} from '@/types/drupal/field_type'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import { MediaImage as FormattedMediaImage } from '@/components/mediaDocument/formatted-type'

/**
 * Common fields shared across all Vet Center types (both full and listing versions).
 */
export type CommonVetCenterFields = {
  title: string
  path: string
  // administration: FieldAdministration
  address: FieldAddress
  geolocation: FieldGeoLocation | null
  lastSavedByAnEditor: string | null
  image: FormattedMediaImage | null
  fieldFacilityLocatorApiId: string
}

/**
 * Main Vet Center info type for location listings.
 * This is a simplified version of VetCenter for listing purposes.
 */
export type VetCenterLocationInfo = PublishedEntity &
  CommonVetCenterFields & {
    type: 'node--vet_center'
    officialName: string
    phoneNumber: string
    officeHours: FieldOfficeHours[]
    operatingStatusFacility: FacilityOperatingStatusFlags
    operatingStatusMoreInfo: string | null
  }

/**
 * Vet Center CAP info type for location listings.
 * This is a simplified version of VetCenterCap for listing purposes.
 */
export type VetCenterCapLocationInfo = PublishedEntity &
  CommonVetCenterFields & {
    type: 'node--vet_center_cap'
    geographicalIdentifier: string
    vetCenterCapHoursOptIn: boolean
    operatingStatusFacility: FacilityOperatingStatusFlags
    operatingStatusMoreInfo: string | null
    officeHours: FieldOfficeHours[]
  }

export type VetCenterOutstationLocationInfo = PublishedEntity &
  CommonVetCenterFields & {
    type: 'node--vet_center_outstation'
    operatingStatusFacility: FacilityOperatingStatusFlags
    operatingStatusMoreInfo: string | null
    phoneNumber: string
    officeHours: FieldOfficeHours[]
    officialName: string
  }

/**
 * Vet Center Mobile Vet Center info type for location listings.
 * This is a simplified version of VetCenterMobileVetCenter for listing purposes.
 */
export type MobileVetCenterLocationInfo = PublishedEntity &
  CommonVetCenterFields & {
    type: 'node--vet_center_mobile_vet_center'
    phoneNumber: string
  }

/**
 * Union type for all Vet Center info types used in location listings.
 */
export type VetCenterInfoVariant =
  | VetCenterLocationInfo
  | VetCenterCapLocationInfo
  | VetCenterOutstationLocationInfo
  | MobileVetCenterLocationInfo

export type VetCenterLocationListing = PublishedEntity & {
  title: string
  mainOffice: VetCenterLocationInfo
  nearbyMobileVetCenters: MobileVetCenterLocationInfo[]
  mobileVetCenters: MobileVetCenterLocationInfo[]
  satelliteLocations: (
    | VetCenterCapLocationInfo
    | VetCenterOutstationLocationInfo
  )[]
}
