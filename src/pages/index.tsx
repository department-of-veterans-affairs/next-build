import { ContentFooter } from '@/components/contentFooter/template'
import { PageLayout } from '@/components/pageLayout/template'
import { queries } from '@/lib/drupal/queries'
import Head from 'next/head'
import Script from 'next/script'

const HomePage = ({ footerData, megaMenuData, bannerData }) => {
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
          <div>TODO: add HERO</div>
          <div>TODO: add Common tasks</div>
          <div>TODO: add news-spotlight</div>
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
    process.env.FEATURE_NEXT_BUILD_CONTENT_HOMEPAGE === 'false' &&
    process.env.FEATURE_NEXT_BUILD_CONTENT_ALL !== 'true'
  ) {
    return {
      notFound: true,
    }
  }
  try {
    // Fetch header and footer data directly (no banners on 404)
    const [footerData, megaMenuData] = await Promise.all([
      queries.getData('footer-data'),
      queries.getData('header-data'),
    ])

    return {
      props: {
        footerData,
        megaMenuData,
        bannerData: [], // no banners on 404
      },
    }
  } catch (error) {
    console.error('Failed to fetch global elements:', error)
  }
}

export default HomePage
