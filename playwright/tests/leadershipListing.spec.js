import { test, expect } from '../utils/next-test'

// This test should be modified to test page output and function.
test('Leadership_listing', () => {
  test('Leadership_listing page renders', async ({ page }) => {
    await page.goto('/boston-health-care/about-us/leadership')
    await expect(page).toHaveURL('/boston-health-care/about-us/leadership')
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/boston-health-care/about-us/leadership')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
