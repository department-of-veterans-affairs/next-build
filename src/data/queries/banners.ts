import { QueryData, QueryFormatter } from 'next-drupal-query'
import { NodeBanner, NodeBannerType } from '@/types/drupal/node'
import { BannersData } from '@/types/formatted/banners'
import { drupalClient } from '@/lib/drupal/drupalClient'

export type BannerDataOpts = {
  itemPath?: string
}

// The banner data endpoint is a custom endpoint provided by Drupal due to how banners are associated with a page.
// A given page does not reference a banner node via entity reference, banner node types have a field that lists what
// paths they are supposed to be visible on. This endpoint queries banners based on their path lists.
// See docroot/modules/custom/va_gov_api/src/Resources/BannerAlerts.php in va.gov-cms for more info.
export const data: QueryData<BannerDataOpts, NodeBanner[]> = async (opts) => {
  if (opts.itemPath) {
    const bannerUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/banner-alerts?item-path=${opts.itemPath}`

    const response = await drupalClient.fetch(bannerUrl)
    const data: [] | unknown = drupalClient.deserialize(await response.json())

    return data as NodeBanner[]
  }

  return []
}

export const formatter: QueryFormatter<NodeBanner[], BannersData> = (
  entities: NodeBanner[]
) => {
  return entities?.map((banner) => {
    switch (banner?.type as string) {
      case NodeBannerType.BANNER:
        // this field returns 'perm' or 'dismiss' string instead of bool
        const dismiss = banner.field_dismissible_option === 'dismiss'

        return {
          id: banner.id,
          title: banner.title,
          body: banner.body,
          alertType: banner.field_alert_type,
          dismiss,
          type: banner.type,
        }
      case NodeBannerType.PROMO_BANNER:
        return {
          id: banner.id,
          title: banner.title,
          href: banner.field_link?.uri,
          alertType: banner.field_promo_type,
          type: banner.type,
        }
      case NodeBannerType.FACILITY_BANNER:
        return {
          id: banner.id,
          title: banner.title,
          body: banner.field_body,
          alertType: banner.field_alert_type,
          dismiss: banner.field_alert_dismissable,
          operatingStatus: banner.field_alert_operating_status_cta,
          inheritanceSubpages: banner.field_alert_inheritance_subpages,
          path: banner.path?.alias,
          findFacilities: banner.field_alert_find_facilities_cta,
          bannerAlertVamcs: banner.field_banner_alert_vamcs,
          type: banner.type,
        }
      default:
        return null
    }
  })
}
