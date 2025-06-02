import { FieldOfficeHours } from '@/types/drupal/field_type'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'
import { PhoneNumber } from '@/types/formatted/phoneNumber'

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
