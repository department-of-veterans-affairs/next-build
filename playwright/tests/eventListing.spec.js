const { test, expect } = require('../utils/next-test')

test.describe('eventListing', () => {
  test('Event Listing page renders with events that can be navigated to', async ({
    page,
  }) => {
    await page.goto('/outreach-and-events/events/')
    await page.locator('.events a').first().click()
    await expect(page).toHaveURL(/\/outreach-and-events\/events\//)
  })

  test('Event Listing widget can switch between event types', async ({
    page,
  }) => {
    await page.goto('/outreach-and-events/events/')
    await page.getByLabel('Filter by').selectOption('past')
    await page.getByLabel('Filter by').selectOption('upcoming')
    await page.getByLabel('Filter by').selectOption('specific-date')

    const specificDateLabel = page.getByLabel('Please tell us a date ')
    await expect(specificDateLabel).toBeVisible()
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
