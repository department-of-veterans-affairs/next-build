import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'
import { VamcOperatingStatusAndAlerts } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
// Define the query params for fetching node--vamc_operating_status_and_alerts.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_office',
    'field_office.field_system_menu',
    'field_banner_alert.field_situation_updates',
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
  const buildSituationUpdates = (bannerAlerts) => {
    if (!bannerAlerts) return null

    return bannerAlerts
      .map((bannerAlert) => {
        const updates = bannerAlert.field_situation_updates
        if (!updates || updates.length === 0) return null

        const sortedUpdates = updates
          .slice()
          .sort(
            (a, b) =>
              new Date(b.field_datetime_range_timezone.value).getTime() -
              new Date(a.field_datetime_range_timezone.value).getTime()
          )
          .map((update) => ({
            dateTime: update.field_datetime_range_timezone.value,
            timezone: update.field_datetime_range_timezone.timezone,
            updateText: getHtmlFromField(update.field_wysiwyg),
          }))

        return {
          updates: sortedUpdates,
          info: getHtmlFromDrupalContent(
            bannerAlert.field_banner_alert_situationinfo
          ),
        }
      })
      .filter(Boolean)
  }
  return {
    ...entityBaseFields(entity),
    facilityName: entity.field_office.field_system_menu.label,
    situationUpdates: buildSituationUpdates(entity.field_banner_alert),
    menu: formattedMenu,
  }
}
