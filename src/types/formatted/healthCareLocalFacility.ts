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
  healthServices: FormattedHealthServices[]
}

/** Represents an email contact with optional label and required email address. */
interface EmailContact {
  /** Optional label for the email contact (e.g., "Support"). */
  fieldEmailLabel?: string
  /** The email address (e.g., "example@va.gov"). */
  fieldEmailAddress: string
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
  /** Service hours configuration ("0" for facility hours, "1" for unspecified, "2" for specific hours). */
  fieldHours?: '0' | '1' | '2' | string
  /** Specific service office hours (array of hour objects). */
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
  /** Type of location ("nonclinical", "vba", or other values). */
  typeOfLocation: 'nonclinical' | 'vba' | string
  /** Header level used for subheadings (e.g., 2, 3, 4, etc.). */
  serviceLocationSubHeaderLevel: number | string
  /** Optional service header text. */
  serviceHeader?: string
  /** Optional service description text. */
  serviceDescription?: string
  /** Unique entity ID for generating DOM IDs or tracking. */
  entityId: string | number
  /**
   * Indicates if a referral is required
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
  /** Telephone object for mental health or main contact, containing an entity with phone details. */
  fieldTelephone?: PhoneNumber
  /** Optional fallback main phone number. */
  fieldPhoneNumber?: string
  /** Flag indicating if the service is a mental health service (true/false). */
  isMentalHealthService?: boolean
  /** Nested object containing many other service-related fields. */
  single: VamcFacilityServiceLocation
}

export interface FormattedHealthServices {
  // Main health service metadata
  name: string
  fieldAlsoKnownAs?: string
  fieldCommonlyTreatedCondition?: string
  fieldTricareDescription?: string
  description?: {
    processed: string
  }
  entityId: string | number
  entityBundle: string
  fieldBody?: {
    processed: string
  }

  // Locations associated with this service
  locations: ServiceLocationTemplateData[]

  // Facility data
  fieldFacilityLocatorApiId?: string

  // Fallback content
  localServiceDescription?: string
}
