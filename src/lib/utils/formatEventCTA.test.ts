import { formatEventCTA } from './formatEventCTA'

describe('formatEventCTA', () => {
  it('should format "register_now" as "Register now"', () => {
    const input = 'register_now'
    const expected = 'Register now'
    const result = formatEventCTA(input)
    expect(result).toBe(expected)
  })

  it('should format "join_the_event" as "Join the event"', () => {
    const input = 'join_the_event'
    const expected = 'Join the event'
    const result = formatEventCTA(input)
    expect(result).toBe(expected)
  })

  it('should handle single-word input "register" as "Register"', () => {
    const input = 'register'
    const expected = 'Register'
    const result = formatEventCTA(input)
    expect(result).toBe(expected)
  })

  it('should handle input with multiple underscores "this_is_an_example" as "This is an example"', () => {
    const input = 'this_is_an_example'
    const expected = 'This is an example'
    const result = formatEventCTA(input)
    expect(result).toBe(expected)
  })
})
