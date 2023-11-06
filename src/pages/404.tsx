import React, { useEffect, useState } from 'react'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { Wrapper } from '@/templates/globals/wrapper'
import { getGlobalElements } from '@/lib/drupal/getGlobalElements'
import { CommonAndPopular } from '@/templates/common/commonAndPopular'

const Error404Page = ({ headerFooterData }) => {
  useEffect(() => {
    recordEvent({ event: 'nav-404-error' })
  })
  return (
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
  )
}

export async function getStaticProps() {
  // You can use your getGlobalElements function or any other function to fetch your data
  let headerFooterData = {}

  try {
    const globalData = await getGlobalElements(undefined, undefined, true)
    headerFooterData = globalData.headerFooterData || {}
  } catch (error) {
    // If there's an error, you'll receive it here. You might want to log this or handle it appropriately.
    console.error('Failed to fetch global elements:', error)
  }

  // Return the fetched data as props
  return {
    props: {
      headerFooterData,
    },
    revalidate: 60, // Optionally, you can enable ISR by setting a revalidation period
  }
}

export default Error404Page
