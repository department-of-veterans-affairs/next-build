import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeVamcSystem } from '@/types/drupal/node'
import { VamcSystem } from '@/types/formatted/vamcSystem'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--vamc_system.
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
export type VamcSystemDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<VamcSystemDataOpts, NodeVamcSystem> = async (
  opts
): Promise<NodeVamcSystem> => {
const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM,
    params
  )) as NodeVamcSystem

  return entity
}

export const formatter: QueryFormatter<NodeVamcSystem, VamcSystem> = (
  entity: NodeVamcSystem
) => {
  return {
    ...entityBaseFields(entity)
  }
}
