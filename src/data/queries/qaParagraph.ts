import { QueryFormatter } from 'next-drupal-query'
import { ParagraphQA } from '@/types/drupal/paragraph'
import { QaParagraph } from '@/types/formatted/qaParagraph'
import { formatParagraph } from '@/lib/drupal/paragraphs'

export const formatter: QueryFormatter<ParagraphQA, QaParagraph> = (
  entity: ParagraphQA
) => {
  return {
    type: entity.type as QaParagraph['type'],
    question: entity.field_question,
    answers: entity.field_answer.map?.(formatParagraph) || [],
    id: entity.id,
  }
}
