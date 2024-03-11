import { QueryFormatter } from 'next-drupal-query'
import { ParagraphQaGroup } from '@/types/drupal/paragraph'
import { QaGroup } from '@/types/formatted/qaGroup'
import { formatParagraph } from '@/lib/drupal/paragraphs'

export const formatter: QueryFormatter<ParagraphQaGroup, QaGroup> = (
  entity: ParagraphQaGroup
) => {
  return {
    questions:
      entity.field_q_as.map?.((item) => ({
        title: item.title,
        answer: formatParagraph(item.field_answer),
      })) || [],
    type: entity.type,
    id: entity.id,
    entityId: entity.drupal_internal__id,
    intro: entity.field_section_intro ?? null,
    header: entity.field_section_header ?? null,
    displayAccordion: entity.field_accordion_display ?? false,
  }
}
