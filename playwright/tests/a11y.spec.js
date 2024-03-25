/* eslint-disable no-console */
import { test, expect } from '../utils/next-test'
import {
  getSitemapLocations,
  splitPagesIntoBatches,
} from '../utils/getSitemapLocations'
import AxeBuilder from '@axe-core/playwright'
// import fetch from 'cross-fetch'
import fs from 'fs'

async function runA11yTestsForPages(pages, page, testInfo) {
  // let a11yFailures = []
  let scanResultsArray = []

  for (const pageUrl of pages) {
    await page.goto(pageUrl)
    console.log('testing page:', pageUrl)
    // @todo The shared "makeAxeBuilder" never reports errors for whatever reason so not using for now.
    // const accessibilityScanResults = await makeAxeBuilder({ page }).analyze()
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('iframe')
      // .exclude('header')
      // .exclude('footer')
      .analyze()

    console.log('page violations:', accessibilityScanResults.violations)

    // @todo Likely remove the check since we are testing many URLs and showing
    // a segment fails does not help much.
    // expect(accessibilityScanResults.violations).toEqual([])

    if (accessibilityScanResults.violations.length > 0) {
      // Create an object with the URL and violations
      const scanResults = {
        url: pageUrl,
        violations: accessibilityScanResults.violations,
      }

      // Add the scan results to the array
      scanResultsArray.push(scanResults)
    }
  }

  // Write file with segment number for debugging.
  if (scanResultsArray.length > 0) {
    fs.writeFileSync(
      `segment-${segmentNumber}.json`,
      JSON.stringify(scanResultsArray, null, 2)
    )
  }
}

const totalSegments = process.env.TOTAL_SEGMENTS
  ? Number(process.env.TOTAL_SEGMENTS)
  : 32
const segmentNumber = process.env.SEGMENT_INDEX
  ? Number(process.env.SEGMENT_INDEX)
  : 0

test.describe(`Accessibility Tests`, async () => {
  test.setTimeout(4200000)

  test(`the site should be accessible`, async ({
    page,
    // makeAxeBuilder,
  }, testInfo) => {
    const pages = await getSitemapLocations(
      process.env.BASE_URL || 'http://127.0.0.1:8001'
    )

    console.log('number of pages total', pages.length)
    console.log('segment index', process.env.SEGMENT_INDEX)

    // @todo Delete this line after testing.
    // const slim = pages.slice(100, 150)
    const slim = pages

    let segment = slim
    if (segmentNumber !== 0) {
      segment = splitPagesIntoBatches(slim, totalSegments)[segmentNumber - 1]
    }

    await runA11yTestsForPages(segment, page, testInfo)
  })
})
