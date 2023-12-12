const { test, expect } = require('../utils/next-test')

test.describe('Event Page', () => {
  test('Event page renders with correct title and details', async ({
    page,
  }) => {
    await page.goto('/central-iowa-health-care/events/52265/')
    await expect(page.locator('h1')).toHaveText('Pickleball Club') // Replace with actual event title
    await expect(page.locator('.va-introtext')).toContainText('Pickleball') // Replace with actual event description
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/central-iowa-health-care/events/52265/')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
