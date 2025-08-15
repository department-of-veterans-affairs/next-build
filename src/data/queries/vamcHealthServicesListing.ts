import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { VamcHealthServicesListing } from '@/types/formatted/vamcHealthServicesListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--health_services_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_administration'])
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
    title: entity.title,
    introText: entity.field_intro_text,
    path: entity.path?.alias || null,
    administration: entity.field_administration || null,
    vamcEhrSystem: entity.field_office?.field_vamc_ehr_system || null,
  }
}
