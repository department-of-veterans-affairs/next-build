import { test, expect } from '../utils/next-test'

// This test should be modified to test page output and function.
// test.describe('Leadership_listing', () => {
test.skip('Leadership_listing', () => {
  test('Leadership_listing page renders', async ({ page }) => {
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
