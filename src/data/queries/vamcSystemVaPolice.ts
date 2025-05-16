import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { VamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--vamc_system_va_police.
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
export type VamcSystemVaPoliceDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<VamcSystemVaPoliceDataOpts, NodeVamcSystemVaPolice> = async (
  opts
): Promise<NodeVamcSystemVaPolice> => {
const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE,
    params
  )) as NodeVamcSystemVaPolice

  return entity
}

export const formatter: QueryFormatter<NodeVamcSystemVaPolice, VamcSystemVaPolice> = (
  entity: NodeVamcSystemVaPolice
) => {
  return {
    ...entityBaseFields(entity)
  }
}
