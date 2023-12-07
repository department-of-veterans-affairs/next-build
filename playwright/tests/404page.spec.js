const { test, expect } = require('../utils/next-test')

test.describe('404 Error Page', () => {
  test.beforeEach(async ({ context }) => {
    // Block requests for gtm, localhost services
    await context.route(/gtm.js*/, (route) => route.abort())
    await context.route(/:3000*/, (route) => route.abort())
    await context.route(/:3001*/, (route) => route.abort())
  })

  test('Displays the 404 Error page content', async ({ page }) => {
    await page.goto('/404')

    await expect(page.locator('h3 >> nth=0')).toContainText(
      'Sorry — we can’t find that page'
    )
    await expect(
      page.locator(
        'p:has-text("Try the search box or one of the common questions below.")'
      )
    ).toBeVisible()

    await expect(page.locator('form#search_form')).toBeVisible()

    await expect(page.locator('.va-quicklinks--commpop')).toBeVisible()
  })

  test('Should render without a11y accessibility errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/404')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
