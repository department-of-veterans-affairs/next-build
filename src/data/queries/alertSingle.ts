import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ParagraphAlertSingle } from '@/types/drupal/paragraph'
import {
  AlertSingle,
  AlertBlock,
  AlertNonReusable,
} from '@/types/formatted/alert'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { queries } from '.'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_alert_block_reference',
    'field_alert_block_reference.field_alert_content',
    'field_alert_non_reusable_ref',
    'field_alert_non_reusable_ref.field_va_paragraphs',
  ])
}

export const formatter: QueryFormatter<ParagraphAlertSingle, AlertSingle> = (
  entity: ParagraphAlertSingle
) => {
  return {
    type: entity.type as AlertSingle['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    alertSelection:
      entity.field_alert_selection as AlertSingle['alertSelection'],
    blockReference: queries.formatData(
      'block--alert',
      entity.field_alert_block_reference
    ) as AlertBlock,
    nonReusableRef: formatParagraph(
      entity.field_alert_non_reusable_ref
    ) as AlertNonReusable,
  }
}
