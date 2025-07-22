import { QueryFormatter } from 'next-drupal-query'
import { ParagraphAccordion } from '@/types/drupal/paragraph'
import { AccordionItem } from '@/types/formatted/accordion'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'

export const formatter: QueryFormatter<ParagraphAccordion, AccordionItem> = (
  entity: ParagraphAccordion
) => {
  return {
    type: entity.type as AccordionItem['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    header: entity.field_header || null,
    html: getHtmlFromField(entity.field_rich_wysiwyg),
  }
}
