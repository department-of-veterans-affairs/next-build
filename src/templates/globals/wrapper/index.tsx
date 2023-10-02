/* eslint-ignore no-console */
import { useState, useEffect } from 'react'
import { Banner } from '@/templates/globals/banners/banner'
import { PromoBanner } from '@/templates/globals/banners/promoBanner'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import { isEmpty } from 'lodash'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import { BannerDisplayType, BannerTypeMapping } from '@/data/queries/banners'
import { Header } from '../header'
import { Footer } from '../footer/index'
import { BannerType, FacilityBannerType, PromoBannerType } from '@/types/index'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  VetsGov?: {
    headerFooter?: any
  }
}
declare const window: customWindow

export interface LayoutProps {
  children?: React.ReactNode
  bannerData?: Array<
    NodeBanner | PromoBannerType | BannerType | FacilityBannerType
  >
  // type this
  headerFooterData?: any
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
  }, [bannerData, showBanners])

  return (
    <>
      <Header />
      {showBanners ? banners : null}
      <main>{children}</main>
      <Footer />
    </>
  )
}
