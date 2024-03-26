// Define the query params for fetching block--alert.
import { QueryFormatter } from 'next-drupal-query'
import { AlertType, AlertNonReusable } from '@/types/formatted/alert'
import { ParagraphNonReusableAlert } from '@/types/drupal/paragraph'
import { formatParagraph } from '@/lib/drupal/paragraphs'

export const formatter: QueryFormatter<
  ParagraphNonReusableAlert,
  AlertNonReusable
> = (entity: ParagraphNonReusableAlert) => {
  if (!entity) {
    return null
  }

  return {
    type: entity.type as AlertNonReusable['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    alertType: (entity.field_alert_type === 'information'
      ? 'info'
      : entity.field_alert_type) as AlertType,
    heading: entity.field_alert_heading,
    paragraphs: entity.field_va_paragraphs.map(formatParagraph),
  }
}
