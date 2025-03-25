import { ParagraphPhoneNumber } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { PhoneNumber } from '@/types/formatted/phoneNumber'

export const formatter: QueryFormatter<ParagraphPhoneNumber, PhoneNumber> = (
  entity: ParagraphPhoneNumber
) => {
  return {
    type: entity.type,
    id: entity.id,
    entityId: entity.drupal_internal__id,
    label: entity.field_phone_label,
    number: entity.field_phone_number,
    extension: entity.field_phone_extension,
    phoneType: entity.field_phone_number_type,
  }
}
