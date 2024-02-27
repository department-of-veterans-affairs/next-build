import { QueryFormatter } from 'next-drupal-query'
import { ParagraphAlertSingle } from '@/types/drupal/paragraph'
import {
  AlertSingle,
  AlertBlock,
  AlertNonReusable,
} from '@/types/formatted/alert'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { queries } from '.'

// TODO:
//
// EDIT:
// It seems *maybe* that next-drupal-query is designed to handle this already.
// You can pass an `id` to queries.getParams().
// E.g.
// queries.getParams('paragraph--alert_single'))
//
// We don't need this here:
// export const params: QueryParams<null> = () => {
//   return queries
//     .getParams()
//     .addInclude([
//       'field_alert_block_reference',
//       'field_alert_block_reference.field_alert_content',
//       'field_alert_non_reusable_ref',
//       'field_alert_non_reusable_ref.field_va_paragraphs',
//     ])
// }
//
// ...but it seems like we might want to define
// paragraph-specific `includes` within the paragraph's
// query file (this file), and then somehow reference these in
// the node query when we need to include fields of a specific
// paragraph type.
//
// E.g.
// export const include = [
//   'field_alert_block_reference',
//   'field_alert_block_reference.field_alert_content',
//   'field_alert_non_reusable_ref',
//   'field_alert_non_reusable_ref.field_va_paragraphs',
// ]
//
// /* Some util file*/
// export const getIncludedSubFields = (
//   parentField: string,
//   subFields: string[]
// ) => [parentField, ...subFields.map((subField) => `${parentField}.${subField}`)]
//
// /* src/data/queries/resourcesSupport.ts */
// import { include } from '@/data/queries/alertSingle'
// export const params: QueryParams<null> = () => {
//   return queries.getParams().addInclude([
//     ...getIncludedSubFields('field_alert_single', include)
//   ])
// }

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
