import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { NodeEventListing } from '@/types/drupal/node'
import { EventListing } from '@/types/formatted/eventListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--event_listing.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_administration',
      'field_office'
    ])
}

// Define the option types for the data loader.
export type EventListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<EventListingDataOpts, NodeEventListing> = async (
  opts
): Promise<NodeEventListing> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.EVENT_LISTING,
    params
  )) as NodeEventListing

  return entity
}

export const formatter: QueryFormatter<NodeEventListing, EventListing> = (
  entity: NodeEventListing
) => {
  return {
    ...entityBaseFields(entity)
  }
}
