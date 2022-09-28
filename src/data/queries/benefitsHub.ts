import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { NodeLandingPage } from '@/types/dataTypes/drupal/node'
import { BenefitsHubType } from '@/types/index'

// Define the query params for fetching node--landing_page.
// This is a "special" case in that these nodes are primarily (only?) used as entity references from other nodes
export const formatter: QueryFormatter<NodeLandingPage, BenefitsHubType> = (
  entity: NodeLandingPage
) => {
  return {
    id: entity.id,
    url: entity.path?.alias,
    title: entity.title,
    homePageHubLabel: entity.field_home_page_hub_label,
    teaserText: entity.field_teaser_text,
  }
}
