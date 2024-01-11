import { useEffect } from 'react'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { Wrapper } from '@/templates/globals/wrapper'
import { getGlobalElements } from '@/lib/drupal/getGlobalElements'
import { CommonAndPopular } from '@/templates/common/commonAndPopular'
import Head from 'next/head'

const Error404Page = ({ headerFooterData }) => {
  useEffect(() => {
    recordEvent({ event: 'nav-404-error' })
  })
  return (
    <>
      <Head>
        <title>VA.gov | Veterans Affairs</title>
      </Head>
      <Wrapper bannerData={[]} headerFooterData={headerFooterData}>
        <div className="main maintenance-page vads-u-padding-y--8" role="main">
          <div className="primary vads-u-margin-bottom--6">
            <div className="row">
              <div className="vads-u-text-align--center usa-content vads-u-margin-x--auto">
                <h3>Sorry — we can’t find that page</h3>
                <p>Try the search box or one of the common questions below.</p>
                <div className="feature">
                  <form
                    acceptCharset="UTF-8"
                    action="/search/"
                    id="search_form"
                    className="vads-u-width--full vads-u-display--flex vads-u-align-items--flex-start vads-u-justify-content--center"
                    method="get"
                  >
                    <label
                      htmlFor="mobile-query"
                      className="vads-u-visibility--screen-reader"
                    >
                      Search:
                    </label>
                    <input
                      autoComplete="off"
                      className="usagov-search-autocomplete vads-u-max-width--100 vads-u-margin--0"
                      id="mobile-query"
                      name="query"
                      type="text"
                    />
                    <input
                      type="submit"
                      value="Search"
                      className="vads-u-margin--0"
                      style={{ borderRadius: '0 3px 3px 0' }}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>

          <CommonAndPopular />
        </div>
      </Wrapper>
    </>
  )
}

export async function getStaticProps() {
  try {
    const { headerFooterData } = await getGlobalElements(
      undefined, // no banners on 404
      true // header only
    )
    return {
      props: {
        headerFooterData,
      },
    }
  } catch (error) {
    console.error('Failed to fetch global elements:', error)
  }
}

export default Error404Page
