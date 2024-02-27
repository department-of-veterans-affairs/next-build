import { QueryFormatter } from 'next-drupal-query'
import { ParagraphAlert } from '@/types/drupal/paragraph'
import { Alert, AlertBlock, AlertType } from '@/types/formatted/alert'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { queries } from '.'

export const formatter: QueryFormatter<ParagraphAlert, Alert> = (
  entity: ParagraphAlert
) => {
  return {
    type: entity.type as Alert['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    alertType: entity.field_alert_type as AlertType,
    heading: entity.field_alert_heading,
    blockReference: queries.formatData(
      'block--alert',
      entity.field_alert_block_reference
    ) as AlertBlock,
    paragraphs: entity.field_va_paragraphs.map(formatParagraph),
  }
}
