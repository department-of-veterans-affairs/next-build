// Define the query params for fetching paragraph--button.
import { ParagraphButton } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { Button } from '@/types/formatted/button'

export const formatter: QueryFormatter<ParagraphButton, Button> = (
  entity: ParagraphButton
) => {
  return {
    type: entity.type as Button['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    url: entity.field_button_link?.uri || null,
    label: entity.field_button_label || null,
  }
}
