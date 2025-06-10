import { test, expect } from '../utils/next-test'

test.describe('LocationsListing page', () => {
  test('renders the LocationsListing page', async ({ page }) => {
    await page.goto('/boston-health-care/locations/')
    await expect(page).toHaveURL('/boston-health-care/locations/')
    await expect(
      page.getByRole('heading', { name: /locations/i, level: 1 })
    ).toBeVisible()
  })

  test('has no a11y violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/boston-health-care/locations/')

    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
  })
})
