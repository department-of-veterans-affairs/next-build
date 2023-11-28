const { test, expect } = require('@playwright/test')
const { injectAxe, checkA11y } = require('@axe-core/playwright')

test.describe('News Story', () => {
  test('News Story page renders with navigation back to parent story list', async ({
    page,
  }) => {
    await page.goto('/butler-health-care/stories/its-flu-shot-time/')
    await page.click('#news-stories-listing-link')
    await expect(page).toHaveURL('/butler-health-care/stories/')
  })

  test.skip('Should render without a11y errors', async ({ page }) => {
    await page.goto('/butler-health-care/stories/its-flu-shot-time/')
    await injectAxe(page)
    await checkA11y(page)
  })
})
