/**
 * @jest-environment node
 *
 * Tests the server/SSR path where window is undefined.
 * Must run in Node environment (not jsdom) so that typeof window === 'undefined'.
 */
import { openFeedbackForm } from './medallia'

describe('openFeedbackForm (server environment)', () => {
  it('runs without throwing when window is undefined (SSR)', () => {
    expect(() => openFeedbackForm()).not.toThrow()
  })
})
