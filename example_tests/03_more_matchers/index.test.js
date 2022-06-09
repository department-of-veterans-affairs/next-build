import faker from '@faker-js/faker'

describe('More matchers!', () => {
  describe('expect.anything()', () => {
    test('expect.anything() will match anything', () => {
      expect(faker.datatype.number()).toEqual(expect.anything())
      expect(faker.datatype.string()).toEqual(expect.anything())
      expect(faker.datatype.array()).toEqual(expect.anything())
      expect(faker.datatype.bigInt()).toEqual(expect.anything())
      expect(faker.datatype.boolean()).toEqual(expect.anything())
      expect(faker.datatype.datetime()).toEqual(expect.anything())
      expect(faker.datatype.float()).toEqual(expect.anything())
    })
  })
  describe('expect.any(constructor)', () => {
    test('expect.any() will match anything created with that constructor', () => {
      expect(faker.datatype.number()).toEqual(expect.any(Number))
      expect(faker.datatype.string()).toEqual(expect.any(String))
      expect(faker.datatype.array()).toEqual(expect.any(Array))
      expect(faker.datatype.bigInt()).toEqual(expect.any(BigInt))
      expect(faker.datatype.boolean()).toEqual(expect.any(Boolean))
      expect(faker.datatype.datetime()).toEqual(expect.any(Date))
    })
  })
  describe('expect.arrayContaining(array)', () => {
    test('expect.arrayContaining() will match a received array containing the expected array', () => {
      const received = faker.datatype.array(10)
      expect(received).toEqual(expect.arrayContaining(received))
      expect(received).toEqual(expect.arrayContaining([...received].reverse()))
      expect(received).toEqual(
        expect.arrayContaining([...received].slice(0, received.length / 2))
      )
      expect(received).toEqual(
        expect.arrayContaining(
          [...received].slice(2, received.length / 2).reverse()
        )
      )
      expect(received).toEqual(
        expect.not.arrayContaining([...received, 'unexpectedvalue'])
      )
    })
  })
  describe('expect.assertions(number)', () => {
    describe('expect.assertions() verifies that a certain number of assertions are called during a test', () => {
      test('a test with no assertions', () => {
        expect.assertions(0)
      })
      test('a test with one assertion', () => {
        expect.assertions(1)
        expect(faker.datatype.number()).toEqual(expect.anything())
      })
      test('a test with two assertions', () => {
        expect.assertions(2)
        expect(faker.datatype.number()).toEqual(expect.anything())
        expect(faker.datatype.string()).toEqual(expect.anything())
      })
    })
  })
})
