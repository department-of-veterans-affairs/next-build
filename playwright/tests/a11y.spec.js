/* eslint-disable no-console */
import { test, expect } from '../utils/next-test'
import { getSitemapLocations } from '../utils/getSitemapLocations'
import AxeBuilder from '@axe-core/playwright'
import fs from 'fs'

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8001'
const totalSegments = process.env.TOTAL_SEGMENTS
  ? Number(process.env.TOTAL_SEGMENTS)
  : 32
const segmentNumber = process.env.SEGMENT_INDEX
  ? Number(process.env.SEGMENT_INDEX)
  : 0

test.describe(`Accessibility Site Scan`, async () => {
  test.setTimeout(4200000)

  test(`The sitemap should contain accessible pages`, async ({
    page,
    browserName,
    // makeAxeBuilder,
  }, testInfo) => {
    const viewportSize = page.viewportSize()
    let scanResults = []
    let failedPages = []
    let pages = await getSitemapLocations(baseUrl)

    if (segmentNumber !== 0) {
      pages = splitArray(pages, totalSegments)[segmentNumber - 1]
    }

    console.log('number of pages in segment', pages.length)
    console.log('browser name:', browserName)
    console.log('viewport size:', viewportSize)

    for (const pageUrl of pages) {
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
          scanResults.push({
            url: pageUrl,
            browserName,
            viewportSize,
            violations: accessibilityScanResults.violations,
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
      // Remove root array from scanResults so we can merge results more cleanly.
      const trimmedScanResults =
        JSON.stringify(scanResults, null, 2).replace(/^\[|]$/g, '') +
        // Add a trailing comma to the output so JSON is valid when merged.
        ',\n'

      fs.writeFileSync(`segment-${segmentNumber}.json`, trimmedScanResults)
    }

    if (failedPages.length > 0) {
      const trimmedFailedPages =
        JSON.stringify(failedPages, null, 2).replace(/^\[|]$/g, '') +
        // Add a trailing comma to the output so JSON is valid when merged.
        ',\n'

      fs.writeFileSync(
        `failed-pages-segment-${segmentNumber}.json`,
        trimmedFailedPages
      )
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
