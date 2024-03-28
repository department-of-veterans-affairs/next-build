/* eslint-disable no-console */
import { test, expect } from '../utils/next-test'
import { getSitemapLocations } from '../utils/getSitemapLocations'
import AxeBuilder from '@axe-core/playwright'
import fs from 'fs'

async function runA11yTestsForPages(pages, page, testInfo) {
  let scanResultsArray = []

  for (const pageUrl of pages) {
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

    // dummy expect so page has time to analyze, perhaps
    await expect(page.locator('body')).toBeVisible()

    console.log('page violations:', accessibilityScanResults.violations)

    if (accessibilityScanResults.violations.length > 0) {
      const scanResults = {
        url: pageUrl,
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
    browserName,
    // makeAxeBuilder,
  }, testInfo) => {
    const pages = await getSitemapLocations(
      process.env.BASE_URL || 'http://127.0.0.1:8001'
    )

    console.log('number of pages total', pages.length)
    console.log('segment index', segmentNumber)
    console.log('browser name:', browserName)
    console.log('viewport size:', page.viewportSize())

    // @todo Delete this line after testing.
    // const slim = pages.slice(0, 1000)
    const slim = pages

    let segment = slim
    if (segmentNumber !== 0) {
      segment = splitArray(slim, totalSegments)[segmentNumber - 1]
    }

    console.log('number of pages in segment', segment.length)

    const results = await runA11yTestsForPages(segment, page, testInfo)
    expect(results).toEqual([])
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
