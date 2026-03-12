import { QueryFormatter, QueryParams } from '@/lib/next-drupal-query'
import { NodeLandingPage } from '@/types/drupal/node'
import { BenefitsHubLink } from './formatted-type'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

// Define the query params for fetching node--landing_page.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_support_services'])
}

// Format NodeLandingPage (Benefits Hub) into link teasers.
// Returns null if input is null, or if all items filter to null, or if result is empty.
export const formatter: QueryFormatter<
  NodeLandingPage[] | null,
  BenefitsHubLink[] | null
> = (entities: NodeLandingPage[] | null) => {
  if (entities == null) return null
  const result = entities
    .filter((entity): entity is NodeLandingPage => entity != null)
    .map((entity) => ({
      id: entity.id,
      path: entity.path?.alias ?? '',
      title: entity.title,
      label: entity.field_home_page_hub_label,
      teaserText: entity.field_teaser_text,
    }))
    .filter((link) => link.path !== '')
  return result.length === 0 ? null : result
}
