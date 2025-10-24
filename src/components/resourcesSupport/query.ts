import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '@/lib/drupal/queries'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { NodeSupportResourcesDetailPage } from '@/types/drupal/node'
import { ResourcesSupport } from './formatted-type'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { AlertSingle } from '@/components/alert/formatted-type'
import { ContactInfo } from '@/components/contactInfo/formatted-type'
import { Button } from '@/components/button/formatted-type'
import { AudienceTopics } from '@/components/audienceTopics/formatted-type'
import { getNestedIncludes } from '@/lib/utils/queries'

// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    // alert
    ...getNestedIncludes(
      'field_alert_single',
      PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE
    ),
    // buttons
    'field_buttons',
    // content blocks (main content)
    ...getNestedIncludes('field_content_block', [
      PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL,
      PARAGRAPH_RESOURCE_TYPES.QA_GROUP,
    ]),
    // tags
    ...getNestedIncludes(
      'field_tags',
      PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS
    ),
    // related information
    'field_related_information',
    // related benefit hubs
    'field_related_benefit_hubs',
    // contact information
    ...getNestedIncludes(
      'field_contact_information',
      PARAGRAPH_RESOURCE_TYPES.CONTACT_INFORMATION
    ),
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
    buttons: entity.field_buttons.map?.((p) => formatParagraph(p)) as Button[],
    repeatButtons: entity.field_buttons_repeat,
    toc: entity.field_table_of_contents_boolean,
    mainContent:
      entity.field_content_block.map?.((p) => formatParagraph(p)) || [],
    tags: formatParagraph(entity.field_tags) as AudienceTopics,
    contactInformation: formatParagraph(
      entity.field_contact_information
    ) as ContactInfo,
    benefitsHubLinks: entity.field_related_benefit_hubs
      ? queries.formatData(
          'benefits-hub-links',
          entity.field_related_benefit_hubs
        )
      : [],
  }
}
