import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from '@/lib/next-drupal-query'
import {
  DoNotPublishError,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
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
import { formatButtonArray } from '@/components/button/query'
import { formatLinkTeaserArray } from '@/components/linkTeaser/query'
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
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.QA,
    params
  )) as NodeQA

  return entity
}

export const formatter: QueryFormatter<NodeQA, QuestionAnswer> = (
  entity: NodeQA
) => {
  if (!entity.field_standalone_page) {
    throw new DoNotPublishError('this Q&A is not a standalone page')
  }

  return {
    ...entityBaseFields(entity),
    answers: entity.field_answer?.field_wysiwyg?.processed ?? '',
    alert: formatParagraph(entity.field_alert_single) as AlertSingle | null,
    buttons: formatButtonArray(entity.field_buttons),
    teasers: formatLinkTeaserArray(entity.field_related_information),
    benefitsHubLinks: queries.formatData(
      'benefits-hub-links',
      entity.field_related_benefit_hubs
    ),
    tags: queries.formatData(
      PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS,
      entity.field_tags
    ),
    contactInformation: formatParagraph(
      entity.field_contact_information
    ) as ContactInformation | null,
  }
}
