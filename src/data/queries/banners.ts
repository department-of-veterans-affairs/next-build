import { QueryData, QueryFormatter } from 'next-drupal-query'
import { BANNER_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { BannersData } from '@/types/formatted/banners'
import { drupalClient } from '@/lib/drupal/drupalClient'

export type BannerDataOpts = {
  itemPath?: string
}

// The banner data endpoint is a custom endpoint provided by Drupal due to how banners are associated with a page.
// A given page does not reference a banner node via entity reference, banner node types have a field that lists what
// paths they are supposed to be visible on. This endpoint queries banners based on their path lists.
// See docroot/modules/custom/va_gov_api/src/Controller/BannerAlertsController.php in va.gov-cms for more info.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const data: QueryData<BannerDataOpts, any> = async (opts) => {
  if (opts.itemPath) {
    const bannerUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/v1/banner-alerts?path=${opts.itemPath}`

    const response = await drupalClient.fetch(bannerUrl)
    const json = await response.json()
    return json.data
  }

  return []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatter: QueryFormatter<any, BannersData> = (entities) => {
  return entities?.map((banner) => {
    switch (banner?.type.target_id as string) {
      case BANNER_RESOURCE_TYPES.BASIC:
        // this field returns 'perm' or 'dismiss' string instead of bool
        const dismiss = banner.field_dismissible_option === 'dismiss'

        return {
          id: banner.nid,
          title: banner.title,
          body: banner.body.value,
          alertType: banner.field_alert_type,
          dismiss,
          type: banner.type.target_id,
        }
      case BANNER_RESOURCE_TYPES.PROMO:
        return {
          id: banner.nid,
          title: banner.title,
          href: banner.field_link?.uri,
          alertType: banner.field_promo_type,
          type: banner.type.target_id,
        }
      case BANNER_RESOURCE_TYPES.FACILITY:
        return {
          id: banner.nid,
          title: banner.title,
          body: banner.field_body.value,
          alertType: banner.field_alert_type,
          dismiss: banner.field_alert_dismissable,
          operatingStatus: banner.field_alert_operating_status_cta,
          inheritanceSubpages: banner.field_alert_inheritance_subpages,
          situationUpdates: banner.field_situation_updates,
          emailUpdatesButton: banner.field_alert_email_updates_button,
          path: banner.path?.alias,
          findFacilities: banner.field_alert_find_facilities_cta,
          // bannerAlertVamcs: banner.field_banner_alert_vamcs.url,
          type: banner.type.target_id,
        }
      default:
        return null
    }
  })
}
