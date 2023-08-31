import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { NodeQA } from '@/types/dataTypes/drupal/node'
import { QuestionAnswerType } from '@/types/index'

// Define the query params for fetching node--q_a.
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude([
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
  const entity = await drupalClient.getResource<NodeQA>('node--q_a', opts?.id, {
    params: params().getQueryObject(),
  })

  return entity
}

export const formatter: QueryFormatter<NodeQA, QuestionAnswerType> = (
  entity: NodeQA
) => {
  const buttons = entity.field_buttons?.map((button) => {
    return queries.formatData('paragraph--button', button)
  })
  const teasers = entity.field_related_information?.map((teaser) => {
    return queries.formatData('paragraph--link_teaser', teaser)
  })
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    title: entity.title,
    answers: entity.field_answer?.field_wysiwyg?.processed,
    tags: queries.formatData('paragraph--audience_topics', entity.field_tags),
    buttons: buttons,
    teasers: teasers,
    // contact: entity.field_contact_information, component is available to frontend
    //  alert: entity.field_alert_single, || component is available to frontend
    //  benefits: entity.field_related_benefit_hubs, || component is available to frontend
  }
}
