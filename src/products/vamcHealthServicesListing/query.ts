import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { VamcHealthServicesListing } from '@/products/vamcHealthServicesListing/formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--health_services_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
}

// Define the option types for the data loader.
export type VamcHealthServicesListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  VamcHealthServicesListingDataOpts,
  NodeVamcHealthServicesListing
> = async (opts): Promise<NodeVamcHealthServicesListing> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING,
    params
  )) as NodeVamcHealthServicesListing

  return entity
}

export const formatter: QueryFormatter<
  NodeVamcHealthServicesListing,
  VamcHealthServicesListing
> = (entity: NodeVamcHealthServicesListing) => {
  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text,
  }
}
