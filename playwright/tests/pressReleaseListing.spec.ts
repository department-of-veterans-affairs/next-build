import { test, expect } from '@/playwright/utils/next-test'

test.describe('pressReleaseListing', () => {
  test('pressReleaseListing page renders with stories that can be navigated to', async ({
    page,
  }) => {
    await page.goto('/southern-nevada-health-care/news-releases', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })
    await page.locator('.usa-unstyled-list a').first().click()
    await expect(page).toHaveURL(
      /\/southern-nevada-health-care\/news-releases\//
    )
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/southern-nevada-health-care/news-releases')

    const accessibilityScanResults = await makeAxeBuilder()
      .exclude('va-pagination')
      .exclude('.usa-pagination__link')
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
