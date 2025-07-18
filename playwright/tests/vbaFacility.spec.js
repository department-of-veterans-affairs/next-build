import { test, expect } from '../utils/next-test'

// This test should be modified to test page output and function.
test('Vba_facility', () => {
  test('Vba_facility page renders', async ({ page }) => {
    await page.goto(
      '/togus-va-regional-benefit-office-at-togus-va-medical-center'
    )
    await expect(page).toHaveURL(
      '/togus-va-regional-benefit-office-at-togus-va-medical-center'
    )
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto(
      '/togus-va-regional-benefit-office-at-togus-va-medical-center'
    )

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
