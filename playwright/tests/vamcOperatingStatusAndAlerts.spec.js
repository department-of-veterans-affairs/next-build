import { test, expect } from '../utils/next-test'

// This test should be modified to test page output and function.
test.describe('Vamc_operating_status_and_alerts', () => {
  test('Vamc_operating_status_and_alerts page renders', async ({ page }) => {
    await page.goto('/tomah-health-care/operating-status/')
    await expect(page).toHaveURL('/tomah-health-care/operating-status/')
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/tomah-health-care/operating-status/')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
