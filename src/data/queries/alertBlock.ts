// Define the query params for fetching block--alert.
import { BlockAlert } from '@/types/drupal/block'
import { QueryFormatter } from 'next-drupal-query'
import { AlertBlock, AlertType } from '@/types/formatted/alert'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { ExpandableText } from '@/types/formatted/expandableText'

export const formatter: QueryFormatter<BlockAlert, AlertBlock> = (
  entity: BlockAlert
) => {
  if (!entity) {
    return null
  }

  return {
    alertType: (entity.field_alert_type === 'information'
      ? 'info'
      : entity.field_alert_type) as AlertType,
    id: entity.id,
    title: entity.field_alert_title,
    content: formatParagraph(entity.field_alert_content) as
      | Wysiwyg
      | ExpandableText,
    // {
    //   header:
    //     entity.field_alert_content.field_text_expander ??
    //     entity.field_alert_heading,
    //   text: entity.field_alert_content?.field_wysiwyg?.processed ?? '',
    // },
  }
}
