import { FormattedCta } from '@/types/formatted/cta'
import { FormattingError } from '../errors/formatting'
import type { CCFieldCta } from '@/types/drupal/paragraph'

export const ccCta = (cta?: CCFieldCta[]): FormattedCta => {
  if (!cta?.length) {
    return null
  }
  const ccItem = cta[0]
  if (
    !ccItem?.field_button_link?.length ||
    !ccItem?.field_button_label?.length
  ) {
    throw new FormattingError(
      'cta:link or label missing: should only be used on a Cta '
    )
  }
  return {
    id: ccItem.target_id, // or pid?
    label: ccItem.field_button_label[0].value,
    url: ccItem.field_button_link[0].uri,
  }
}
