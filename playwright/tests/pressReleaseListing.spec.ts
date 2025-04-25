import { test, expect } from '@/playwright/utils/next-test'

test.describe('pressReleaseListing', () => {
  test('pressReleaseListing page renders with stories that can be navigated to', async ({
    page,
  }) => {
    await page.goto('/southern-nevada-health-care/news-releases')
    await page.locator('.usa-unstyled-list a').first().click()
    await expect(page).toHaveURL(
      /\/southern-nevada-health-care\/news-releases\//
    )
  })

  test('Press Release Listing page should be paginated if there are more than 10 stories', async ({
    page,
  }) => {
    await page.goto('/southern-nevada-health-care/news-releases')

    //Click on "Page 2" link and wait for URL to change
    const page2Link = page.getByLabel('Page 2')
    await page2Link.click()
    await page.waitForURL(/\/page-2\//)
    await expect(page).toHaveURL(/\/page-2\//)

    //Check that next-page pagination link is visible and enabled
    const nextPageLink = page.getByLabel('Next page')
    await expect(nextPageLink).toBeVisible()
    await expect(nextPageLink).toBeEnabled()
  })

  test('Press Release Listing should handle double-digit page numbers correctly', async ({
    page,
  }) => {
    await page.goto('/saginaw-health-care/news-releases')
    for (let i = 1; i < 10; i++) {
      const nextPageLink = page.getByLabel('Next page')
      // Confirm it's visible before clicking
      await expect(nextPageLink).toBeVisible({ timeout: 5000 })
      // Wait for both the click and URL change — works with client-side routing
      await Promise.all([
        page.waitForURL(new RegExp(`/page-${i + 1}/`), { timeout: 10000 }),
        nextPageLink.click(),
      ])
    }
    // Confirm we’re on page 10
    await expect(page).toHaveURL(/\/page-10\//)
    const pressReleaseItems = page.locator('.usa-unstyled-list li')
    await expect(pressReleaseItems).toHaveCount(10)
    // Navigate to page 11
    const nextPageLink = page.getByLabel('Next page')
    await Promise.all([
      page.waitForURL(/\/page-11\//, { timeout: 10000 }),
      nextPageLink.click(),
    ])
    await expect(page).toHaveURL(/\/page-11\//)
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
