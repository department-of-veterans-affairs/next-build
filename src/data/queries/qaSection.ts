import { QueryFormatter } from 'next-drupal-query'
import { ParagraphQaSection } from '@/types/drupal/paragraph'
import { QaSection } from '@/types/formatted/qaSection'
import { formatParagraph } from '@/lib/drupal/paragraphs'


export const formatter: QueryFormatter<ParagraphQaSection, QaSection> = (
  entity: ParagraphQaSection
) => {
  // console.log('cbu04905header: ', entity.field_section_header)

  return {
    header: entity.field_section_header,
    intro: entity.field_section_intro || null,
    questions: entity.field_questions
      ? entity.field_questions.map(formatParagraph)
      : [],
    displayAccordion: entity.field_accordion_display,
    type: entity.type as QaSection['type'],
    id: entity.id,
  }
}
