import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'
import { VamcOperatingStatusAndAlerts } from '@/types/formatted/vamcOperatingStatusAndAlerts'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'

// Define the query params for fetching node--vamc_operating_status_and_alerts.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_office',
    'field_office.field_system_menu',
  ])
}

// Define the option types for the data loader.
export type VamcOperatingStatusAndAlertsDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

export type VamcOperatingStatusAndAlertsData = {
  entity: NodeVamcOperatingStatusAndAlerts
  menu: Menu | null
}

// Implement the data loader.
export const data: QueryData<
  VamcOperatingStatusAndAlertsDataOpts,
  VamcOperatingStatusAndAlertsData
> = async (opts) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_OPERATING_STATUS_AND_ALERTS,
    params
  )) as NodeVamcOperatingStatusAndAlerts

  const menu = entity.field_office
    ? await getMenu(
        entity.field_office.field_system_menu.resourceIdObjMeta
          .drupal_internal__target_id
      )
    : null

  return { entity, menu }
}

export const formatter: QueryFormatter<
  VamcOperatingStatusAndAlertsData,
  VamcOperatingStatusAndAlerts
> = ({ entity, menu }) => {
  const formattedMenu =
    menu !== null ? buildSideNavDataFromMenu(entity.path.alias, menu) : null
  return {
    ...entityBaseFields(entity),
    facilityName: entity.field_office.field_system_menu.label,
    menu: formattedMenu,
  }
}
