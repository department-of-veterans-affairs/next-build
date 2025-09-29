// Define the query params for fetching paragraph--button.
import { ParagraphButton } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { Button } from '@/components/button/formatted-type'

export const formatter: QueryFormatter<ParagraphButton, Button> = (
  entity: ParagraphButton
) => {
  return {
    type: entity.type as Button['type'],
    id: entity.id || null,
    entityId: entity.drupal_internal__id || null,
    // Paragraph entities pulled in via entity_field_fetch only have a uri and
    // no url field, so the url field is unreliable at the moment
    url: entity.field_button_link?.url || entity.field_button_link?.uri || null,
    label: entity.field_button_label || null,
  }
}
