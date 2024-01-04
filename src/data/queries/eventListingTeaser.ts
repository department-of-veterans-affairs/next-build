import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '.'
import { NodeEventListingTeaser } from '@/types/drupal/node'
import { EventListingTeaser } from '@/types/formatted/eventListingTeaser'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--event_listing_teaser.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(['field_media', 'field_media.image', 'field_listing'])
}

export const formatter: QueryFormatter<NodeEventListingTeaser, EventListingTeaser> = (
  entity: NodeEventListingTeaser
) => {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    headingLevel: 'h2',
    title: entity.title,
    image: queries.formatData('media--image', entity.field_media),
    link: entity.path.alias,
    introText: entity.field_intro_text,
    lastUpdated: entity.field_last_saved_by_an_editor || entity.created,
  }
}
