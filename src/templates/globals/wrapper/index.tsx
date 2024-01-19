/* eslint-ignore no-console */
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { Banner } from '@/templates/globals/banners/banner'
import { PromoBanner } from '@/templates/globals/banners/promoBanner'
import { FacilityBanner } from '@/templates/globals/banners/facilityBanner'
import { HeaderFooterData } from '@/types/formatted/headerFooter'
import { BannersData } from '@/types/formatted/banners'
import { NodeBannerType } from '@/types/drupal/node'
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
  bannerData: BannersData
  headerFooterData: HeaderFooterData
  children?: React.ReactNode
  preview?: boolean
  resource?: StaticPropsResource<FormattedResource>
}

const DynamicHeader = dynamic(
  () => import('../header').then((mod) => mod.Header),
  { ssr: false }
)
const DynamicFooter = dynamic(
  () => import('../footer').then((mod) => mod.Footer),
  { ssr: false }
)

export const formatBannerType = (bannerData) => {
  switch (bannerData?.type as string) {
    case NodeBannerType.PROMO_BANNER:
      return <PromoBanner key={bannerData.id} {...bannerData} />
    case NodeBannerType.FACILITY_BANNER:
      return <FacilityBanner key={bannerData.id} {...bannerData} />
    case NodeBannerType.BANNER:
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
      {/* Loads widgets built from vets-website after data has been added to window */}
      <Script
        id="staticPages"
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}static-pages.entry.js`}
      />

      <a href="#content" onClick={handleSkipLink} className="show-on-focus">
        Skip to Content
      </a>
      {preview ? <UnpublishedBanner resource={resource} /> : null}
      <DynamicHeader />
      {banners}
      {children}
      <DynamicFooter />
    </>
  )
}
