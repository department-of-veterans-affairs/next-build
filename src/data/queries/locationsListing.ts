import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeLocationsListing } from '@/types/drupal/node'
import { LocationsListing } from '@/types/formatted/locationsListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--locations_listing.
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
export type LocationsListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  LocationsListingDataOpts,
  NodeLocationsListing
> = async (opts): Promise<NodeLocationsListing> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.LOCATIONS_LISTING,
    params
  )) as NodeLocationsListing

  return entity
}

export const formatter: QueryFormatter<
  NodeLocationsListing,
  LocationsListing
> = (entity) => {
  return {
    ...entityBaseFields(entity),
    type: 'node--locations_listing', // explicitly define the type as a string literal
    entityId: entity.drupal_internal__nid,
    entityPath: entity.path?.alias || '',
    breadcrumbs: entity.breadcrumbs ?? [],
    metatags: entity.metatag || [],
    lastUpdated: entity.changed,
    title: entity.title,
  }
}
