import printGreeting from '.'

describe('printGreeting()', () => {
  describe('using incorrect patterns', () => {
    // This test will not work as expected because printGreeting() returns a
    // promise.
    test.failing('will not resolve until after the test has concluded', () => {
      // eslint-disable-next-line jest/no-standalone-expect
      expect(printGreeting('world')).toStrictEqual('Hello, world!')
    })
  })

  describe("using Jest's automatic promise resolution", () => {
    test('correctly injects the provided string', () => {
      // If we don't convert this to an async function, we should `return` to
      // ensure the promise is resolved.
      return printGreeting('world').then((data) => {
        expect(data).toStrictEqual('Hello, world!')
      })
    })
  })

  describe('using async/await', () => {
    test('correctly injects the provided string (Jest internally resolving promise)', async () => {
      // This is probably the easiest pattern to reason about.
      const response = await printGreeting('world')
      expect(response).toStrictEqual('Hello, world!')
    })
  })
})
