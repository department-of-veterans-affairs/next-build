import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeLeadershipListing } from '@/types/drupal/node'
import { LeadershipListing } from '@/types/formatted/leadershipListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--leadership_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
  // uncomment to add referenced entity data to the response
  // .addInclude([
  //  'field_media',
  //  'field_media.image',
  //  'field_administration',
  // ])
}

// Define the option types for the data loader.
export type LeadershipListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  LeadershipListingDataOpts,
  NodeLeadershipListing
> = async (opts): Promise<NodeLeadershipListing> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.LEADERSHIP_LISTING,
    params
  )) as NodeLeadershipListing

  return entity
}

export const formatter: QueryFormatter<
  NodeLeadershipListing,
  LeadershipListing
> = (entity: NodeLeadershipListing) => {
  return {
    ...entityBaseFields(entity),
  }
}
