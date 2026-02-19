import Script from 'next/script'
import { notFound } from 'next/navigation'
import { ContentFooter } from '@/components/contentFooter/template'
import { PageLayout } from '@/components/pageLayout/template'
import { queries } from '@/lib/drupal/queries'
import { HomePageHero } from '@/components/homePageHero/template'
import { HomePageCommonTasks } from '@/components/homePageCommonTasks/template'
import { HomePageNewsSpotlight } from '@/components/homePageNewsSpotlight/template'
import { HomePageBenefits } from '@/components/homePageBenefits/template'
import { Meta } from '@/components/meta/template'

export default async function HomePage() {
  // In the previous implementation, returning a "not found" was enough to tell the
  // static site generation process to skip building the page. In Next.js's new "App
  // Router", this will actually result in the page being built with 404 content during
  // static site generation. When serving this route from a dev server, it will actually
  // return a true 404 status code. Because of this discrepancy, we have to augment the
  // following logic with an external post-export cleanup script for static builds.
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
      <Meta
        resource={{
          title: 'VA.gov | Veterans Affairs',
          entityPath: '/',
          lastUpdated: new Date().toISOString(),
        }}
      />
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
