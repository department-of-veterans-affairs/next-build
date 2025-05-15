import { test, expect } from '@/playwright/utils/next-test'

test.describe('Event Page', () => {
  test('Event page renders with correct title and details', async ({
    page,
  }) => {
    await page.goto('/central-iowa-health-care/events/63096/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })
    await expect(page.locator('h1')).toHaveText(
      'Battlefield Acupuncture Walk-in Clinic'
    ) // Replace with actual event title
  })

  test('Should render without a11y errors', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/central-iowa-health-care/events/63096/')

    const accessibilityScanResults = await makeAxeBuilder().analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
