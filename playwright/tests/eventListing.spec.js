const { test, expect } = require('../utils/next-test')

test.describe('eventListing', () => {
  test('Event Listing page renders with events that can be navigated to', async ({
    page,
  }) => {
    await page.goto('/butler-health-care/events')
    await page.locator('.events a').first().click()
    await expect(page).toHaveURL(/\/butler-health-care\/events\//)
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/butler-health-care/events')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
