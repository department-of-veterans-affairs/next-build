import printGreeting from '.'

describe('printGreeting()', () => {
  test('correctly injects the provided string', async () => {
    expect(printGreeting('world')).toStrictEqual('Hello, world!')
  })
})
