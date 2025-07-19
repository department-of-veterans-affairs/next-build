import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVbaFacility } from '@/types/drupal/node'
import { VbaFacility } from '@/types/formatted/vbaFacility'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--vba_facility.
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
export type VbaFacilityDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<VbaFacilityDataOpts, NodeVbaFacility> = async (
  opts
): Promise<NodeVbaFacility> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VBA_FACILITY,
    params
  )) as NodeVbaFacility

  return entity
}

export const formatter: QueryFormatter<NodeVbaFacility, VbaFacility> = (
  entity: NodeVbaFacility
) => {
  return {
    ...entityBaseFields(entity),
  }
}
