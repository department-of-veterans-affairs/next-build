import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { ParagraphServiceLocationAddress } from '@/types/drupal/paragraph'
import { PhoneNumber } from '@/components/phoneNumber/formatted-type'
import { EmailContact } from '@/components/contactInfo/formatted-type'
import {
  FieldOfficeHours,
} from '@/types/drupal/field_type'

export type ServiceLocation = PublishedParagraph & {
  type: 'paragraph--service_location'
  /** Type of office visits supported (e.g., "no", "yes_appointment_only"). */
  officeVisits?: string
  /** Type of virtual support available (e.g., "yes_veterans_can_call"). */
  virtualSupport?: string
  /** Appointment intro text type ("remove_text", "customize_text", "use_default_text"). */
  apptIntroTextType?:
    | 'remove_text'
    | 'customize_text'
    | 'use_default_text'
    | string
  /** Custom appointment intro text (if applicable). */
  apptIntroTextCustom?: string
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
  onlineSchedulingAvail?: 'yes' | string
  /** Array of email contact objects. */
  emailContacts?: EmailContact[]
  /**
   * Service hours configuration
   *
   * "0" to show facility hours
   * "1" to show no service hours
   * "2" to show specific hours defined in `fieldOfficeHours`
   * */
  hours?: '0' | '1' | '2' | string
  /** Specific service office hours. */
  officeHours?: FieldOfficeHours[]
  /** Additional information about service hours. */
  additionalHoursInfo?: string
  /** Indicates if the main facility phone number should be used (true/false). */
  useMainFacilityPhone?: boolean
  /** Indicates if the facility phone number should be used for appointments (true/false). */
  useFacilityPhoneNumber?: boolean
  /** Optional service location address entity. */
  serviceLocationAddress?: ParagraphServiceLocationAddress
}