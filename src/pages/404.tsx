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
        <div className="main maintenance-page" role="main">
          <div className="primary">
            <div className="row">
              <div className="text-center usa-content">
                <h3>Sorry — we can’t find that page</h3>
                <p>Try the search box or one of the common questions below.</p>
                <div className="feature va-flex va-flex--ctr">
                  <form
                    acceptCharset="UTF-8"
                    action="/search/"
                    id="search_form"
                    className="full-width"
                    method="get"
                  >
                    <div className="va-flex va-flex--top va-flex--jctr">
                      <label htmlFor="mobile-query">Search:</label>
                      <input
                        autoComplete="off"
                        className="usagov-search-autocomplete full-width"
                        id="mobile-query"
                        name="query"
                        type="text"
                      />
                      <input type="submit" value="Search" />
                    </div>
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
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi`,
      undefined,
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
