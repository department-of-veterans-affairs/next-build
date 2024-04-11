import { test, expect } from '../utils/next-test'

test.describe('vetCenter', () => {
  test('vetCenter page renders', async ({ page }) => {
    await page.goto('/pittsburgh-vet-center')
    await expect(page.locator('h1')).toHaveText('Pittsburgh Vet Center')
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/pittsburgh-vet-center')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
