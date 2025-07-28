import { test, expect } from '../utils/next-test'

test.describe('Health Services Listing', () => {
  test('renders health services listing page', async ({ page }) => {
    await page.goto('/boston-health-care/health-services/')

    await expect(page.locator('h1')).toContainText('Health services')
    await expect(page).toHaveURL('/boston-health-care/health-services/')
  })

  test('should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/boston-health-care/health-services/')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
