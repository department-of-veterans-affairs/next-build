import { test as base } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder
}

// Extend base test by providing "makeAxeBuilder"
//
// This can be reused in other test files to provide a
// consistently configured AxeBuilder instance.
// See https://playwright.dev/docs/accessibility-testing#creating-a-fixture
export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use, testInfo) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page }).withTags([
        'section508',
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
      ])
    // .exclude('#commonly-reused-element-with-known-issue');

    await use(makeAxeBuilder)
  },
})

// exported here to reduce import overhead in other test runs
export { expect } from '@playwright/test'
