import { QueryFormatter } from 'next-drupal-query'
import { NodeLandingPage } from '@/types/drupal/node'
import { BenefitsHub } from '@/types/formatted/benefitsHub'

// Define the query params for fetching node--landing_page.
// This is a "special" case in that these nodes are primarily (only?) used as entity references from other nodes
export const formatter: QueryFormatter<NodeLandingPage, BenefitsHub> = (
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
