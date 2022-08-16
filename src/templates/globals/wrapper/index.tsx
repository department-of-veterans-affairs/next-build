import { Banner } from '@/templates/globals/banners/banner'
import { PromoBanner } from '@/templates/globals/banners/promoBanner'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import { isEmpty } from 'lodash'
export interface LayoutProps {
  children?: React.ReactNode
  props?: any
  bannerData?: any
}

export function Wrapper({ props, bannerData, children }: LayoutProps) {
  if (isEmpty(bannerData)) bannerData = props?.bannerData

  return (
    <>
      {bannerData?.map((banner) =>
        banner.type === 'node--banner' ? (
          <Banner key={banner.id} {...banner} />
        ) : banner.type === 'node--promo_banner' ? (
          <PromoBanner key={banner.id} {...banner} />
        ) : banner.type === 'node--full_width_banner_alert' ? (
          <FacilityBanner key={banner.id} {...banner} />
        ) : null
      )}

      {children}
    </>
  )
}
