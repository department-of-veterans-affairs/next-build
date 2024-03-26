import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { ParagraphQaGroup } from '@/types/drupal/paragraph'
import { QaGroup } from '@/types/formatted/qaGroup'
import { QaGroupQa } from '@/types/formatted/qaGroup'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getNestedIncludes } from '@/lib/utils/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

// Define the query params for fetching paragraph--q_a_group.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_q_as', RESOURCE_TYPES.QA),
  ])
}

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
        type: item.type as QaGroupQa['type'],
        id: item.id,
      })) || [],
    type: entity.type as QaGroup['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    intro: entity.field_section_intro || null,
    header: entity.field_section_header || null,
    displayAccordion: entity.field_accordion_display || false,
  }
}
