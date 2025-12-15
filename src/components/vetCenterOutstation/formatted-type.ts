import {
  FieldGeoLocation,
  FieldOfficeHours,
  FieldAdministration,
  FieldAddress,
} from '@/types/drupal/field_type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VetCenterHealthServices as FormattedHealthServices } from '@/components/vetCenterHealthServices/formatted-type'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import { MediaImage as FormattedMediaImage } from '@/components/mediaDocument/formatted-type'

export type VetCenterOutstation = PublishedEntity & {
  address: FieldAddress
  geolocation: FieldGeoLocation | null
  introText?: string | null
  lastSavedByAnEditor: string | null
  officeHours: FieldOfficeHours[] | null
  officialName?: string | null
  operatingStatusFacility?: FacilityOperatingStatusFlags | null
  operatingStatusMoreInfo?: string | null
  phoneNumber: string
  timezone?: string | null
  administration?: FieldAdministration | null
  healthServices: FormattedHealthServices
  counselingHealthServices: FormattedHealthServices
  referralHealthServices: FormattedHealthServices
  otherHealthServices: FormattedHealthServices
  image: FormattedMediaImage | null
  fieldFacilityLocatorApiId: string
  path: string
  /**
   * Derived from `path` (no parent-entity fetch): `/<vet-center>/<outstation>` -> `/<vet-center>`.
   * Used for linking to the Vet Center locations listing.
   */
  officePath?: string | null
}
