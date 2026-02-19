import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { ParagraphQA } from '@/types/drupal/paragraph'
import { QaParagraph } from '@/components/qaParagraph/formatted-type'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { getNestedIncludes } from '@/lib/utils/queries'

export const params: QueryParams<null> = () =>
  new DrupalJsonApiParams().addInclude(
    getNestedIncludes('field_answer', [
      PARAGRAPH_RESOURCE_TYPES.ALERT,
      PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL,
    ])
  )

export const formatter: QueryFormatter<ParagraphQA, QaParagraph> = (
  entity: ParagraphQA
) => {
  return {
    type: entity.type as QaParagraph['type'],
    question: entity.field_question,
    answers: entity.field_answer
      ? entity.field_answer.map((paragraph) => formatParagraph(paragraph))
      : [],
    id: entity.id ?? null,
  }
}
