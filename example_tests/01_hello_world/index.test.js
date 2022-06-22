import printGreeting from '.'

describe('printGreeting()', () => {
  describe('.toEqual()', () => {
    test('correctly injects the provided string', () => {
      // `.toEqual()` will compare two strings, but isn't very strict.
      expect(printGreeting('world')).toEqual('Hello, world!')
      // `expect.anything()` matches anything but `null` or `undefined`.
      expect(printGreeting('world')).toEqual(expect.anything())
    })
  })

  describe('.toBe()', () => {
    test('correctly injects the provided string', () => {
      // `.toBe()` can be used to check equality for strings.
      expect(printGreeting('world')).toBe('Hello, world!')
      // `.toBe()` won't accept `expect.anything()`.
      expect(printGreeting('world')).not.toBe(expect.anything())
    })
  })

  describe('.toStrictEqual()', () => {
    test('correctly injects the provided string', () => {
      // `.toStrictEqual()` tests that objects have the same types
      // as well as structures.
      expect(printGreeting('world')).toStrictEqual('Hello, world!')
      // `.toStrictEqual()` will still accept `expect.anything()`.
      expect(printGreeting('world')).toStrictEqual(expect.anything())
    })
  })
})
