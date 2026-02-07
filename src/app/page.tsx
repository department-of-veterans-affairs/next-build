import Script from 'next/script'
import { notFound } from 'next/navigation'
import { ContentFooter } from '@/components/contentFooter/template'
import { PageLayout } from '@/components/pageLayout/template'
import { queries } from '@/lib/drupal/queries'
import { HomePageHero } from '@/components/homePageHero/template'
import { HomePageCommonTasks } from '@/components/homePageCommonTasks/template'
import { HomePageNewsSpotlight } from '@/components/homePageNewsSpotlight/template'
import { HomePageBenefits } from '@/components/homePageBenefits/template'
import { HomePageEmailSignup } from '@/components/homePageEmailSignup/template'
import { Meta } from '@/components/meta/template'

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
          <HomePageEmailSignup />
        </main>

        {/* Loads widgets built from vets-website after data has been added to window */}
        <Script
          id="staticPages"
          strategy="afterInteractive"
          src={`/generated/static-pages-essentials.entry.js`}
        />
        <Script
          id="staticPages"
          strategy="afterInteractive"
          src={`/generated/homepage.entry.js`}
        />
      </PageLayout>
    </>
  )
}
