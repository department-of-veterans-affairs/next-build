// Define the query params for fetching paragraph--button.
import { ParagraphButton } from '@/types/dataTypes/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { ButtonType } from '@/types/index'

export const formatter: QueryFormatter<ParagraphButton, ButtonType> = (
  entity: ParagraphButton
) => {
  return {
    id: entity.id,
    url: entity.field_button_link?.uri || null,
    label: entity.field_button_label || null,
  }
}
