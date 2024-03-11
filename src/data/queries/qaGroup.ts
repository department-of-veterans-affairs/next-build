import { QueryFormatter } from 'next-drupal-query'
import { ParagraphQaGroup } from '@/types/drupal/paragraph'
import { QaGroup } from '@/types/formatted/qaGroup'
import { formatParagraph } from '@/lib/drupal/paragraphs'

export const formatter: QueryFormatter<ParagraphQaGroup, QaGroup> = (
  entity: ParagraphQaGroup
) => {
  // This handles filtering for field_q_as that are not published
  const filteredQAs = entity.field_q_as.filter(
    (item) => item.title || item.field_answer
  )
  return {
    questions:
      filteredQAs.map?.((item) => ({
        question: item.title,
        answers: [formatParagraph(item.field_answer)],
        type: item.type,
        id: item.id,
      })) || [],
    type: entity.type,
    id: entity.id,
    entityId: entity.drupal_internal__id,
    intro: entity.field_section_intro || null,
    header: entity.field_section_header || null,
    displayAccordion: entity.field_accordion_display || false,
  }
}
