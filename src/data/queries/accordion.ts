import { QueryFormatter } from 'next-drupal-query'
import { ParagraphAccordion } from '@/types/drupal/paragraph'
import { Accordion } from '@/types/formatted/accordion'

export const formatter: QueryFormatter<ParagraphAccordion, Accordion> = (
  entity: ParagraphAccordion
) => {
  return {
    id: entity.id,
    header: entity.field_header || null,
    html: entity.field_rich_wysiwyg.processed,
  }
}
