import { test, expect } from '../utils/next-test'

test.describe('leadershipListing', () => {
  test('leadershipListing page renders', async ({
    page,
  }) => {
    await page.goto('/houston-health-care/about-us/leadership/')
    await expect(page).toHaveURL('/houston-health-care/about-us/leadership/')
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/houston-health-care/about-us/leadership/')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
