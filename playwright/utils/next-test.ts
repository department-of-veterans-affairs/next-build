import { test as base } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type NextFixtures = {
  makeAxeBuilder: () => AxeBuilder
  testHook: void
}

// Extend base test with re-usable fixtures
//
// makeAxeBuilder provides a consistently configured AxeBuilder instance.
// See https://playwright.dev/docs/accessibility-testing#creating-a-fixture
//
// testHook provides a global beforeEach & afterEach hook for individual tests.
// See https://playwright.dev/docs/test-fixtures#automatic-fixtures
export const test = base.extend<NextFixtures>({
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

  testHook: [
    async ({ context }, use, testInfo) => {
      // Any code here will be run as a before each hook
      await context.route(/gtm.js*/, (route) => route.abort())
      // Do not make requests to the localhost server.
      await context.route(`/:${process.env.PORT}*/`, (route) => route.abort())
      // Do not make requests to a running vets-website server.
      await context.route(/:3001*/, (route) => route.abort())

      // This is the individual test run
      await use()

      // Put any code you want run automatically after each test here
    },
    { auto: true },
  ],
})

// exported here to reduce import overhead in other test runs
export { expect } from '@playwright/test'
