// Define the query params for fetching paragraph--email_contact.
import { ParagraphPhoneNumber } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { PhoneContact } from '@/types/formatted/contactInfo'

export const formatter: QueryFormatter<ParagraphPhoneNumber, PhoneContact> = (
  entity: ParagraphPhoneNumber
) => {
  return {
    id: entity.id,
    label: entity.field_phone_label,
    number: entity.field_phone_number,
    extension: entity.field_phone_extension,
    phoneType: entity.field_phone_number_type,
  }
}