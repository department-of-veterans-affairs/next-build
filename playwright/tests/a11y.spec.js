const { test, expect } = require('@playwright/test')
const { AxePuppeteer } = require('axe-playwright')
const getSitemapLocations = require('../utils/getSitemapLocations')

test.describe('Accessibility Tests', () => {
  test.setTimeout(180000)
  test('the site should be accessible', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8001'
    const pages = await getSitemapLocations(baseUrl)

    for (const pageUrl of pages) {
      await page.goto(pageUrl)
      // eslint-disable-next-line no-console
      console.log(`Now testing: ${pageUrl}`)

      const results = await new AxePuppeteer(page).analyze()
      expect(results.violations).toHaveLength(
        0,
        `Accessibility issues found on ${pageUrl}`
      )
    }
  })
})
