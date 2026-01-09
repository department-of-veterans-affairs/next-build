import Script from 'next/script'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ContentFooter } from '@/components/contentFooter/template'
import { PageLayout } from '@/components/pageLayout/template'
import { queries } from '@/lib/drupal/queries'
import { HomePageHero } from '@/components/homePageHero/template'
import { HomePageCommonTasks } from '@/components/homePageCommonTasks/template'
import { HomePageNewsSpotlight } from '@/components/homePageNewsSpotlight/template'
import { HomePageBenefits } from '@/components/homePageBenefits/template'
import { generateAbsoluteUrlFromEnv } from '@/lib/utils/environment'
import { BUILD_TYPES } from '@/lib/constants/environment'

export const metadata: Metadata = {
  title: 'VA.gov | Veterans Affairs',
  description: 'Welcome to VA.gov',
  openGraph: {
    siteName: 'Veterans Affairs',
    title: 'VA.gov | Veterans Affairs',
    type: 'website',
    url: generateAbsoluteUrlFromEnv('/'),
    images: [
      {
        url: '/img/design/logo/va-og-image.png',
        alt: 'U.S. Department of Veterans Affairs logo',
      },
    ],
  },
  twitter: {
    site: '@DeptVetAffairs',
    title: 'VA.gov | Veterans Affairs',
    card: 'summary',
    images: [
      {
        url: '/img/design/logo/va-og-twitter-image.png',
        alt: 'U.S. Department of Veterans Affairs logo',
      },
    ],
  },
  robots:
    process.env.NEXT_PUBLIC_BUILD_TYPE !== BUILD_TYPES.PROD
      ? 'noindex'
      : undefined,
  alternates: {
    canonical: generateAbsoluteUrlFromEnv('/'),
  },
  other: {
    HandheldFriendly: 'True',
    MobileOptimized: '320',
  },
}

export default async function HomePage() {
  // Check feature flags - prevent route from building if flags aren't set
  // FEATURE_NEXT_BUILD_CONTENT_ALL bypasses all flag checks
  if (
    process.env.FEATURE_NEXT_BUILD_CONTENT_ALL !== 'true' &&
    process.env.FEATURE_NEXT_BUILD_CONTENT_HOMEPAGE !== 'true'
  ) {
    notFound()
  }

  const [
    footerData,
    megaMenuData,
    bannerData,
    heroData,
    commonTasksData,
    newsSpotlightData,
    benefitsData,
  ] = await Promise.all([
    queries.getData('footer-data'),
    queries.getData('header-data'),
    queries.getData('banner-data', {
      itemPath: '/',
    }),
    queries.getData('hero-data'),
    queries.getData('home-page-common-tasks'),
    queries.getData('home-page-news-spotlight'),
    queries.getData('home-page-benefits'),
  ])

  return (
    <>
      <PageLayout
        bannerData={bannerData}
        footerData={footerData}
        megaMenuData={megaMenuData}
      >
        <main data-template="layouts/home" id="content">
          <HomePageHero {...heroData} />
          <HomePageCommonTasks {...commonTasksData} />
          <HomePageNewsSpotlight {...newsSpotlightData} />
          <HomePageBenefits {...benefitsData} />
          <div className="vads-grid-container">
            <ContentFooter />
          </div>
          <div className="homepage-email-update-wrapper vads-u-background-color--primary-alt-lightest vads-u-padding-x--2p5 vads-u-padding-top--2p5">
            <div data-widget-type="homepage-email-signup"></div>
            <div
              id="vets-banner-1"
              className="vads-u-display--none tablet:vads-u-display--block"
            >
              <div className="veteran-banner-container vads-u-margin-y--0 vads-u-margin-x--auto">
                <picture>
                  <source
                    srcSet="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-mobile-1.png 640w, https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-mobile-2.png 920w, https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-mobile-3.png 1316w"
                    media="(max-width: 767px)"
                  />
                  <source
                    srcSet="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-tablet-1.png 1008w, https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-tablet-2.png 1887w"
                    media="(max-width: 1008px)"
                  />
                  <img
                    className="vads-u-width--full"
                    src="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-desktop-1.png"
                    srcSet="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-desktop-1.png 1280w, https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/homepage/veterans-banner-desktop-2.png 2494w"
                    loading="lazy"
                    alt="Veteran portraits"
                  />
                </picture>
              </div>
            </div>
          </div>
        </main>

        {/* Loads widgets built from vets-website after data has been added to window */}
        <Script
          id="staticPages"
          strategy="afterInteractive"
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}static-pages.entry.js`}
        />
      </PageLayout>
    </>
  )
}
