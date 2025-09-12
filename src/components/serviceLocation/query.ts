import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { ParagraphServiceLocation } from '@/types/drupal/paragraph'
import { ServiceLocation } from './formatted-type'
import { createPhoneLinks } from '@/lib/utils/createPhoneLinks'
import { formatter as formatPhone } from '@/components/phoneNumber/query'
import { formatter as formatEmail } from '@/components/emailContact/query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_email_contacts',
    'field_other_phone_numbers',
    'field_service_location_address',
    'field_phone',
  ])
}

const isPublished = (entity: { status: boolean }) => entity.status === true

export const formatter: QueryFormatter<
  ParagraphServiceLocation,
  ServiceLocation
> = (entity) => ({
  type: entity.type as ServiceLocation['type'],
  id: entity.id ?? null,
  officeVisits: entity.field_office_visits,
  virtualSupport: entity.field_virtual_support,
  apptIntroTextType: entity.field_appt_intro_text_type,
  apptIntroTextCustom: createPhoneLinks(entity.field_appt_intro_text_custom),
  appointmentPhoneNumbers: entity.field_other_phone_numbers
    .filter(isPublished)
    .map(formatPhone),
  onlineSchedulingAvail: entity.field_online_scheduling_avail,
  contactInfoPhoneNumbers: entity.field_phone
    .filter(isPublished)
    .map(formatPhone),
  emailContacts: entity.field_email_contacts
    .filter(isPublished)
    .map(formatEmail),
  hours: entity.field_hours,
  officeHours: entity.field_office_hours,
  additionalHoursInfo: entity.field_additional_hours_info,
  useMainFacilityPhone: entity.field_use_main_facility_phone,
  useFacilityPhoneNumber: entity.field_use_facility_phone_number,
  serviceLocationAddress: entity.field_service_location_address,
})
