import { PublishedEntity } from './publishedEntity'
import {
  FieldAddress,
  FieldGeoLocation,
  FieldOfficeHours,
} from '../drupal/field_type'
import { FacilityOperatingStatusFlags } from '../drupal/node'
import { MediaImage as FormattedMediaImage } from './media'

/**
 * Common fields shared across all Vet Center types (both full and listing versions).
 */
export type CommonVetCenterFields = {
  title: string
  path: string
  // administration: FieldAdministration
  address: FieldAddress
  geolocation: FieldGeoLocation
  lastSavedByAnEditor: string | null
  image: FormattedMediaImage
  fieldFacilityLocatorApiId: string
}

/**
 * Main Vet Center info type for location listings.
 * This is a simplified version of VetCenter for listing purposes.
 */
export type VetCenterInfo = CommonVetCenterFields & {
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
export type VetCenterCapInfo = CommonVetCenterFields & {
  type: 'node--vet_center_cap'
  geographicalIdentifier: string
  vetcenterCapHoursOptIn: boolean
  operatingStatusFacility: FacilityOperatingStatusFlags
  operatingStatusMoreInfo: string | null
}

/**
 * Vet Center Mobile Vet Center info type for location listings.
 * This is a simplified version of VetCenterMobileVetCenter for listing purposes.
 */
export type VetCenterMobileVetCenterInfo = CommonVetCenterFields & {
  type: 'node--vet_center_mobile_vet_center'
  phoneNumber: string
}

/**
 * Union type for all Vet Center info types used in location listings.
 */
export type VetCenterInfoVariant =
  | VetCenterInfo
  | VetCenterCapInfo
  | VetCenterMobileVetCenterInfo

export type VetCenterLocationListing = PublishedEntity & {
  title: string
  fieldOffice: VetCenterInfo
  fieldNearbyMobileVetCenters: VetCenterMobileVetCenterInfo[]
}
