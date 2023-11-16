import { QueryFormatter } from 'next-drupal-query'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import {
  Banner,
  FacilityBanner,
  PromoBanner,
} from '@/types/dataTypes/formatted/banners'

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

export const formatter: QueryFormatter<
  NodeBanner[],
  Array<PromoBanner | Banner | FacilityBanner | NodeBanner>
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
          path: banner.path?.alias,
          bannerAlertVacms: banner.field_banner_alert_vamcs,
          type: banner.type,
        }
      default:
        return null
    }
  })
}
