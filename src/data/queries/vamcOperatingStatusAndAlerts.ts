import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'
import { VamcOperatingStatusAndAlerts } from '@/types/formatted/vamcOperatingStatusAndAlerts'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--vamc_operating_status_and_alerts.
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
export type VamcOperatingStatusAndAlertsDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  VamcOperatingStatusAndAlertsDataOpts,
  NodeVamcOperatingStatusAndAlerts
> = async (opts): Promise<NodeVamcOperatingStatusAndAlerts> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_OPERATING_STATUS_AND_ALERTS,
    params
  )) as NodeVamcOperatingStatusAndAlerts

  return entity
}

export const formatter: QueryFormatter<
  NodeVamcOperatingStatusAndAlerts,
  VamcOperatingStatusAndAlerts
> = (entity: NodeVamcOperatingStatusAndAlerts) => {
  return {
    ...entityBaseFields(entity),
  }
}
