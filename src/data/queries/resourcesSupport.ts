import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { NodeSupportResourcesDetailPage } from '@/types/drupal/node'
import { ResourcesSupport } from '@/types/formatted/resourcesSupport'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { AlertSingle } from '@/types/formatted/alert'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { Button } from '@/types/formatted/button'
import { AudienceTopics } from '@/types/formatted/audienceTopics'

// Define the query params for fetching node--news_story.
const test = ['a', 'b']
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude([
    // alert
    'field_alert_single',
    'field_alert_single.field_alert_block_reference',
    'field_alert_single.field_alert_block_reference.field_alert_content',
    'field_alert_single.field_alert_non_reusable_ref',
    'field_alert_single.field_alert_non_reusable_ref.field_va_paragraphs',
    // buttons
    'field_buttons',
    // content blocks (main content)
    'field_content_block',
    'field_content_block.field_q_as',
    'field_content_block.field_va_paragraphs',
    'field_content_block.field_va_paragraphs.field_va_paragraphs',
    // tags
    'field_tags',
    'field_tags.field_audience_beneficiares',
    'field_tags.field_non_beneficiares',
    'field_tags.field_topics',
    // related information
    'field_related_information',
    // related benefit hubs
    'field_related_benefit_hubs',
    // contact information
    'field_contact_information',
    'field_contact_information.field_additional_contact',
    'field_contact_information.field_benefit_hub_contacts',
    'field_contact_information.field_benefit_hub_contacts.field_support_services',
    'field_contact_information.field_contact_default',
  ])
}

// Define the option types for the data loader.
export type ResourcesSupportDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  ResourcesSupportDataOpts,
  NodeSupportResourcesDetailPage
> = async (opts): Promise<NodeSupportResourcesDetailPage> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.RESOURCES_SUPPORT,
    params
  )) as NodeSupportResourcesDetailPage

  return entity
}

export const formatter: QueryFormatter<
  NodeSupportResourcesDetailPage,
  ResourcesSupport
> = (entity: NodeSupportResourcesDetailPage) => {
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    intro: entity.field_intro_text_limited_html.processed,
    alert: formatParagraph(entity.field_alert_single) as AlertSingle,
    buttons: entity.field_buttons.map?.(formatParagraph) as Button[],
    repeatButtons: entity.field_buttons_repeat,
    toc: entity.field_table_of_contents_boolean,
    mainContent: entity.field_content_block.map?.(formatParagraph) || [],
    tags: formatParagraph(entity.field_tags) as AudienceTopics,
    contactInformation: formatParagraph(
      entity.field_contact_information
    ) as ContactInfo,
    benefitsHubLinks: queries.formatData(
      'node--landing_page',
      entity.field_related_benefit_hubs
    ),
  }
}
