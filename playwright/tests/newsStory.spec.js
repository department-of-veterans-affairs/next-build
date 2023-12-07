const { test, expect } = require('../utils/next-test')

test.describe('News Story', () => {
  test.beforeEach(async ({ context }) => {
    // Block requests for gtm, localhost services
    await context.route(/gtm.js*/, (route) => route.abort())
    await context.route(/:3000*/, (route) => route.abort())
    await context.route(/:3001*/, (route) => route.abort())
  })

  test('News Story page renders with navigation back to parent story list', async ({
    page,
  }) => {
    await page.goto('/butler-health-care/stories/its-flu-shot-time/')
    await page.click('#news-stories-listing-link')
    await expect(page).toHaveURL('/butler-health-care/stories/')
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/butler-health-care/stories/its-flu-shot-time/')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
