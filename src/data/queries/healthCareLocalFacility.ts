import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { HealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--health_care_local_facility.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    // 'field_media',
    // 'field_media.image',
    // 'field_administration',
  ])
}

// Define the option types for the data loader.
export type HealthCareLocalFacilityDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  HealthCareLocalFacilityDataOpts,
  NodeHealthCareLocalFacility
> = async (opts): Promise<NodeHealthCareLocalFacility> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_FACILITY,
    params
  )) as NodeHealthCareLocalFacility

  // TODO: Check the data, don't just do a type assertion

  return entity
}

export const formatter: QueryFormatter<
  NodeHealthCareLocalFacility,
  HealthCareLocalFacility
> = (entity: NodeHealthCareLocalFacility) => {
  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text,
    operatingStatusFacility: entity.field_operating_status_facility,
  }
}
