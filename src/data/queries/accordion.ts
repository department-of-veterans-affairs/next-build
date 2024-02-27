import { QueryFormatter } from 'next-drupal-query'
import { ParagraphAccordion } from '@/types/drupal/paragraph'
import { AccordionItem } from '@/types/formatted/accordion'

export const formatter: QueryFormatter<ParagraphAccordion, AccordionItem> = (
  entity: ParagraphAccordion
) => {
  return {
    type: entity.type as AccordionItem['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    header: entity.field_header || null,
    html: entity.field_rich_wysiwyg.processed,
  }
}
