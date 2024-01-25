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

export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addPageLimit(3)
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

const transformAlert = (alert) => ({
  alertType:
    alert.field_alert_type === 'information' ? 'info' : alert.field_alert_type,
  id: alert.id,
  title: alert.field_alert_title,
  content: {
    header: alert.field_alert_heading,
    text: alert.field_alert_content?.field_wysiwyg?.processed ?? '',
  },
})

export const formatter: QueryFormatter<
  ParagraphAlertSingle[],
  AlertSingle[]
> = (entities: ParagraphAlertSingle[]) => {
  return entities.map((entity) => ({
    id: entity.id,
    alertSelection: entity.field_alert_section ?? null,
    blockReference: entity.field_alert_block_reference
      ? transformAlert(entity.field_alert_block_reference)
      : null,
    nonReusableRef: entity.field_alert_non_reusable_ref
      ? transformAlert(entity.field_alert_non_reusable_ref)
      : null,
  }))
}
