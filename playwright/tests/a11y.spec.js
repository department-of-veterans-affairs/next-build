/* eslint-disable no-console */
const { test } = require('../utils/next-test')
const {
  getSitemapLocations,
  splitPagesIntoSegments,
} = require('../utils/getSitemapLocations')

async function runA11yTestsForPages(pages, testName, page, makeAxeBuilder) {
  let a11yFailures = []

  for (const pageUrl of pages) {
    await page.goto(pageUrl)
    const accessibilityScanResults = await makeAxeBuilder().analyze()

    if (accessibilityScanResults.violations.length > 0) {
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`URL: ${pageUrl}`)
        console.log(`Violation: ${violation.id}`)
        console.log(`Description: ${violation.description}`)
        console.log(`Impact: ${violation.impact}`)
        console.log(
          `Nodes: ${violation.nodes.map((node) => node.html).join(', ')}`
        )
      })

      a11yFailures.push({
        url: pageUrl,
        violations: accessibilityScanResults.violations,
      })
    }
  }

  if (a11yFailures.length > 0) {
    throw new Error(
      `Accessibility tests (${testName}) failed on ${a11yFailures.length} pages. Check logs for details.`
    )
  }
}

test.describe('Accessibility Tests', async () => {
  test.setTimeout(4200000)

  const pages = await getSitemapLocations(
    process.env.BASE_URL || 'http://127.0.0.1:8001'
  )

  let pageSegments

  test.beforeAll(async () => {
    pageSegments = await splitPagesIntoSegments(pages, 5)
  })

  for (let i = 0; i < 5; i++) {
    test(`the site should be accessible - Segment ${i + 1}`, async ({
      page,
      makeAxeBuilder,
    }) => {
      await runA11yTestsForPages(
        pageSegments[i],
        `Segment ${i + 1}`,
        page,
        makeAxeBuilder
      )
    })
  }
})
