/* eslint-disable no-console */
import { test, expect } from '../utils/next-test'
import { getSitemapLocations } from '../utils/getSitemapLocations'
import AxeBuilder from '@axe-core/playwright'
import fs from 'fs'

const totalSegments = process.env.TOTAL_SEGMENTS
  ? Number(process.env.TOTAL_SEGMENTS)
  : 32
const segmentNumber = process.env.SEGMENT_INDEX
  ? Number(process.env.SEGMENT_INDEX)
  : 0

// Exclude pages with redirects.
const excludedPages = [
  'http://www.va.gov/manage-va-debt/summary/',
  'http://www.va.gov/housing-assistance/home-loans/check-coe-status/your-coe/',
  'http://www.va.gov/education/download-letters/letters/',
  'http://www.va.gov/health-care/appointment-pre-check-in/',
  'http://www.va.gov/resources/search/',
  'http://www.va.gov/va-payment-history/payments/',
  'http://www.va.gov/records/get-veteran-id-cards/apply/',
  'http://www.va.gov/health-care/order-hearing-aid-or-CPAP-supplies-form/',
  'http://www.va.gov/education/gi-bill/post-9-11/ch-33-benefit/status/',
  'http://www.va.gov/housing-assistance/home-loans/request-coe-form-26-1880/',
  'http://www.va.gov/records/download-va-letters/letters/',
  'http://www.va.gov/decision-reviews/board-appeal/request-board-appeal-form-10182/',
  'http://www.va.gov/burials-memorials/memorial-items/presidential-memorial-certificates/request-certificate-form-40-0247/',
  'http://www.va.gov/my-health/order-hearing-aid-or-cpap-supplies-form/',
  'http://www.va.gov/education/other-va-education-benefits/veteran-rapid-retraining-assistance/apply-for-vrrap-form-22-1990s/',
  'http://www.va.gov/track-claims/',
  'http://www.va.gov/burials-and-memorials-v2/application/530/',
  'http://www.va.gov/profile/',
  'http://www.va.gov/my-va/',
  'http://www.va.gov/disability/view-disability-rating/rating/',
  'http://www.va.gov/view-change-dependents/view/',
  'http://www.va.gov/supporting-forms-for-claims/substitute-claimant-form-21P-0847/',
  'http://www.va.gov/supporting-forms-for-claims/alternate-signer-form-21-0972/',
  'http://www.va.gov/careers-employment/education-and-career-counseling/apply-career-guidance-form-25-8832/',
]

test.describe(`Accessibility Tests`, async () => {
  test.setTimeout(4200000)

  test(`the site should be accessible`, async ({
    page,
    browserName,
    // makeAxeBuilder,
  }, testInfo) => {
    let scanResultsArray = []
    const viewportSize = page.viewportSize()
    const pages = await getSitemapLocations(
      process.env.BASE_URL || 'http://127.0.0.1:8001'
    )

    // Reverse the pages since the last sitemap links were causing issues.
    // Easier to look at the first failed segment in GH Actions.
    let segment = pages.reverse()
    if (segmentNumber !== 0) {
      segment = splitArray(segment, totalSegments)[segmentNumber - 1]
    }

    console.log('number of pages in segment', segment.length)
    console.log('browser name:', browserName)
    console.log('viewport size:', viewportSize)

    for (const pageUrl of segment) {
      if (excludedPages.includes(pageUrl)) {
        console.log('skipping page:', pageUrl)
        continue
      }

      try {
        console.log('testing page:', pageUrl)
        await page.goto(pageUrl)

        // @todo The shared "makeAxeBuilder" never reports errors for whatever reason so not using for now.
        // const accessibilityScanResults = await makeAxeBuilder({ page }).analyze()

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .exclude('iframe')
          // Exclude header and footer since they are shared on every page.
          .exclude('header')
          .exclude('footer')
          .analyze()

        console.log('page violations:', accessibilityScanResults.violations)
        if (accessibilityScanResults.violations.length > 0) {
          const scanResults = {
            url: pageUrl,
            browserName,
            viewportSize,
            violations: accessibilityScanResults.violations,
          }
          scanResultsArray.push(scanResults)
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    if (scanResultsArray.length > 0) {
      // Remove root array from scanResultsArray so we can merge results more cleanly.
      const trimmedScanResultsArray =
        JSON.stringify(scanResultsArray, null, 2).replace(/^\[|]$/g, '') +
        // Add a trailing comma to the output so JSON is valid when merged.
        ',\n'

      fs.writeFileSync(`segment-${segmentNumber}.json`, trimmedScanResultsArray)
    }
  })
})

function splitArray(array, numChunks) {
  const chunkSize = Math.floor(array.length / numChunks)
  const remainder = array.length % numChunks
  const result = []

  let index = 0
  for (let i = 0; i < numChunks; i++) {
    const end = index + chunkSize + (i < remainder ? 1 : 0)
    result.push(array.slice(index, end))
    index = end
  }

  return result
}
