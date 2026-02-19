import { Banner } from '@/components/banner/template'
import { PromoBanner } from '@/components/promoBanner/template'
import { FooterLink } from '@/components/footer/formatted-type'
import { MegaMenuSection } from '@/components/header/formatted-type'
import { BannersData } from '@/components/banner/formatted-type'
import { BANNER_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { UnpublishedBanner } from '@/components/preview/template'
import { StaticPropsResource } from '@/lib/drupal/staticProps'
import { FormattedPageResource } from '@/lib/drupal/queries'
import { Footer } from '@/components/footer/template'
import { Header } from '@/components/header/template'
import { WindowDataProvider } from './WindowDataProvider'
import { SkipLink } from './SkipLink'

export interface PageLayoutProps {
  bannerData: BannersData
  footerData: FooterLink[]
  megaMenuData: MegaMenuSection[]
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

/**
 * Server component for page layout.
 * Uses WindowDataProvider client component for window.VetsGov initialization.
 */
export function PageLayout({
  bannerData,
  footerData,
  megaMenuData,
  preview,
  resource,
  children,
}: PageLayoutProps) {
  // determine what type of banners to display
  const banners = bannerData.map(formatBannerType)

  return (
    <>
      <WindowDataProvider footerData={footerData} megaMenuData={megaMenuData} />
      <SkipLink />
      {preview ? <UnpublishedBanner resource={resource} /> : null}
      <Header />
      {banners}
      <div data-widget-type="situation-updates-banner"></div>
      {children}
      <Footer />
    </>
  )
}
