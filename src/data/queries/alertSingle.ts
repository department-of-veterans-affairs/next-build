import {
  QueryData,
  QueryFormatter,
  QueryParams,
  QueryOpts,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '.'
import { ParagraphAlertSingle } from '@/types/drupal/paragraph'
import { AlertSingle } from '@/types/formatted/alertSingle'
import { transformAlertData } from '@/lib/drupal/query'

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_alert_block_reference',
      'field_alert_block_reference.field_alert_content',
      'field_alert_non_reusable_ref',
      'field_alert_non_reusable_ref.field_va_paragraphs',
    ])
}

type DataOpts = QueryOpts<null>

export const data: QueryData<DataOpts, AlertSingle[]> = async (
  opts
): Promise<AlertSingle[]> => {
  const entities = await drupalClient.getResourceCollection<AlertSingle[]>(
    'paragraph--alert_single',
    {
      params: params().getQueryObject(),
    }
  )

  return entities
}

export const formatter: QueryFormatter<
  ParagraphAlertSingle[],
  AlertSingle[]
> = (entities: ParagraphAlertSingle[]) => {
  return entities.map((entity) => ({
    id: entity.id,
    alertSelection: entity.field_alert_section ?? null,
    blockReference: entity.field_alert_block_reference
      ? transformAlertData(entity.field_alert_block_reference)
      : null,
    nonReusableRef: entity.field_alert_non_reusable_ref
      ? transformAlertData(entity.field_alert_non_reusable_ref)
      : null,
  }))
}
