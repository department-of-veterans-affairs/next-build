import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { queries } from '.'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { PARAGRAPH_RESOURCE_TYPES, RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { getNestedIncludes } from '@/lib/utils/queries'

// Types
import { AlertSingle } from '@/types/formatted/alert'
import { Button } from '@/types/formatted/button'
import { Checklist } from '@/types/formatted/checklist'
import { ChecklistItem } from '@/types/formatted/checklistItem'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { NodeChecklist } from '@/types/drupal/node'
import { TaxonomyTermLcCategories } from '@/types/drupal/taxonomy_term'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes(
      'field_alert_single',
      PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE
    ),
    'field_buttons',
    'field_checklist.field_checklist_sections',
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

export type ChecklistDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

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
  return {
    ...entityBaseFields(entity),
    alert: formatParagraph(entity.field_alert_single) as AlertSingle,
    buttons: entity.field_buttons.map?.(formatParagraph) as Button[],
    checklist: entity.field_checklist.field_checklist_sections?.map(section =>
      queries.formatData(
        PARAGRAPH_RESOURCE_TYPES.CHECKLIST,
        section
      )
    ) as ChecklistItem[],
    contactInformation: formatParagraph(
      entity.field_contact_information
    ) as ContactInfo,
    intro: entity.field_intro_text_limited_html.processed,
    otherCategories: entity.field_other_categories.map?.(formatParagraph) as TaxonomyTermLcCategories[],
    primaryCategory: entity.field_primary_category,
    repeatButtons: entity.field_buttons_repeat,
  }
}
