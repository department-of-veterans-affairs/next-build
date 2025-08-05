import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVetCenterLocationListing } from '@/types/drupal/node'
import { VetCenterLocationListing } from '@/types/formatted/vetCenterLocationListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
// import { queries } from '.'

// Define the query params for fetching node--vet_center_locations_list.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_office',
    'field_office.field_media',
    'field_office.field_media.image',
    'field_nearby_mobile_vet_centers',
    'field_nearby_mobile_vet_centers.field_media',
    'field_nearby_mobile_vet_centers.field_media.image',
  ])
}

// Define the option types for the data loader.
export type VetCenterLocationListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  VetCenterLocationListingDataOpts,
  NodeVetCenterLocationListing
> = async (opts): Promise<NodeVetCenterLocationListing> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VET_CENTER_LOCATION_LISTING,
    params
  )) as NodeVetCenterLocationListing

  return entity
}

export const formatter: QueryFormatter<
  NodeVetCenterLocationListing,
  VetCenterLocationListing
> = (entity: NodeVetCenterLocationListing) => {
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    // Note to future Patrick: The field office is a node--vet_center, but all the
    // satellite locations are made up of both field_nearby_mobile_vet_centers and a
    // reverse lookup of associated "node--vet_center_outstation", "node--vet_center_cap"
    // (community access point), and "node--vet_center_mobile_vet_center" (but I'm
    // guessing these would already be included in the field_nearby_mobile_vet_centers)
    // according to the original graphql query.

    // fieldOffice: queries.formatData(RESOURCE_TYPES.VET_CENTER, entity.field_office),
    // fieldNearbyMobileVetCenters: queries.formatData(
    //   RESOURCE_TYPES.VET_CENTER,
    //   entity.field_nearby_mobile_vet_centers
    // ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldOffice: {} as any,
    fieldNearbyMobileVetCenters: [],
  }
}
