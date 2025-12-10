import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { Administration } from '@/components/administration/formatted-type'
import { MediaImage } from '@/components/mediaDocument/formatted-type'
import { PhoneNumber } from '@/components/phoneNumber/formatted-type'

import {
  FieldAddress,
  FieldGeoLocation,
  FieldOfficeHours,
} from '@/types/drupal/field_type'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import { VamcEhr } from '@/types/drupal/vamcEhr'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { VamcSystemSocialLinks } from '../vamcSystem/formatted-type'
import { ServiceLocation } from '@/components/serviceLocation/formatted-type'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/formatted-type'

export type VamcFacility = PublishedEntity & {
  introText: string | null
  operatingStatusFacility: FacilityOperatingStatusFlags
  menu: SideNavMenu | null
  path: string
  administration?: Administration
  vamcSystemTitle: string
  vamcEhrSystem: VamcEhr['field_region_page']['field_vamc_ehr_system']
  officeHours: FieldOfficeHours[]
  address: FieldAddress
  /**
   * Main phone number for the facility.
   *
   * Comes from `facilityEntity.field_phone_number`
   */
  mainPhoneString: string
  image: MediaImage
  facilityLocatorApiId: string
  geoLocation: FieldGeoLocation
  /**
   * Comes from `facilityEntity.field_telephone`
   */
  mentalHealthPhoneNumber: PhoneNumber | null
  vaHealthConnectPhoneNumber: string | null
  relatedLinks: ListOfLinkTeasers
  locationServices: Array<{
    title: string
    /**
     * The HTML output of the WYSIWYG editor, processed through `getHtmlFromField()`
     */
    wysiwigContents: string
  }>
  socialLinks: VamcSystemSocialLinks
  lovellVariant?: LovellChildVariant
  lovellSwitchPath?: string
  healthServices: VamcFacilityHealthService[]
}

export interface VamcFacilityHealthService {
  /** Name of the service taxonomy for the regional health service. */
  name: string
  /** Comes from the service taxonomy of the regional health service. */
  fieldAlsoKnownAs?: string
  /** Comes from the service taxonomy of the regional health service. */
  fieldCommonlyTreatedCondition?: string
  /**
   * Indicates if a referral is required
   *
   * "0" for no
   * "1" for yes
   * "2", "not_applicable", or "unknown" to omit the referral section
   */
  fieldReferralRequired?:
    | '0'
    | '1'
    | '2'
    | 'not_applicable'
    | 'unknown'
    | string
  description?: string
  /** Comes from the service taxonomy of the regional health service. */
  entityId: string | number
  /**
   * The machine name without the entity type prefix, e.g.,
   * "health_care_local_health_service".
   */
  entityBundle: string
  /**
   * This comes from the VAMC System Health Service found at `field_retional`
   */
  fieldBody?: string
  /** Flag indicating if this is a mental health service */
  isMentalHealthService?: boolean
  /** Locations associated with this service */
  locations: ServiceLocation[]
  fieldFacilityLocatorApiId?: string
  fieldHealthServiceApiId?: string
  /** Fallback content */
  localServiceDescription?: string
}
