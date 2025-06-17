import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { FacilitySocialLinksProps } from '@/templates/layouts/healthCareLocalFacility/FacilitySocialLinks'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'
import { Administration } from '@/types/formatted/administration'
import { MediaImage } from '@/types/formatted/media'
import { PhoneNumber } from '@/types/formatted/phoneNumber'

import {
  FieldAddress,
  FieldGeoLocation,
  FieldOfficeHours,
} from '../drupal/field_type'
import { FacilityOperatingStatusFlags } from '../drupal/node'
import { ParagraphPhoneNumber } from '../drupal/paragraph'
import { VamcEhr } from '../drupal/vamcEhr'
import { PublishedEntity } from './publishedEntity'
import { FormattedRelatedLinks } from './relatedLinks'
import { SideNavMenu } from './sideNav'
import { EmailContact } from './contactInfo'

export type HealthCareLocalFacility = PublishedEntity & {
  introText: string | null
  operatingStatusFacility: FacilityOperatingStatusFlags
  menu: SideNavMenu | null
  path: string
  administration?: Administration
  vamcEhrSystem: VamcEhr['field_region_page']['field_vamc_ehr_system']
  officeHours: FieldOfficeHours[]
  address: FieldAddress
  phoneNumber: string
  image: MediaImage
  facilityLocatorApiId: string
  geoLocation: FieldGeoLocation
  fieldTelephone: ParagraphPhoneNumber | null
  vaHealthConnectPhoneNumber: string | null
  relatedLinks: FormattedRelatedLinks
  locationServices: Array<{
    title: string
    /**
     * The HTML output of the WYSIWYG editor, processed through `getHtmlFromField()`
     */
    wysiwigContents: string
  }>
  socialLinks: FacilitySocialLinksProps
  lovellVariant?: LovellChildVariant
  lovellSwitchPath?: string
  healthServices: FormattedVAMCFacilityHealthService[]
}

/** Represents the "single" object containing service-related fields. */
interface VamcFacilityServiceLocation {
  /** Type of office visits supported (e.g., "no", "yes_appointment_only"). */
  fieldOfficeVisits?: string
  /** Type of virtual support available (e.g., "yes_veterans_can_call"). */
  fieldVirtualSupport?: string
  /** Appointment intro text type ("remove_text", "customize_text", "use_default_text"). */
  fieldApptIntroTextType?: 'remove_text' | 'customize_text' | 'use_default_text'
  /** Custom appointment intro text (if applicable). */
  fieldApptIntroTextCustom?: string
  /** Array of additional phone numbers for appointments or contact. */
  fieldOtherPhoneNumbers?: PhoneNumber[]
  /** Indicates if online scheduling is available ("yes" or others). */
  fieldOnlineSchedulingAvail?: 'yes' | string
  /** Array of additional contact phone numbers. */
  fieldPhone?: PhoneNumber[]
  /** Array of email contact objects. */
  fieldEmailContacts?: EmailContact[]
  /**
   * Service hours configuration
   *
   * "0" to show facility hours
   * "1" to show no service hours
   * "2" to show specific hours defined in `fieldOfficeHours`
   * */
  fieldHours?: '0' | '1' | '2' | string
  /** Specific service office hours. */
  fieldOfficeHours?: FieldOfficeHours[]
  /** Additional information about service hours. */
  fieldAdditionalHoursInfo?: string
  /** Indicates if the main facility phone number should be used (true/false). */
  fieldUseMainFacilityPhone?: boolean
  /** Indicates if the facility phone number should be used for appointments (true/false). */
  fieldUseFacilityPhoneNumber?: boolean
  /** Optional service location address entity. */
  fieldServiceLocationAddress?: ParagraphServiceLocationAddress
}

/** Represents the main input data structure for the service location template. */
export interface ServiceLocationTemplateData {
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
  /**
   * Telephone object for mental health, containing an entity with phone details.
   * This comes from the top-level VAMC facility.
   */
  fieldTelephone?: PhoneNumber
  /** Optional fallback main phone number. */
  fieldPhoneNumber?: string
  /** Flag indicating if the service is a mental health service (true/false). */
  isMentalHealthService?: boolean
  /**
   * Nested object containing many other service-related fields.
   * TODO: Rename this silly thing (for now, it's just naming parity with the
   * content build template)
   */
  single: VamcFacilityServiceLocation
}

export interface FormattedVAMCFacilityHealthService {
  /** Name of the service taxonomy for the regional health service. */
  name: string
  /** Comes from the service taxonomy of the regional health service. */
  fieldAlsoKnownAs?: string
  /** Comes from the service taxonomy of the regional health service. */
  fieldCommonlyTreatedCondition?: string
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
  /** Locations associated with this service */
  locations: ServiceLocationTemplateData[]
  fieldFacilityLocatorApiId?: string
  fieldHealthServiceApiId?: string
  /** Fallback content */
  localServiceDescription?: string
}
