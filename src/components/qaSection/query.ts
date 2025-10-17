import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { ParagraphQaSection } from '@/types/drupal/paragraph'
import { QaSection } from '@/components/qaSection/formatted-type'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { getNestedIncludes } from '@/lib/utils/queries'

export const params: QueryParams<null> = () =>
  new DrupalJsonApiParams().addInclude(
    getNestedIncludes('field_questions', PARAGRAPH_RESOURCE_TYPES.QA)
  )

export const formatter: QueryFormatter<ParagraphQaSection, QaSection> = (
  entity: ParagraphQaSection
) => {
  return {
    header: entity.field_section_header,
    intro: entity.field_section_intro || null,
    questions: entity.field_questions
      ? entity.field_questions.map((paragraph) => formatParagraph(paragraph))
      : [],
    displayAccordion: entity.field_accordion_display,
    type: entity.type as QaSection['type'],
    id: entity.id ?? null,
  }
}
