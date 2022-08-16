import { QueryFormatter } from 'next-drupal-query'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import { BannerType, FacilityBannerType, PromoBannerType } from '@/types/index'
import { BannerProps } from '@/templates/globals/banners/banner'
import { PromoBannerProps } from '@/templates/globals/banners/promoBanner'
import { FacilityBannerProps } from '@/templates/globals/banners/facilityBanner'
// Define the query params for fetching node--news_story.

export const formatter: QueryFormatter<
  NodeBanner,
  PromoBannerType | BannerType | FacilityBannerType
> = (entity: NodeBanner) => {
  return entity.bannerData.map(
    (banner): PromoBannerProps | BannerProps | FacilityBannerProps => {
      if (banner.type === 'node--banner') {
        return {
          id: banner.id,
          title: banner.title,
          body: banner.body?.processed || null,
          alertType: banner.field_alert_type || null,
          dismiss: banner.field_dismissible_option || null,
          type: banner.type,
        }
      }
      if (banner.type === 'node--promo_banner') {
        return {
          id: banner.id,
          title: banner.title,
          href: banner.field_link.uri || null,
          alertType: banner.field_promo_type || null,
          type: banner.type,
        }
      }
      if (banner.type === 'node--full_width_banner_alert') {
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
      }
    }
  )
}
