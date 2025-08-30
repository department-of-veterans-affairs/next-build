import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcSystemRegisterForCare } from '@/types/drupal/node'
import { VamcSystemRegisterForCare } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--vamc_system_register_for_care.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addFilter('type', RESOURCE_TYPES.VAMC_SYSTEM_REGISTER_FOR_CARE)
    .addInclude([
      'field_office',
      // TODO: Add more includes as needed
    ])
}

// Define the option types for the data loader.
export type VamcSystemRegisterForCareDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Define the data structure returned from the query.
type VamcSystemRegisterForCareData = {
  entity: NodeVamcSystemRegisterForCare
}

// Implement the data loader.
export const data: QueryData<
  VamcSystemRegisterForCareDataOpts,
  VamcSystemRegisterForCareData
> = async (opts): Promise<VamcSystemRegisterForCareData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM_REGISTER_FOR_CARE,
    params
  )) as NodeVamcSystemRegisterForCare

  if (!entity) {
    throw new Error(
      `NodeVamcSystemRegisterForCare entity not found for id: ${opts.id}`
    )
  }

  return { entity }
}

// Implement the formatter.
export const formatter: QueryFormatter<
  VamcSystemRegisterForCareData,
  VamcSystemRegisterForCare
> = ({ entity }): VamcSystemRegisterForCare => {
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    vamcSystem: {
      id: entity.field_office.id,
      title: entity.field_office.title,
    },
  }
}
