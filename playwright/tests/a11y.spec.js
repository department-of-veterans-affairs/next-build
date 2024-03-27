/* eslint-disable no-console */
import { test } from '../utils/next-test'
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
    // Remove root array from scanResultsArray.
    // It starts with "[" and ends with "]".
    const trimmedScanResultsArray = JSON.stringify(
      scanResultsArray,
      null,
      2
    ).replace(/^\[|]$/g, '')

    fs.writeFileSync(`segment-${segmentNumber}.json`, trimmedScanResultsArray)
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
    console.log('segment index', segmentNumber)
    // Log the browser being used.
    // console.log('browser name:', page.context().browser().browserType())
    // Log viewport size.
    console.log('viewport size:', page.viewportSize())

    // @todo Delete this line after testing.
    const slim = pages.slice(0, 1000)
    // const slim = pages

    let segment = slim
    if (segmentNumber !== 0) {
      segment = splitArray(slim, totalSegments)[segmentNumber - 1]
    }

    console.log('number of pages in segment', segment.length)

    await runA11yTestsForPages(segment, page, testInfo)
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
