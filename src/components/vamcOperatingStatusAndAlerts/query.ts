import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeVamcOperatingStatusAndAlerts,
  NodeHealthCareLocalFacility,
} from '@/types/drupal/node'
import { VamcOperatingStatusAndAlerts } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
  fetchAndConcatAllResourceCollectionPages,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import {
  getLovellVariantOfUrl,
  getOppositeChildVariant,
  getLovellVariantOfBreadcrumbs,
} from '@/lib/drupal/lovell/utils'
import { getLovellVariantOfTitle } from '@/lib/drupal/lovell/utils'

// Define the query params for fetching node--vamc_operating_status_and_alerts.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_office',
    'field_office.field_system_menu',
    'field_banner_alert.field_situation_updates',
  ])
}
export const facilityParams: QueryParams<string> = (vamcSystemId: string) => {
  return new DrupalJsonApiParams()
    .addFilter('status', '1')
    .addFilter('field_region_page.id', vamcSystemId)
}
// Define the option types for the data loader.
export type VamcOperatingStatusAndAlertsDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

export type VamcOperatingStatusAndAlertsData = {
  entity: NodeVamcOperatingStatusAndAlerts
  menu: Menu | null
  facilities: NodeHealthCareLocalFacility[]
  lovell?: ExpandedStaticPropsContext['lovell']
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
  const { data: facilities } =
    await fetchAndConcatAllResourceCollectionPages<NodeHealthCareLocalFacility>(
      RESOURCE_TYPES.VAMC_FACILITY,
      facilityParams(entity.field_office.id),
      PAGE_SIZES.MAX
    )
  return { entity, menu, facilities, lovell: opts.context?.lovell }
}

export const formatter: QueryFormatter<
  VamcOperatingStatusAndAlertsData,
  VamcOperatingStatusAndAlerts
> = ({ entity, menu, facilities, lovell }) => {
  let { breadcrumbs } = entity
  let title = entity.field_office.field_system_menu.label
  if (lovell?.isLovellVariantPage) {
    breadcrumbs = getLovellVariantOfBreadcrumbs(breadcrumbs, lovell.variant)
    title = getLovellVariantOfTitle(
      entity.field_office.field_system_menu.label,
      lovell.variant
    )
  }
  const formattedMenu =
    menu !== null ? buildSideNavDataFromMenu(entity.path.alias, menu) : null

  const buildSituationUpdates = (bannerAlerts) => {
    if (!Array.isArray(bannerAlerts) || bannerAlerts.length === 0) return null

    const publishedBannerAlerts = bannerAlerts.filter((alert) => alert?.status)
    if (publishedBannerAlerts.length === 0) return null

    const situationUpdates = publishedBannerAlerts
      .map((alert) => {
        const updates = alert.field_situation_updates ?? []
        const hasUpdates = updates.length > 0
        const hasInfo = !!alert.field_banner_alert_situationinfo

        if (!hasUpdates && !hasInfo) return null

        const sortedUpdates = hasUpdates
          ? [...updates]
              .sort(
                (a, b) =>
                  new Date(
                    b.field_datetime_range_timezone?.value ?? 0
                  ).getTime() -
                  new Date(
                    a.field_datetime_range_timezone?.value ?? 0
                  ).getTime()
              )
              .map((update) => ({
                dateTime: update.field_datetime_range_timezone?.value,
                timezone: update.field_datetime_range_timezone?.timezone,
                updateText: getHtmlFromField(update.field_wysiwyg),
              }))
          : []

        return {
          updates: sortedUpdates,
          info: hasInfo
            ? getHtmlFromDrupalContent(alert.field_banner_alert_situationinfo)
            : null,
        }
      })
      .filter(Boolean)

    return situationUpdates.length > 0 ? situationUpdates : null
  }

  return {
    ...entityBaseFields(entity),
    breadcrumbs,
    facilityName: title,
    situationUpdates: buildSituationUpdates(entity.field_banner_alert),
    operatingStatuses: facilities
      ?.map((facilityEntity) => ({
        title: facilityEntity?.title || null,
        url: facilityEntity?.path?.alias || null,
        status: facilityEntity?.field_operating_status_facility || null,
        statusInfo: facilityEntity?.field_operating_status_more_info
          ? getHtmlFromDrupalContent(
              facilityEntity.field_operating_status_more_info
            )
          : null,
      }))
      .sort((a, b) => a.title.localeCompare(b.title)),
    emergencyInformation:
      getHtmlFromField(entity.field_operating_status_emerg_inf, {
        addH3Ids: true,
      }) || null,
    localEmergencyLinks: entity.field_links.length
      ? entity.field_links.map((link) => ({
          url: link.url,
          label: link.title,
        }))
      : null,
    menu: formattedMenu,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
  }
}
