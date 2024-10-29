import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { NodeLandingPage } from '@/types/drupal/node'
import { RelatedLink } from '@/types/formatted/relatedLinks'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

// Define the query params for fetching node--landing_page.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_support_services'])
}

export const formatter: QueryFormatter<NodeLandingPage[], RelatedLink[]> = (
  entities: NodeLandingPage[]
) => {
  return entities.map(entity => {
    return {
      uri: entity.path?.alias,
      title: entity.field_home_page_hub_label,
      summary: entity.field_teaser_text,
    }
  })
}
