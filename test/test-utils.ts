/**
 * General testing utilities.
 *
 * Extensions to expect(), etc should go in ../jest.setup.js.
 */
import originalUserEvent from '@testing-library/user-event'
const userEvent = originalUserEvent.setup()
export { userEvent }
export * from '@testing-library/react'
export { faker } from '@faker-js/faker'
import { configureAxe } from 'jest-axe'
import 'range-getclientrects-polyfill'
import 'window-computedstyle-polyfill'
import 'window-matchmedia-polyfill'
import nock, { back as nockBack } from 'nock'
export { nock, nockBack }

export const axe = configureAxe({
  runOnly: {
    type: 'tag',
    values: ['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
  rules: {
    'color-contrast': { enabled: false },
  },
})
