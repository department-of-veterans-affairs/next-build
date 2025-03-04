import { useEffect } from 'react'
import { Banner } from '@/templates/common/banners/banner'
import { PromoBanner } from '@/templates/common/banners/promoBanner'
import { HeaderFooterData } from '@/types/formatted/headerFooter'
import { BannersData } from '@/types/formatted/banners'
import { BANNER_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { handleSkipLink } from '@/lib/utils/handleSkipLink'
import { UnpublishedBanner } from '@/templates/common/preview'
import { StaticPropsResource } from '@/lib/drupal/staticProps'
import { FormattedPageResource } from '@/data/queries'
import { Footer } from '../../common/footer'
import { Header } from '../../common/header'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  VetsGov?: {
    headerFooter?: HeaderFooterData
  }
}
declare const window: customWindow

export interface LayoutProps {
  bannerData: BannersData
  headerFooterData: HeaderFooterData
  children?: React.ReactNode
  preview?: boolean
  resource?: StaticPropsResource<FormattedPageResource>
}

export const formatBannerType = (bannerData) => {
  switch (bannerData?.type as string) {
    case BANNER_RESOURCE_TYPES.PROMO:
      return <PromoBanner key={bannerData.id} {...bannerData} />
    case BANNER_RESOURCE_TYPES.BASIC:
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
  useEffect(() => {
    // Place header & footer data on window object for vets-website widgets
    window.VetsGov = {}
    window.VetsGov.headerFooter = headerFooterData
  }, [headerFooterData])

  // determine what type of banners to display
  const banners = bannerData.map(formatBannerType)

  return (
    <>
      <a href="#content" onClick={handleSkipLink} className="show-on-focus">
        Skip to Content
      </a>
      {preview ? <UnpublishedBanner resource={resource} /> : null}
      <Header />
      {banners}
      <div data-widget-type="situation-updates-banner"></div>
      {children}
      <Footer />
    </>
  )
}
