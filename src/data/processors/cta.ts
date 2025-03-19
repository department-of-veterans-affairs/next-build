import { FormattedCta } from '@/types/formatted/cta'
import { FormattingError } from '../errors/formatting'
import type { CCFeaturedContentCTAButton } from '@/types/drupal/paragraph'

export const processCta = (cta: CCFeaturedContentCTAButton): FormattedCta => {
  if (!cta?.field_button_link?.length || !cta?.field_button_label?.length) {
    throw new FormattingError('cta:link or label')
  }
  return {
    id: cta.target_id,
    label: cta.field_button_label[0].value,
    url: cta.field_button_link[0].uri,
  }
}
