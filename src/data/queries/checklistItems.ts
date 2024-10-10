import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ParagraphChecklistItems } from '@/types/drupal/node'
import { ChecklistItems } from '@/types/formatted/checklistItems'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import { getNestedIncludes } from '@/lib/utils/queries'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_checklist_items',
    'field_section_header',
    'field_section_intro'
  ])
}

export type ChecklistItemsDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

export const data: QueryData<ChecklistItemsDataOpts, ParagraphChecklistItems> = async (
  opts
): Promise<ParagraphChecklistItems> => {
const entity = (await fetchSingleEntityOrPreview(
    opts,
    PARAGRAPH_RESOURCE_TYPES.CHECKLIST,
    params
  )) as ParagraphChecklistItems

  return entity
}

export const formatter: QueryFormatter<ParagraphChecklistItems, ChecklistItems> = (
  entity: ParagraphChecklistItems
) => {
  return {
    items: entity.field_checklist_items,
    header: entity.field_section_header,
    intro: entity.field_section_intro
  }
}
