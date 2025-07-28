import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeHealthServicesListing } from '@/types/drupal/node'
import { HealthServicesListing } from '@/types/formatted/healthServicesListing'
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
export type HealthServicesListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  HealthServicesListingDataOpts,
  NodeHealthServicesListing
> = async (opts): Promise<NodeHealthServicesListing> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.HEALTH_SERVICES_LISTING,
    params
  )) as NodeHealthServicesListing

  return entity
}

export const formatter: QueryFormatter<
  NodeHealthServicesListing,
  HealthServicesListing
> = (entity: NodeHealthServicesListing) => {
  return {
    ...entityBaseFields(entity),
    description: entity.field_description,
    introText: entity.field_intro_text,
  }
}
