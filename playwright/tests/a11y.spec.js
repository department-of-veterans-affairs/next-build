/* eslint-disable no-console */
import AxeBuilder from '@axe-core/playwright'
import { test } from '@playwright/test'
const getSitemapLocations = require('../utils/getSitemapLocations')

test.skip('Accessibility Tests', () => {
  test.setTimeout(4200000)

  test('the site should be accessible', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8001'
    const pages = await getSitemapLocations(baseUrl)

    let a11yFailures = []

    for (const pageUrl of pages) {
      await page.goto(pageUrl)
      console.log(`Now testing: ${pageUrl}`)

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

      if (accessibilityScanResults.violations.length > 0) {
        a11yFailures.push({
          url: pageUrl,
          violations: accessibilityScanResults.violations,
        })
      }
    }
    console.log(`Total pages tested: ${pages.length}`)

    if (a11yFailures.length > 0) {
      console.log(`Accessibility issues found on ${a11yFailures.length} pages:`)
      a11yFailures.forEach((failure) => {
        console.log(`\nPage: ${failure.url}`)
        failure.violations.forEach((violation) => {
          console.log(`Violation: ${violation.id}`)
          console.log(`Description: ${violation.description}`)
          console.log(`Impact: ${violation.impact}`)
          console.log(
            `Nodes: ${violation.nodes.map((node) => node.html).join(', ')}`
          )
        })
      })

      throw new Error(
        `Accessibility tests failed on ${a11yFailures.length} pages.`
      )
    } else {
      console.log('No accessibility issues found.')
    }
  })
})
