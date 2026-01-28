import { useEffect } from 'react'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { PageLayout } from '@/components/pageLayout/template'
import { queries } from '@/lib/drupal/queries'
import { CommonAndPopular } from '@/components/commonAndPopular/template'
import Head from 'next/head'
import Script from 'next/script'

const Error404Page = ({ footerData, megaMenuData, bannerData }) => {
  useEffect(() => {
    recordEvent({ event: 'nav-404-error' })
  })
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
        <main className="maintenance-page vads-u-padding-top--4">
          <div className="usa-content vads-u-text-align--center vads-u-margin-x--auto">
            <h3>Sorry — we can’t find that page</h3>
            <p>Try the search box or one of the common questions below.</p>
            <div className="vads-u-display--flex vads-u-align-items--center vads-u-background-color--primary-alt-lightest vads-u-padding--2 vads-u-margin-y--3 vads-u-margin-x--0">
              <form
                acceptCharset="UTF-8"
                action="/search/"
                id="search_form"
                className="full-width search-form-bottom-margin"
                method="get"
              >
                <div
                  className="vads-u-display--flex vads-u-align-items--flex-start vads-u-justify-content--center"
                  style={{ height: '3.5rem' }}
                >
                  <label htmlFor="mobile-query" className="sr-only">
                    Search:
                  </label>
                  <input
                    autoComplete="off"
                    className="usagov-search-autocomplete full-width vads-u-height--full vads-u-margin--0 vads-u-max-width--100"
                    id="mobile-query"
                    name="query"
                    type="text"
                  />
                  <input
                    type="submit"
                    value="Search"
                    style={{ borderRadius: '0 3px 3px 0' }}
                    className="vads-u-height--full vads-u-margin--0"
                  />
                </div>
              </form>
            </div>
          </div>
        </main>

        <div className="vads-grid-container">
          <CommonAndPopular />
        </div>

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

export default Error404Page
