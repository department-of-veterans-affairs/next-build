import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { NodeLandingPage } from '@/types/drupal/node'
import { BenefitsHubLink } from '@/types/formatted/benefitsHub'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

// Define the query params for fetching node--landing_page.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_support_services'])
}

// Format NodeLandingPage (Benefits Hub) into link teasers.
export const formatter: QueryFormatter<NodeLandingPage[], BenefitsHubLink[]> = (
  entities: NodeLandingPage[]
) => {
  return entities.map((entity) => {
    return {
      id: entity.id,
      path: entity.path?.alias,
      title: entity.title,
      label: entity.field_home_page_hub_label,
      teaserText: entity.field_teaser_text,
    }
  })
}
