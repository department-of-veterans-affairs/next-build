/* eslint-disable no-console */
import { test } from '../utils/next-test'
import {
  getSitemapLocations,
  splitPagesIntoBatches,
} from '../utils/getSitemapLocations'
import fs from 'fs'

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8001'
const totalSegments = process.env.TOTAL_SEGMENTS
  ? Number(process.env.TOTAL_SEGMENTS)
  : 32
const segmentNumber = process.env.SEGMENT_INDEX
  ? Number(process.env.SEGMENT_INDEX)
  : 0
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
  'http://www.va.gov/js/smartbanner/README/',
  'http://www.va.gov/js/smartbanner/LICENSE/',
]

test.describe(`Accessibility Site Scan`, async () => {
  test.setTimeout(4200000)

  test(`The sitemap should contain accessible pages`, async ({
    page,
    browserName,
    makeAxeBuilder,
  }) => {
    const viewportSize = page.viewportSize()
    let scanResults = []
    let failedPages = []
    let pages = await getSitemapLocations(baseUrl)

    if (segmentNumber !== 0) {
      pages = splitPagesIntoBatches(pages, totalSegments)[segmentNumber - 1]
    }

    console.log('number of pages in segment', pages.length)
    console.log('browser name:', browserName)
    console.log('viewport size:', viewportSize)

    for (const pageUrl of pages) {
      if (excludedPages.includes(pageUrl)) {
        console.log('skipping scan of excluded page:', pageUrl)
        continue
      }

      try {
        console.log('testing page:', pageUrl)
        await page.goto(pageUrl)

        const accessibilityScanResults = await makeAxeBuilder({ page })
          .withTags(['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .exclude('iframe')
          // Exclude header and footer since they are shared on every page.
          .exclude('header')
          .exclude('footer')
          .analyze()

        console.log('page violations:', accessibilityScanResults.violations)
        if (accessibilityScanResults.violations.length > 0) {
          scanResults.push({
            url: pageUrl,
            browserName,
            viewportSize,
            violations: accessibilityScanResults.violations.map((violation) => {
              return {
                id: violation.id,
                description: violation.description,
                nodes: violation.nodes.map((node) => {
                  return {
                    html: node.html,
                    impact: node.impact,
                    target: node.target,
                    failureSummary: node.failureSummary,
                  }
                }),
              }
            }),
          })
        }
      } catch (error) {
        let message = error
        if (error instanceof Error) {
          message = error.message
        }

        console.log('error:', message)
        failedPages.push({
          url: pageUrl,
          browserName,
          viewportSize,
          error: message,
        })
      }
    }

    if (scanResults.length > 0) {
      fs.writeFileSync(
        `segment-${segmentNumber}.json`,
        JSON.stringify(scanResults, null, 2)
      )
    }

    if (failedPages.length > 0) {
      fs.writeFileSync(
        `failed-pages-segment-${segmentNumber}.json`,
        JSON.stringify(failedPages, null, 2)
      )
    }
  })
})
