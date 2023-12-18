/* eslint-ignore no-console */
import { useState, useEffect } from 'react'
import { Banner } from '@/templates/globals/banners/banner'
import { PromoBanner } from '@/templates/globals/banners/promoBanner'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import { isEmpty } from 'lodash'
import { HeaderFooterData } from '@/types/dataTypes/formatted/headerFooter'
import {
  Banner as FormattedBanner,
  FacilityBanner as FormattedFacilityBanner,
  PromoBanner as FormattedPromoBanner,
} from '@/types/dataTypes/formatted/banners'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import { BannerDisplayType, BannerTypeMapping } from '@/data/queries/banners'
import { Header } from '../header'
import { Footer } from '../footer/index'
import { handleSkipLink } from '@/lib/utils/handleSkipLink'
import { UnpublishedBanner } from '@/templates/common/preview'
import { StaticPropsResource } from '@/lib/drupal/staticProps'
import { FormattedResource } from '@/data/queries'

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
    | NodeBanner
    | FormattedPromoBanner
    | FormattedBanner
    | FormattedFacilityBanner
  >
  headerFooterData?: HeaderFooterData
  preview?: boolean
  resource?: StaticPropsResource<FormattedResource>
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
  preview,
  resource,
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
  }, [bannerData, showBanners, headerFooterData])

  return (
    <>
      <a href="#content" onClick={handleSkipLink} className="show-on-focus">
        Skip to Content
      </a>
      {preview ? <UnpublishedBanner resource={resource} /> : null}
      <Header />
      {showBanners ? banners : null}
      {children}
      <Footer />
    </>
  )
}
