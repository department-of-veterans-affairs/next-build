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
  })
  describe('createMailToLink', () => {
    it('should create a correct mailto link with all parameters', () => {
      const emailCTA = 'example@example.com'
      const title = 'Event Title'
      const mostRecentDate = {
        startTime: new Date('2023-09-07T14:00:00Z'),
        endTime: new Date('2023-09-07T16:00:00Z'),
      }

      const linkPath = '/event-path'

      const result = createMailToLink(emailCTA, title, mostRecentDate, linkPath)

      expect(result).toBe(
        'mailto:example@example.com?subject=RSVP%20for%20Event%20Title%20on%20Thu%2C%20Sep%207%2C%202023%2C%2010%3A00%20AM%20EDT%20%E2%80%93%2012%3A00%20PM%20EDT&body=I%20would%20like%20to%20register%20for%20Event%20Title%20on%20Thu%2C%20Sep%207%2C%202023%2C%2010%3A00%20AM%20EDT%20%E2%80%93%2012%3A00%20PM%20EDT.%20(https%3A%2F%2Fva.gov%2Fevent-path)'
      )
    })
  })
})
