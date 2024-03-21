/* eslint-disable no-console */
import { test, expect } from '../utils/next-test'
import {
  getSitemapLocations,
  splitPagesIntoBatches,
} from '../utils/getSitemapLocations'
import AxeBuilder from '@axe-core/playwright'

async function runA11yTestsForPages(pages, testName, page, testInfo) {
  // let a11yFailures = []
  let scanResultsArray = []

  for (const pageUrl of pages) {
    await page.goto(pageUrl)
    console.log('testing page:', pageUrl)
    // @todo The shared "makeAxeBuilder" never reports errors for whatever reason so not using for now.
    // const accessibilityScanResults = await makeAxeBuilder({ page }).analyze()
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .include('main')
      .exclude('iframe')
      .analyze()

    // Create an object with the URL and violations
    const scanResults = {
      url: pageUrl,
      violations: accessibilityScanResults.violations,
    }

    // Add the scan results to the array
    scanResultsArray.push(scanResults)

    console.log('page violations:', accessibilityScanResults.violations)
    // @todo Likely remove the check since we are testing many URLs and showing
    // a segment fails does not help much.
    expect(accessibilityScanResults.violations).toEqual([])

    // if (accessibilityScanResults.violations.length > 0) {
    //   accessibilityScanResults.violations.forEach((violation) => {
    //     console.log(`URL: ${pageUrl}`)
    //     console.log(`Violation: ${violation.id}`)
    //     console.log(`Description: ${violation.description}`)
    //     console.log(`Impact: ${violation.impact}`)
    //     console.log(
    //       `Nodes: ${violation.nodes.map((node) => node.html).join(', ')}`
    //     )
    //   })
    //   a11yFailures.push({
    //     url: pageUrl,
    //     violations: accessibilityScanResults.violations,
    //   })
    // }
  }

  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(scanResultsArray, null, 2),
    contentType: 'application/json',
  })

  // if (a11yFailures.length > 0) {
  //   throw new Error(
  //     `Accessibility tests (${testName}) failed on ${a11yFailures.length} pages. Check logs for details.`
  //   )
  // }
}

let pageSegments = []
const BATCH_SIZE = 5
test.describe('Accessibility Tests', async () => {
  test.setTimeout(4200000)

  // todo: this is probably better as some kind of global setup & env var, so sitemap isn't processed on each test
  // see the process.env properties example here:
  // https://playwright.dev/docs/test-global-setup-teardown#option-2-configure-globalsetup-and-globalteardown
  test.beforeAll(async () => {
    console.log('before all')
    const pages = await getSitemapLocations(
      process.env.BASE_URL || 'http://127.0.0.1:8001'
    )
    console.log('number of pages total', pages.length)
    const slim = pages.slice(0, 1000) // for faster testing

    pageSegments = splitPagesIntoBatches(slim, BATCH_SIZE)
  })

  for (let i = 0; i < BATCH_SIZE; i++) {
    test(`the site should be accessible - Segment ${i + 1}`, async ({
      page,
      // makeAxeBuilder,
    }, testInfo) => {
      await runA11yTestsForPages(
        pageSegments[i],
        `Segment ${i + 1}`,
        page,
        // makeAxeBuilder,
        testInfo
      )
    })
  }
})
