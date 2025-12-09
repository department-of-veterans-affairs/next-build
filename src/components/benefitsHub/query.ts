import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeLandingPage } from '@/types/drupal/node'
import { BenefitsHub } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'
import { supportServiceFormatter as formatSupportService } from '@/components/supportServices/query'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatAlertBlock } from '@/components/alertBlock/query'

// Define the query params for fetching node--landing_page for benefits hub.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_spokes',
    'field_spokes.field_va_paragraphs',
    'field_support_services',
    'field_connect_with_us',
    'field_related_links',
    'field_related_links.field_va_paragraphs',
    ...getNestedIncludes('field_alert', 'block--alert'),
  ])
}

// Define the option types for the data loader.
export type BenefitsHubDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<BenefitsHubDataOpts, NodeLandingPage> = async (
  opts
): Promise<NodeLandingPage> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.BENEFITS_HUB,
    params
  )) as NodeLandingPage

  return entity
}

export const formatter: QueryFormatter<NodeLandingPage, BenefitsHub> = (
  entity: NodeLandingPage
) => {
  // Format each spoke using the ListOfLinkTeasers formatter
  const spokes = (entity.field_spokes || []).map((spoke) =>
    formatListOfLinkTeasers(spoke)
  )

  const supportServices = (entity.field_support_services || [])
    .filter((service) => service !== null)
    .map((service) => formatSupportService(service))

  const fieldLinks =
    entity.field_links?.length > 0
      ? entity.field_links.map((link) => ({
          title: link.title,
          url: {
            path: link.url || link.uri,
          },
        }))
      : null

  const relatedLinks = entity.field_related_links
    ? {
        id: entity.field_related_links.id,
        type: 'paragraph--list_of_link_teasers' as const,
        entityId: entity.field_related_links.drupal_internal__id,
        title: entity.field_related_links.field_title || '',
        linkTeasers: (entity.field_related_links.field_va_paragraphs || []).map(
          (paragraph) => ({
            type: 'paragraph--link_teaser' as const,
            id: paragraph?.id?.toString() || '',
            entityId: paragraph?.entityId || null,
            uri: paragraph?.field_link?.url?.path || '',
            title: paragraph?.field_link?.title || '',
            options: paragraph?.field_link?.options || [],
            summary: paragraph?.field_link_summary || null,
          })
        ),
      }
    : null

  return {
    ...entityBaseFields(entity),
    title: entity.title,
    intro: entity.field_intro_text
      ? getHtmlFromDrupalContent(entity.field_intro_text)
      : null,
    hubLabel: entity.field_home_page_hub_label,
    teaserText: entity.field_teaser_text,
    titleIcon: entity.field_title_icon,
    spokes: spokes,
    fieldLinks: fieldLinks,
    supportServices: supportServices,
    connectWithUs: entity.field_connect_with_us,
    relatedLinks: relatedLinks,
    alert: entity.field_alert ? formatAlertBlock(entity.field_alert) : null,
  }
}
