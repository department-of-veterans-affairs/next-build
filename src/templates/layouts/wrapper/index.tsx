/* eslint-ignore no-console */
import { useState, useEffect } from 'react'
import { Banner } from '@/templates/components/banners/banner'
import { PromoBanner } from '@/templates/components/banners/promoBanner'
import { FacilityBanner } from '@/templates/components/banners/facilityBanner'
import { isEmpty } from 'lodash'
import {
  BannerType,
  FacilityBannerType,
  PromoBannerType,
  HeaderFooterData,
} from '@/types/index'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import { BannerDisplayType, BannerTypeMapping } from '@/data/queries/banners'
import { handleSkipLink } from '@/lib/utils/handleSkipLink'
import { Header } from '@/templates/common/header'
import { Footer } from '@/templates/common/footer/index'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  VetsGov?: {
    headerFooter?: HeaderFooterData
  }
}
declare const window: customWindow

export interface LayoutProps {
  children?: React.ReactNode
  bannerData?: Array<
    NodeBanner | PromoBannerType | BannerType | FacilityBannerType
  >
  headerFooterData?: HeaderFooterData
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

export function Wrapper({
  bannerData,
  headerFooterData,
  children,
}: LayoutProps) {
  const [showBanners, setShowBanners] = useState(false)
  const [banners, setBanners] = useState([])
  useEffect(() => {
    // Place header & footer data on window object for vets-website widgets
    window.VetsGov = {}
    window.VetsGov.headerFooter = headerFooterData

    // todo: clean this up later
    if (isEmpty(bannerData)) {
      return setShowBanners(false)
    } else {
      setBanners(bannerData.map(formatBannerType))
      return setShowBanners(true)
    }
  }, [bannerData, headerFooterData])

  return (
    <>
      <a href="#content" onClick={handleSkipLink} className="show-on-focus">
        Skip to Content
      </a>
      <Header />
      {showBanners ? banners : null}
      {children}
      <Footer />
    </>
  )
}
