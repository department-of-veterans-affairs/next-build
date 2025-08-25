import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '@/data/queries'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeQA } from '@/types/drupal/node'
import { QuestionAnswer } from './formatted-type'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'

// Define the query params for fetching node--q_a.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_answer',
    'field_buttons',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_tags.field_topics',
    'field_tags.field_audience_beneficiares',
    'field_tags.field_non_beneficiares',
    // 'field_administration',
    // 'field_alert_single',
    // 'field_contact_information',
    // 'field_other_categories',
    // 'field_primary_category'
  ])
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, NodeQA> = async (
  opts
): Promise<NodeQA> => {
  const entity = await drupalClient.getResource<NodeQA>(
    RESOURCE_TYPES.QA,
    opts?.id,
    {
      params: params().getQueryObject(),
    }
  )

  return entity
}

export const formatter: QueryFormatter<NodeQA, QuestionAnswer> = (
  entity: NodeQA
) => {
  const buttons = entity.field_buttons?.map((button) => {
    return queries.formatData(PARAGRAPH_RESOURCE_TYPES.BUTTON, button)
  })
  const teasers = entity.field_related_information?.map((teaser) => {
    return queries.formatData(PARAGRAPH_RESOURCE_TYPES.LINK_TEASER, teaser)
  })
  return {
    id: entity.id,
    type: entity.type,
    entityPath: entity.path.alias,
    entityId: entity.drupal_internal__nid,
    published: entity.status,
    title: entity.title,
    answers: entity.field_answer?.field_wysiwyg?.processed,
    tags: queries.formatData(
      PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS,
      entity.field_tags
    ),
    buttons: buttons,
    teasers: teasers,
    lastUpdated: entity.field_last_saved_by_an_editor || entity.created,
    // contact: entity.field_contact_information, component is available to frontend
    //  alert: entity.field_alert_single, || component is available to frontend
    //  benefits: entity.field_related_benefit_hubs, || component is available to frontend
  }
}
