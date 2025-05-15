import { test, expect } from '@/playwright/utils/next-test'

test.describe('eventListing', () => {
  test('Event Listing page renders with events that can be navigated to', async ({
    page,
  }) => {
    await page.goto('/outreach-and-events/events/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    await page.locator('.events va-link').first().click()
    await expect(page).toHaveURL(/\/events\//)
  })

  // TODO: fix this test, the eventListing widget seems to be causing errors
  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/butler-health-care/events', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
