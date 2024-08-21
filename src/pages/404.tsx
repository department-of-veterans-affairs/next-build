import { useEffect } from 'react'
import { recordEvent } from '@/lib/analytics/recordEvent'
// import { Wrapper } from '@/templates/layouts/wrapper'
// import { getGlobalElements } from '@/lib/drupal/getGlobalElements'
import { CommonAndPopular } from '@/templates/common/commonAndPopular'
import Head from 'next/head'
import Script from 'next/script'

const Error404Page = () => {
  useEffect(() => {
    recordEvent({ event: 'nav-404-error' })
  })
  return (
    <>
      <Head>
        <title>VA.gov | Veterans Affairs</title>
      </Head>

      <div className="main maintenance-page vads-u-padding-top--4" role="main">
        <div className="primary">
          <div className="row">
            <div className="usa-content vads-u-text-align--center vads-u-margin-x--auto">
              <h3>Sorry — we can’t find that page</h3>
              <p>Try the search box or one of the common questions below.</p>
              <div className="feature vads-u-display--flex vads-u-align-items--center">
                <form
                  acceptCharset="UTF-8"
                  action="/search/"
                  id="search_form"
                  className="full-width search-form-bottom-margin"
                  method="get"
                >
                  <div
                    className="vads-u-display--flex vads-u-align-items--flex-start vads-u-justify-content--center"
                    style={{ height: '5.7rem' }}
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
          </div>
        </div>
      </div>

      <CommonAndPopular />

      {/* Loads widgets built from vets-website after data has been added to window */}
      <Script
        id="staticPages"
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}static-pages.entry.js`}
      />
    </>
  )
}

export default Error404Page
