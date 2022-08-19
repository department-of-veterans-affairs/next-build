import { useState, useEffect } from 'react'
import { Banner } from '@/templates/globals/banners/banner'
import { PromoBanner } from '@/templates/globals/banners/promoBanner'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import { isEmpty } from 'lodash'
import { BannerType, PromoBannerType, FacilityBannerType } from '@/types/index'
import { BannerDisplayType, BannerTypeMapping } from '@/data/queries/banners'

export interface LayoutProps {
  props?: any
  children?: React.ReactNode
  bannerData?: BannerType[] | PromoBannerType[] | FacilityBannerType[]
}

export const formatBannerType = (bannerData) => {
  switch (bannerData?.type as string) {
    case BannerTypeMapping[BannerDisplayType.PROMO_BANNER]:
      return <PromoBanner key={bannerData.id} {...bannerData} />
    case BannerTypeMapping[BannerDisplayType.FACILITY_BANNER]:
      return <FacilityBanner key={bannerData.id} {...bannerData} />
    case BannerTypeMapping[BannerDisplayType.BANNER]:
      return <Banner key={bannerData.id} {...bannerData} />
    default:
      return null
  }
}

export function Wrapper({ bannerData, children }: LayoutProps) {
  const [showBanners, setShowBanners] = useState(false)

  useEffect(() => {
    if (isEmpty(bannerData)) {
      return setShowBanners(false)
    }
    if (bannerData) {
      bannerData?.map(
        (banner) => formatBannerType(banner) && setShowBanners(true)
      )
    }
  }, [bannerData, showBanners])

  return (
    <>
      {showBanners
        ? bannerData?.map((banner) => formatBannerType(banner))
        : null}
      <main>{children}</main>
    </>
  )
}
