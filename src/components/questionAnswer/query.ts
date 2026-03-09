import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from '@/lib/next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '@/lib/drupal/queries'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeQA } from '@/types/drupal/node'
import { QuestionAnswer } from './formatted-type'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { AlertSingle } from '@/components/alert/formatted-type'
import { ContactInformation } from '@/components/contactInformation/formatted-type'
import { Button } from '@/components/button/formatted-type'
import { BenefitsHubLink } from '@/components/benefitsHubLinks/formatted-type'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'

// Define the query params for fetching node--q_a.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_answer',
    'field_buttons',
    'field_related_benefit_hubs',
    'field_related_information',
    ...getNestedIncludes(
      'field_tags',
      PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS
    ),
    ...getNestedIncludes(
      'field_alert_single',
      PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE
    ),
    ...getNestedIncludes(
      'field_contact_information',
      PARAGRAPH_RESOURCE_TYPES.CONTACT_INFORMATION
    ),
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
  const buttons = (entity.field_buttons?.map((button) =>
    queries.formatData(PARAGRAPH_RESOURCE_TYPES.BUTTON, button)
  ) ?? null) as Button[] | null
  const teasers =
    entity.field_related_information?.map((teaser) =>
      queries.formatData(PARAGRAPH_RESOURCE_TYPES.LINK_TEASER, teaser)
    ) ?? []
  const tags = queries.formatData(
    PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS,
    entity.field_tags
  )
  const benefitsHubLinks = entity.field_related_benefit_hubs
    ? (queries.formatData(
        'benefits-hub-links',
        entity.field_related_benefit_hubs
      ) as BenefitsHubLink[])
    : []

  return {
    ...entityBaseFields(entity),
    answers: entity.field_answer?.field_wysiwyg?.processed ?? '',
    tags,
    buttons,
    teasers,
    alert: formatParagraph(entity.field_alert_single) as AlertSingle | null,
    contactInformation: formatParagraph(
      entity.field_contact_information
    ) as ContactInformation | null,
    benefitsHubLinks,
  }
}
