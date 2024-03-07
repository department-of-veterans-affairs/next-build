import { QueryFormatter } from 'next-drupal-query'
import { queries } from '.'
import { ParagraphQaGroup } from '@/types/drupal/paragraph'
import { QaGroup } from '@/types/formatted/qaGroup'

export const formatter: QueryFormatter<ParagraphQaGroup, QaGroup> = (
  entity: ParagraphQaGroup
) => {
  return {
    questions:
      entity.field_q_as.map?.((item) => ({
        title: item.title,
        answer: queries.formatData('paragraph--wysiwyg', item.field_answer),
      })) || [],
    type: entity.type,
    id: entity.id,
    intro: entity.field_section_intro,
    header: entity.field_section_header,
    displayAccordion: entity.field_accordion_display,
  }
}
