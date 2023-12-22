// Define the query params for fetching block--alert.
import { BlockAlert } from '@/types/drupal/block'
import { QueryFormatter } from 'next-drupal-query'
import { Alert } from '@/types/formatted/alert'

export const formatter: QueryFormatter<BlockAlert, Alert> = (
  entity: BlockAlert
) => {
  return {
    alertType:
      entity.field_alert_type === 'information'
        ? 'info'
        : entity.field_alert_type,
    id: entity.id,
    title: entity.field_alert_title,
    content: {
      header: entity.field_alert_content.field_text_expander,
      text: entity.field_alert_content.field_wysiwyg.processed,
    },
  }
}
