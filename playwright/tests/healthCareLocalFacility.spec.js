import { test, expect } from '../utils/next-test'

// This test is a placeholder for the VAMC Facility page.
// Uses test.describe.
test.skip('Health_care_local_facility', () => {
  test('Health_care_local_facility page renders', async ({ page }) => {
    await page.goto('/update-this-link')
    await expect(page).toHaveURL('/update-this-link')
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/update-this-link')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
