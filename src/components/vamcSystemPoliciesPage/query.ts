import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeVamcSystemPoliciesPage } from '@/types/drupal/node'
import { VamcSystemPoliciesPage } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--vamc_system_policies_page.
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
export type VamcSystemPoliciesPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<VamcSystemPoliciesPageDataOpts, NodeVamcSystemPoliciesPage> = async (
  opts
): Promise<NodeVamcSystemPoliciesPage> => {
const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_POLICIES_PAGE,
    params
  )) as NodeVamcSystemPoliciesPage

  return entity
}

export const formatter: QueryFormatter<NodeVamcSystemPoliciesPage, VamcSystemPoliciesPage> = (
  entity: NodeVamcSystemPoliciesPage
) => {
  return {
    ...entityBaseFields(entity)
  }
}
