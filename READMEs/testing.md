# Testing

This document outlines expectations for contributors to this project with regard to testing.

1. **All nontrivial pieces of code should have have unit tests.** (And if the code is trivial, perhaps it needs to be rethought.)

1. **Tests should be written in Jest and use the existing tooling wherever possible.** Please discuss any new dev dependencies with at least one other member of the team before adding them to the project.

1. **Tests should always cover the "Happy Path" or paths in their entirety.** A reasonable number of failure paths, appropriate to the likelihood and severity of errors, should be anticipated as well; silent failures cause very real issues with static site generation.

1. **PRs should aim for 100% coverage of lines, branches, and expressions.** PRs should lower test coverage metrics only in exceptional circumstances. Test coverage requirements are set to a couple percent below the current metrics; these should increase briskly over time.

1. **Unit tests should incorporate accessibility testing whenever appropriate.** Whenever a component is rendered, check it. If there is a rerender, check it again! The `axe` tool is made available in our internal `test-utils` module:

```javascript
import { axe, render, waitFor } from 'test-utils'

test('correctly renders SomeComponent', async () => {
  ....
  const { container } = render(<SomeComponent />)
  await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
  ....
})
```

## Pre-Commit Hooks

On local environments, every commit will run typechecks, linting and code formatting.
This happens using `husky` and `lint-staged`. See `lint-staged.config.js` for more details.

## Linting, Static Analysis, and Unit Tests

Our tools for these tasks currently include:

- **Typechecking**, static typechecking on all .tsx files using the typescript compiler.
- **ESLint**, an ECMAScript/JavaScript linter and static analysis tool.
- **Prettier**, a file formatter that ensures consistent code style.
- **Jest**, a Javascript testing framework with an accessible API

All four of these run as part of the pre-commit hooks on staged files (and/or their related tests, in Jest's case).

## Functional and Behavioral Tests

This is the "slow" part of the testing suite, Cypress. Where Jest tests the code itself,
Cypress tests that a user can do what they are expected to do in a browser, click buttons, etc.

These tests can be run manually, and they always run in CI. Because of this,
**Cypress expects the full site to be built and served**.
You can do this locally by first running `yarn export` and then `yarn export:serve`.
This will start a webserver with all the generated static pages that Cypress can reach.

Run `yarn test:cypress` to run all tests (including examples) against generated pages.

You can also run Cypress interactively with `yarn test:cypress:interactive` which will load
a browser with a clean UI to monitor and iterate on different test cases.

## Accessibility Testing

This project can be tested for a11y compliance in several ways:

- Individual Jest unit tests using jest-axe (see: `example_tests/06_accessibility_tests/index.test.jsx`).
- Individual Cypress tests using cypress-axe. (see: `cypress/e2e/news-story.cy.js`).
  - Any individual test can call `cy.checkA11y()` to run a check against the current page. This must be called after a call to `cy.visit()`!
- A full site scan of all urls known to next-build (generated in the sitemap) using Cypress

The full scan will run (TKTK: some cadence, weekly?) in CI.
You can run it manually after generating the sitemap with a few steps:

1. `yarn export` to generate the static pages for the site
2. `yarn postbuild` to generate the sitemap
3. `yarn test:cypress:a11y` to run the scan. This runs `cypress/e2e/a11y.cy.js` which loops over the sitemap and tests each page individually using `cypress-axe`.
