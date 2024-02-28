import { QueryFormatter } from 'next-drupal-query'
import { ParagraphQaParagraph } from '@/types/drupal/paragraph'
import { QaParagraph } from '@/types/formatted/qaParagraph'

export const formatter: QueryFormatter<ParagraphQaParagraph, QaParagraph> = (
  entity: ParagraphQaParagraph
) => {
  return {
    question: entity.field_question,
    answers: entity.field_answer.map(paragraphWysiwyg => paragraphWysiwyg.field_wysiwyg),
    type: entity.type,
    id: entity.drupal_internal__id
  }
}
