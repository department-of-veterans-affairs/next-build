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
export interface VamcFacilityServiceLocation {
  /** Type of office visits supported (e.g., "no", "yes_appointment_only"). */
  fieldOfficeVisits?: string
  /** Type of virtual support available (e.g., "yes_veterans_can_call"). */
  fieldVirtualSupport?: string
  /** Appointment intro text type ("remove_text", "customize_text", "use_default_text"). */
  fieldApptIntroTextType?: 'remove_text' | 'customize_text' | 'use_default_text'
  /** Custom appointment intro text (if applicable). */
  fieldApptIntroTextCustom?: string
  /**
   * Array of additional phone numbers for appointments or contact.
   *
   * Comes from `location.field_other_phone_numbers`
   */
  appointmentPhoneNumbers?: PhoneNumber[]
  /**
   * Array of additional contact phone numbers.
   *
   * Comes from `location.field_phone`
   */
  contactInfoPhoneNumbers?: PhoneNumber[]
  /** Indicates if online scheduling is available ("yes" or others). */
  fieldOnlineSchedulingAvail?: 'yes' | string
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

export interface FormattedVAMCFacilityHealthService {
  /** Name of the service taxonomy for the regional health service. */
  name: string
  /** Comes from the service taxonomy of the regional health service. */
  fieldAlsoKnownAs?: string
  /** Comes from the service taxonomy of the regional health service. */
  fieldCommonlyTreatedCondition?: string
  /** Referral requirement for the service */
  fieldReferralRequired?: string
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
  locations: VamcFacilityServiceLocation[]
  fieldFacilityLocatorApiId?: string
  fieldHealthServiceApiId?: string
  /** Fallback content */
  localServiceDescription?: string
}
