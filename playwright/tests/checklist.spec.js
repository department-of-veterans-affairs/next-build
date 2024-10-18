import { test, expect } from '../utils/next-test'

test.describe('Checklist', () => {
  test('Checklist page renders', async ({
    page,
  }) => {
    await page.goto('/resources/what-to-bring-to-create-your-online-sign-in-account')
    await expect(page).toHaveURL('/resources/what-to-bring-to-create-your-online-sign-in-account')
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/resources/what-to-bring-to-create-your-online-sign-in-account')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
