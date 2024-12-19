import { formatEventCTA, createMailToLink } from './events'

describe('formatEventCTA', () => {
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
    it('should handle leading and trailing underscores correctly', () => {
      const input = '_leading_trailing_'
      const expected = ' leading trailing '
      const result = formatEventCTA(input)
      expect(result).toBe(expected)
    })
  })
})

describe('createMailToLink', () => {
  it('should create a mailto link without linkPath', () => {
    const emailCTA = 'example@example.com'
    const title = 'Some Event'
    const mostRecentDate = {
      startTime: new Date('2022-01-01T10:00:00Z').toISOString(),
      endTime: new Date('2022-01-01T12:00:00Z').toISOString(),
    }
    const linkPath = ''
    const result = createMailToLink(emailCTA, title, mostRecentDate, linkPath)
    const expectedBody = encodeURIComponent(
      `I would like to register for ${title} on `
    )

    expect(result).toContain(`mailto:${emailCTA}?subject=`)
    expect(result).toContain(expectedBody)
    expect(result).not.toContain('undefined')
  })
})
