import { ContentFooter } from '@/components/contentFooter/template'
import { PageLayout } from '@/components/pageLayout/template'
import { queries } from '@/lib/drupal/queries'
import { HomePageHero } from '@/components/homePageHero/template'
import { HomePageCommonTasks } from '@/components/homePageCommonTasks/template'
import { HomePageNewsSpotlight } from '@/components/homePageNewsSpotlight/template'
import Head from 'next/head'
import Script from 'next/script'

const HomePage = ({
  footerData,
  megaMenuData,
  bannerData,
  heroData,
  commonTasksData,
  newsSpotlightData,
}) => {
  return (
    <>
      <Head>
        <title>VA.gov | Veterans Affairs</title>
      </Head>
      <PageLayout
        bannerData={bannerData}
        footerData={footerData}
        megaMenuData={megaMenuData}
      >
        <main data-template="layouts/home" id="content">
          <HomePageHero {...heroData} />
          <HomePageCommonTasks {...commonTasksData} />
          <HomePageNewsSpotlight {...newsSpotlightData} />
          <div>TODO: add homepage-benefits</div>
          <div className="usa-grid usa-grid-full">
            <ContentFooter />
          </div>
          <div>TODO: add email signup</div>
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

export async function getStaticProps() {
  if (
    !process.env.FEATURE_NEXT_BUILD_CONTENT_HOMEPAGE ||
    (process.env.FEATURE_NEXT_BUILD_CONTENT_HOMEPAGE === 'false' &&
      process.env.FEATURE_NEXT_BUILD_CONTENT_ALL !== 'true')
  ) {
    return {
      notFound: true,
    }
  }
  try {
    const [
      footerData,
      megaMenuData,
      bannerData,
      heroData,
      commonTasksData,
      newsSpotlightData,
    ] = await Promise.all([
      queries.getData('footer-data'),
      queries.getData('header-data'),
      queries.getData('banner-data', {
        itemPath: '/',
      }),
      queries.getData('hero-data'),
      queries.getData('home-page-common-tasks'),
      queries.getData('home-page-news-spotlight'),
    ])

    return {
      props: {
        footerData,
        megaMenuData,
        bannerData,
        heroData,
        commonTasksData,
        newsSpotlightData,
      },
    }
  } catch (error) {
    console.error('Failed to fetch global elements:', error)
  }
}

export default HomePage
