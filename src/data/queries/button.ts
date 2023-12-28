// Define the query params for fetching paragraph--button.
import { ParagraphButton } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { Button } from '@/types/formatted/button'

export const formatter: QueryFormatter<ParagraphButton, Button> = (
  entity: ParagraphButton
) => {
  return {
    id: entity.id,
    url: entity.field_button_link?.uri || null,
    label: entity.field_button_label || null,
  }
}
