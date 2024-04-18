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

This is the "fast" part of the testing suite. Our tools for these tasks currently include:

- **Typechecking**, static typechecking on all .tsx files using the typescript compiler.
- **ESLint**, an ECMAScript/JavaScript linter and static analysis tool.
- **Prettier**, a file formatter that ensures consistent code style.
- **Jest**, a Javascript testing framework with an accessible API

All four of these tools run as part of the pre-commit hooks on staged files (and/or their related tests, in Jest's case).

Typechecking happens at the beginning of the build process, but it can also be run manually at any time using `yarn test:types`. If there are incorrect types found (e.g. a function expects a string but is receiving a boolean), errors will be thrown.

See [Code Guidelines](/READMEs/code-guidelines.md) for more information around ESLint and Prettier.

### Jest Tests

Run `yarn test` to run the full Jest suite. To update snapshots, `yarn test -- -u`. We need the double dash in order to pass flags to the underlying command, instead of environment variables. See the [env-loader README](/READMEs/env-loader.md) for more information on how that works.

Run `yarn test:coverage` to run the full Jest suite and see the coverage report.

If running `yarn test:ci`, Jest will assume a CI environment and fail if snapshots are out of date.

To use Jest in interactive watch mode, run `yarn test:watch`. This will keep the Jest process running and it will re-run tests against the files you change. See the console output from this command for a full list of options and usage.

## Functional and Behavioral Tests

This is the "slow" part of the testing suite, Playwright. Where Jest tests the code itself,
Playwright tests that a user can do what they are expected to do in a browser, click buttons, etc.

These tests can be run manually, and they always run in CI. Because of this,
**Playwright expects the full site to be built and served**.
You can do this locally by first running `yarn export` and then `yarn export:serve`.
This will start a webserver with all the generated static pages that Playwright can reach.

Run `yarn test:playwright` to run all tests (including examples) against generated pages.

You can also run Playwright interactively with `yarn test:playwright:interactive` which will load
a browser with a clean UI to monitor and iterate on different test cases.

## Accessibility Testing

This project can be tested for a11y compliance in several ways:

- Individual Jest unit tests using jest-axe (see: `example_tests/06_accessibility_tests/index.test.jsx`).
- Individual Playwright tests using Playwright-axe. (see: `playwright/tests/newsStory.spec.js`).

  - Any individual test can call these commands to check a given page:

    ```js
      test('Should render without a11y accessibility errors', async ({
        page,
        makeAxeBuilder,
      }) => {
        await page.goto('/your-page-url')

        const accessibilityScanResults = await makeAxeBuilder().analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    ```

- A full site scan of all urls known to next-build (generated in the sitemap) using Playwright:

### Full Site Scan

The full scan will run daily in CI using a GitHub Workflow and multiple
runners, but you can also run it locally for testing and debugging purposes.

- Workflow file: `.github/workflows/a11y.yml`
- Test file: `playwright/tests/a11y.spec.ts`
- Yarn command with plenty of env var config options: `yarn
test:playwright:a11y`

#### GitHub Workflow

We designed the scan to run against the production va.gov/sitemap.xml to
ensure accessibility issues facing actual users are caught. Testing locally
and in lower environments is great, but to get the most bang for your buck,
running it on the actual output ensures that any fixes carry through to
production.

The workflow file `.github/workflows/a11y.yml` has all the contents of the
test run which currently uses 64 runners in a matrix. Each runner passes in
a `SEGMENT_INDEX` that the test uses to split the sitemap into multiple
pages based on the total number of runners used.

Several environmental variables control different parts of the test
configuration and can be found at the top-level of the `playwright-tests` job.

- `BASE_URL`: Where to go look for "/sitemap.xml"
- `USE_PROXY`: Whether to use the proxy in the custom fetcher. We don't want
  to use it for the a11y scan.
- `PW_BROWSER`: An array of Playwright browser types. These are randomly
  read per runner and used as `PW_BROWSER_VALUE` in test config.
- `PW_WIDTH`: An array of viewport widths to test against. These are randomly
  read per runner and used as `PW_WIDTH_VALUE` in test config.
- `PW_HEIGHT`: An array of viewport widths to test against. These are randomly
  read per runner and used as `PW_WIDTH_VALUE` in test config. The viewport
  height might not matter for a11y testing, I'm not sure.
- `TOTAL_SEGMENTS`: The number of total segments. This was in the matrix
  variables but pulled out since it is always one value and not a list of
  values.

You can alter those values to be picked up by each test run.

Random values are picked in the "Run command with random values from arrays"
step using some shell commands and `jq` foo. Then, those are used in the
test run as env vars with `_VALUE` as a suffix.

More detail about configuration and how the env vars are used is located in the
[Test Config](#test-config) section.

After the run the JSON output from the test run is uploaded into a file with
the segment name included, e.g. `segment-${{ matrix.shardIndex }}.json`.

To deal with an issue where pages were redirecting when Axe was trying to
scan them, we added a `try/catch` to log those to a separate
`failed-pages-segment-${{ matrix.shardIndex }}.json` report. Some pages were
still trouble so those are excluded from the scan entirely.

Then the `merge-reports` job waits for all the runners to finish before
concatenating the results of both reports and making sure the final JSON
output is valid.

In the future, the report will be uploaded and sent to who needs it, but for
now you can download it from GitHub on the Actions summary view for the a11y
test workflow.

#### Test Config

The `playwright.config.ts` file contains all the Playwright config used for
any test using Playwright in the next-build repo. We set up a different
Playwright Project named `a11y` to filter tests for accessibility as well as
provide different configuration. Let's go over the configuration differences:

- `retries` - The test performs no assertions and retrying would scan all
  the pages again. Plus, there was a weird error on GitHub where the URLs
  were being scanned multiple times. Might be worth revisiting in the future.
- `browserName`: Allows processing `PW_BROWSER_VALUE` to run different browser
  types.
- `trace`: No need to trace for code coverage.
- `screenshot`: Taking screenshots slowed down the tests and isn't necessary
  to report violations
- `video`: No need to take video
- `viewport`: Allows `PW_WIDTH_VALUE` and `PW_HEIGHT_VALUE`

It might be useful to look over the Playwright config and see if there are
more config options that would be helpful to use in testing.

#### The Full Scan "Test"

The actual test doesn't actually run any assertions. The reason for this is
that we are scanning many pages in one test. We could split it up so each
URL is run in an isolated test but that would require more setup and
teardown costing time. Also...just being honest...passing data to each test
via async/await was finicky, and I never went back to try and investigate
further.

Some pages end up redirecting

Test run workflow:

1. Get pages of the sitemap.
2. Split the pages into segments if the segment index is not zero. This
   allows to run against all pages locally or use segment indexes on GH.
3. Pages are looped through and navigated to as long as the page isn't in
   the list of excluded pages.
4. `AxeBuilder` analyzes each page.
5. If violations are found, they are pushed into an array with the URL and
   violations as keys.
6. If an error occurs, then catch it and log to a separate failed pages array.
7. After all pages are scanned, the final results are written to a JSON file
   for pages scanned and failures. The root element is stripped to make
   merging the reports easier as well as adding a trailing comma.

#### Local Testing

You don't have to build a site locally, but if you want to test against a
fresh next-build instance, you can follow these steps:

1. Run all the steps needed to set up next-build listed in the root README.md file.
2. `yarn export` to generate the static pages for the site
3. `yarn build:sitemap` to generate the sitemap for pages from step 1.
4. `yarn export:serve` to host the static pages locally
5. Take note of the port being used for the `BASE_URL` variable you will pass in.
6. `BASE_URL=${your-url} yarn test:playwright:a11y` to run the scan. This runs
   `playwright/tests/a11y.spec.ts` which loops over the sitemap and tests each page individually using `@axe-core/playwright`.

You should also add the config values you want locally to end up with
something like: `BASE_URL=${...} USE_PROXY=false PW_WIDTH_VALUE=768 PW_HEIGHT_VALUE=720 PW_BROWSER_VALUE=firefox yarn playwright test --project=a11y`
