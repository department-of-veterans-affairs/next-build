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
]

async function runA11yTestsForPages(pages, page, browserName) {
  let scanResultsArray = []
  const viewportSize = page.viewportSize()

  console.log('browser name:', browserName)
  console.log('viewport size:', viewportSize)

  for (const pageUrl of pages) {
    if (excludedPages.includes(pageUrl)) {
      console.log('skipping page:', pageUrl)
      continue
    }

    await page.goto(pageUrl)
    console.log('testing page:', pageUrl)

    // @todo The shared "makeAxeBuilder" never reports errors for whatever reason so not using for now.
    // const accessibilityScanResults = await makeAxeBuilder({ page }).analyze()

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('iframe')
      // @todo do the header and footer need to be scanned every page since I think they are the same?
      // .exclude('header')
      // .exclude('footer')
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
  }

  if (scanResultsArray.length > 0) {
    // Remove root array from scanResultsArray so we can merge results more cleanly.
    const trimmedScanResultsArray =
      JSON.stringify(scanResultsArray, null, 2).replace(/^\[|]$/g, '') +
      // Add a trailing comma to the output so JSON is valid when merged.
      ',\n'

    fs.writeFileSync(`segment-${segmentNumber}.json`, trimmedScanResultsArray)
  }

  return scanResultsArray
}

test.describe(`Accessibility Tests`, async () => {
  test.setTimeout(4200000)

  test(`the site should be accessible`, async ({
    page,
    browserName,
    // makeAxeBuilder,
  }, testInfo) => {
    const pages = await getSitemapLocations(
      process.env.BASE_URL || 'http://127.0.0.1:8001'
    )

    // Try reversing the pages to see if the last ones are the problem.
    const slim = pages.reverse()

    // fs.writeFileSync(`redirects.js`, JSON.stringify(slim, null, 2))

    let segment = slim
    if (segmentNumber !== 0) {
      segment = splitArray(slim, totalSegments)[segmentNumber - 1]
    }

    console.log('number of pages in segment', segment.length)

    const results = await runA11yTestsForPages(segment, page, browserName)
    // expect(results).toEqual([])
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
