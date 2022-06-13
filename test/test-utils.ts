/**
 * General testing utilities.
 *
 * Extensions to expect(), etc should go in ../jest.setup.js.
 */
import originalUserEvent from '@testing-library/user-event'
const userEvent = originalUserEvent.setup()
export { userEvent }
export * from '@testing-library/jest-dom'
export * from '@testing-library/react'
export { faker } from '@faker-js/faker'
export { axe } from 'jest-axe'
import 'range-getclientrects-polyfill'
import 'window-computedstyle-polyfill'
import 'window-matchmedia-polyfill'
