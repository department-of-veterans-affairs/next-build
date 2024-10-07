import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Types
import { AlertSingle } from '@/types/formatted/alert'
import { AudienceTopics } from '@/types/formatted/audienceTopics'
import { Button } from '@/types/formatted/button'
import { Checklist } from '@/types/formatted/checklist'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { NodeChecklist } from '@/types/drupal/node'
import { TaxonomyTermLcCategories } from '@/types/drupal/taxonomy_term'

// Define the query params for fetching node--checklist.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes(
      'field_alert_single',
      PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE
    ),
    'field_buttons',
    ...getNestedIncludes(
      'field_contact_information',
      PARAGRAPH_RESOURCE_TYPES.CONTACT_INFORMATION
    ),
    'field_related_benefit_hubs',
    'field_related_information',
    ...getNestedIncludes(
      'field_tags',
      PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS
    ),
  ])
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
    alert: formatParagraph(entity.field_alert_single) as AlertSingle,
    buttons: entity.field_buttons.map?.(formatParagraph) as Button[],
    contactInformation: formatParagraph(
      entity.field_contact_information
    ) as ContactInfo,
    intro: entity.field_intro_text_limited_html.processed,
    otherCategories: entity.field_other_categories.map?.(formatParagraph) as TaxonomyTermLcCategories[],
    primaryCategory: entity.field_primary_category,
    repeatButtons: entity.field_buttons_repeat,
    sections: formattedChecklistSections,
  }
}
