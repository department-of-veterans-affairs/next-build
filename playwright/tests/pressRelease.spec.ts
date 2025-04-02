import { test, expect } from '../utils/next-test'

test.describe('pressRelease', () => {
  test('pressRelease page renders', async ({ page }) => {
    await page.goto(
      '/southern-nevada-health-care/news-releases/vasnhs-helping-veterans-prepare-for-secure-sign-in-changes/'
    )
    await expect(page.locator('h1')).toHaveText(
      'VASNHS Helping Veterans Prepare for Secure Sign-in Changes'
    )
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto(
      '/southern-nevada-health-care/news-releases/vasnhs-helping-veterans-prepare-for-secure-sign-in-changes/'
    )

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
