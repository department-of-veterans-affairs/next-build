const { test, expect } = require('../utils/next-test')

test.describe('News Story', () => {
  test('News Story page renders with navigation back to parent story list', async ({
    page,
  }) => {
    await page.goto('/butler-health-care/stories/its-flu-shot-time/')
    await page.click('#news-stories-listing-link')
    await expect(page).toHaveURL('/butler-health-care/stories/')
  })

  test('Should render without a11y errors', async ({ page, makeAxeBuilder }) => {
    await page.goto('/butler-health-care/stories/its-flu-shot-time/')

    const accessibilityScanResults = await makeAxeBuilder()
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  })
})
