import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

const getSitemapLocations = require('../utils/getSitemapLocations')

test.describe('Accessibility Tests', () => {
  test.setTimeout(180000)

  test('the site should be accessible', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8001'
    const pages = await getSitemapLocations(baseUrl)

    for (const pageUrl of pages) {
      await page.goto(pageUrl)

      // eslint-disable-next-line no-console
      console.log(`Now testing: ${pageUrl}`)

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze() // 4

      expect(accessibilityScanResults.violations).toEqual([])
    }
  })
})
