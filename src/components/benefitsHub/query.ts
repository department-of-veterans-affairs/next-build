import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeLandingPage } from '@/types/drupal/node'
import { BenefitsHub } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'
import { supportServiceFormatter as formatSupportService } from '@/components/supportServices/query'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'

// Define the query params for fetching node--landing_page for benefits hub.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_spokes',
    'field_spokes.field_va_paragraphs',
    'field_support_services',
    'field_connect_with_us',
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

  // Format each support service using the SupportService formatter
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
  }
}
