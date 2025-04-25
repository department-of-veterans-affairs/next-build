import { test, expect } from '@/playwright/utils/next-test'

test.describe('Story Listing', () => {
  test('Story Listing page renders with stories that can be navigated to', async ({
    page,
  }) => {
    await page.goto('/butler-health-care/stories')
    await page.locator('.usa-unstyled-list a').first().click()
    await expect(page).toHaveURL(/\/butler-health-care\/stories\//)
  })

  test('Story Listing pages should be paginated if there are more than 10 stories', async ({
    page,
  }) => {
    await page.goto('/eastern-oklahoma-health-care/stories')

    // Click on "Page 2" link and wait for URL to change
    const page2Link = page.getByLabel('Page 2')
    await page2Link.click()
    await page.waitForURL(/\/page-2\//)
    await expect(page).toHaveURL(/\/page-2\//)

    // Check that next-page pagination link is visible and enabled
    const nextPageLink = page.getByLabel('Next page')
    await expect(nextPageLink).toBeVisible()
    await expect(nextPageLink).toBeEnabled()
  })

  test('Story Listing should handle double-digit page numbers correctly', async ({
    page,
  }) => {
    await page.goto('/washington-dc-health-care/stories')
    for (let i = 1; i < 10; i++) {
      const nextPageLink = page.getByLabel('Next page')
      // Ensure it's visible and interactable before click
      await expect(nextPageLink).toBeVisible({ timeout: 5000 })
      // Wait for click + navigation concurrently
      await Promise.all([
        page.waitForURL(new RegExp(`/page-${i + 1}/`), { timeout: 10000 }),
        nextPageLink.click(),
      ])
    }
    // Now on page 10
    await expect(page).toHaveURL(/\/page-10\//)
    const storyItems = page.locator('.usa-unstyled-list li')
    await expect(storyItems).toHaveCount(10)
    // Go to page 11
    const nextPageLink = page.getByLabel('Next page')
    await Promise.all([
      page.waitForURL(/\/page-11\//, { timeout: 10000 }),
      nextPageLink.click(),
    ])
    await expect(page).toHaveURL(/\/page-11\//)
    await expect(storyItems).toHaveCount(10)
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/butler-health-care/stories')
    const accessibilityScanResults = await makeAxeBuilder()
      .exclude('va-pagination')
      .exclude('.usa-pagination__link')
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
