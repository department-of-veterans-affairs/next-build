import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeChecklist } from '@/types/drupal/node'
import { Checklist } from '@/types/formatted/checklist'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--checklist.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    // uncomment to add referenced entity data to the response
    // .addInclude([
    //  'field_media',
    //  'field_media.image',
    //  'field_administration',
    // ])
}

// Define the option types for the data loader.
export type ChecklistDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<ChecklistDataOpts, NodeChecklist> = async (
  opts
): Promise<NodeChecklist> => {
const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.CHECKLIST,
    params
  )) as NodeChecklist

  return entity
}

export const formatter: QueryFormatter<NodeChecklist, Checklist> = (
  entity: NodeChecklist
) => {
  const formattedChecklistSections = entity.field_checklist_sections
    ? entity.field_checklist_sections.map(section => {
      return {
        items: section.field_checklist_items,
        header: section.field_section_header,
        intro: section.field_section_intro
      }
    })
    : []

  return {
    ...entityBaseFields(entity),
    sections: formattedChecklistSections
  }
}
