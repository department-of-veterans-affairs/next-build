/* eslint-disable no-console */
import { test, expect } from '../utils/next-test'
// import {
//   getSitemapLocations,
//   splitPagesIntoBatches,
// } from '../utils/getSitemapLocations'
import AxeBuilder from '@axe-core/playwright'
// import { getFetcher } from 'proxy-fetcher'
import fetch from 'cross-fetch'

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
// for (let i = 0; i < BATCH_SIZE; i++) {
test.describe(`Accessibility Tests`, async () => {
  test.setTimeout(4200000)

  // todo: this is probably better as some kind of global setup & env var, so sitemap isn't processed on each test
  // see the process.env properties example here:
  // https://playwright.dev/docs/test-global-setup-teardown#option-2-configure-globalsetup-and-globalteardown
  // test.beforeAll(async () => {
  //   console.log('before all')
  //   const pages = await getSitemapLocations(
  //     process.env.BASE_URL || 'http://127.0.0.1:8001'
  //   )
  //   console.log('number of pages total', pages.length)
  //   const slim = pages.slice(0, 50) // for faster testing
  //
  //   pageSegments = splitPagesIntoBatches(slim, BATCH_SIZE)
  // })

  test(`the site should be accessible`, async ({
    page,
    // makeAxeBuilder,
  }, testInfo) => {
    const pages = await getSitemapLocations(
      process.env.BASE_URL || 'http://127.0.0.1:8001'
    )
    console.log('number of pages total', pages.length)
    console.log('segment index', process.env.SEGMENT_INDEX)
    const slim = pages.slice(0, 50) // for faster testing
    pageSegments = splitPagesIntoBatches(slim, BATCH_SIZE)
    const segment = process.env.SEGMENT_INDEX
      ? pageSegments[process.env.SEGMENT_INDEX]
      : slim

    await runA11yTestsForPages(segment, page, testInfo)
  })
})
// }

async function getSitemapLocations(baseUrl) {
  // handle trailing slash
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const mainSitemapUrl = `${base}/sitemap.xml`

  const response = await fetch(mainSitemapUrl)

  const xml = await response.text()
  const locs = []

  const urls = extractUrlsFromXML(xml)

  for (const url of urls) {
    // toplevel sitemap is an index of additional sitemaps
    if (url.endsWith('.xml')) {
      const response = await fetch(url)
      const xml = await response.text()
      const urls = extractUrlsFromXML(xml)
      locs.push(urls)
    } else {
      locs.push(url)
    }
  }

  return locs.flat()
}

// VA.gov sitemaps have a lot of urls in them. Helper function for things that
// may want to parallelize checking that list (broken links, a11y, etc.)
function splitPagesIntoBatches(pages, batchCount) {
  const batchSize = Math.ceil(pages.length / batchCount)
  return new Array(Number(batchCount)).fill().map((_, index) => {
    return pages.slice(index * batchSize, (index + 1) * batchSize)
  })
}

function extractUrlsFromXML(xml) {
  return [...xml.matchAll(new RegExp(`<loc>(.|\n)*?</loc>`, 'g'))].map(
    ([loc]) => {
      return loc
        .replace('<loc>', '')
        .replace('</loc>', '')
        .replace(/^https:/, 'http:')
    }
  )
}
