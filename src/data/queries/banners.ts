import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import {
  Banner,
  FacilityBanner,
  PromoBanner,
} from '@/types/dataTypes/formatted/banners'
import { drupalClient } from '@/lib/drupal/drupalClient'

export const BannerDisplayType = {
  PROMO_BANNER: 'promoBanner',
  FACILITY_BANNER: 'facilityBanner',
  BANNER: 'banner',
}

export const BannerTypeMapping = {
  [BannerDisplayType.PROMO_BANNER]: 'node--promo_banner',
  [BannerDisplayType.FACILITY_BANNER]: 'node--full_width_banner_alert',
  [BannerDisplayType.BANNER]: 'node--banner',
}

export type BannerDataOpts = {
  jsonApiEntryPoint?: string
  itemPath?: string
}

export type BannerData = Array<PromoBanner | Banner | FacilityBanner | NodeBanner>

export const data: QueryData<BannerDataOpts, BannerData> = async (opts) => {
  const lookup = await drupalClient.fetch(`${opts.jsonApiEntryPoint}/banner-alerts?item-path=${opts.itemPath}`)
  const bannerData: [] | unknown = drupalClient.deserialize(
    await lookup.json()
  )

  // do filtering for facility banner to gather additional data here

  return bannerData as NodeBanner[]
}

export const formatter: QueryFormatter<
  NodeBanner[],
  Array<Banner | PromoBanner | FacilityBanner>
> = (entities: NodeBanner[]) => {
  return entities?.map((banner) => {
    switch (banner?.type as string) {
      case BannerTypeMapping[BannerDisplayType.BANNER]:
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
      case BannerTypeMapping[BannerDisplayType.PROMO_BANNER]:
        return {
          id: banner.id,
          title: banner.title,
          href: banner.field_link?.uri,
          alertType: banner.field_promo_type,
          type: banner.type,
        }
      case BannerTypeMapping[BannerDisplayType.FACILITY_BANNER]:
        return {
          id: banner.id,
          title: banner.title,
          body: banner.field_body,
          alertType: banner.field_alert_type,
          dismiss: banner.field_alert_dismissable,
          operatingStatus: banner.field_alert_operating_status_cta,
          inheritanceSubpages: banner.field_alert_inheritance_subpages,
          bannerAlertVamcs: banner.field_banner_alert_vamcs,
          type: banner.type,
        }
      default:
        return null
    }
  })
}
