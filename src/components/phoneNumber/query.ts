import { ParagraphPhoneNumber } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { PhoneNumber } from '@/components/phoneNumber/formatted-type'

export const formatter: QueryFormatter<
  ParagraphPhoneNumber,
  PhoneNumber | null
> = (entity: ParagraphPhoneNumber) => {
  if (!entity) {
    return null
  }
  return {
    type: entity.type as PhoneNumber['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    label: entity.field_phone_label,
    number: entity.field_phone_number,
    extension: entity.field_phone_extension,
    phoneType: entity.field_phone_number_type,
  }
}
