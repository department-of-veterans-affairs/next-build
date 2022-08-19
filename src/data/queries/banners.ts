import { QueryFormatter } from 'next-drupal-query'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import { BannerType, FacilityBannerType, PromoBannerType } from '@/types/index'

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
  NodeBanner,
  PromoBannerType | BannerType | FacilityBannerType
> = (entity: NodeBanner) => {
  return entity.bannerData.map((banner) => {
    switch (banner?.type as string) {
      case BannerTypeMapping[BannerDisplayType.BANNER]:
        return {
          id: banner.id,
          title: banner.title,
          body: banner.body?.processed || null,
          alertType: banner.field_alert_type || null,
          dismiss: banner.field_dismissible_option || null,
          type: banner.type,
        }
      case BannerTypeMapping[BannerDisplayType.PROMO_BANNER]:
        return {
          id: banner.id,
          title: banner.title,
          href: banner.field_link?.uri || null,
          alertType: banner.field_promo_type || null,
          type: banner.type,
        }
      case BannerTypeMapping[BannerDisplayType.FACILITY_BANNER]:
        return {
          id: banner.id,
          title: banner.title,
          body: banner.field_body?.processed || null,
          alertType: banner.field_alert_type || null,
          dismiss: banner.field_alert_dismissable || null,
          operatingStatus: banner.field_alert_operating_status_cta || null,
          inheritanceSubpages: banner.field_alert_inheritance_subpages || null,
          path: banner.path?.alias || null,
          bannerAlertVacms: banner.field_banner_alert_vamcs || null,
          type: banner.type,
        }
      default:
        return null
    }
  })
}
