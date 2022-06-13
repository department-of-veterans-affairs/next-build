import { faker } from 'test-utils'
import { responseSymbol } from 'next/dist/server/web/spec-compliant/fetch-event'

const resolvingPromiseCreator = (value) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, 10)
  })
}

const rejectingPromiseCreator = (error) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(error)
    })
  })
}

describe('expect.anything() and expect.any(constructor)', () => {
  test('expect.anything() will match anything', () => {
    expect(faker.datatype.number()).toEqual(expect.anything())
    expect(faker.datatype.string()).toEqual(expect.anything())
    expect(faker.datatype.array()).toEqual(expect.anything())
    expect(faker.datatype.bigInt()).toEqual(expect.anything())
    expect(faker.datatype.boolean()).toEqual(expect.anything())
    expect(faker.datatype.datetime()).toEqual(expect.anything())
    expect(faker.datatype.float()).toEqual(expect.anything())
    /*
    This is probably most useful in testing whether an object follows a general
    schema.
    */
    expect({
      key1: faker.datatype.number(),
      key2: faker.datatype.array(),
      key3: faker.datatype.datetime(),
      key4: faker.datatype.float(),
    }).toEqual({
      key1: expect.anything(),
      key2: expect.anything(),
      key3: expect.anything(),
      key4: expect.anything(),
    })
  })
  test('expect.any() will match anything created with that constructor', () => {
    expect(faker.datatype.number()).toEqual(expect.any(Number))
    expect(faker.datatype.string()).toEqual(expect.any(String))
    expect(faker.datatype.array()).toEqual(expect.any(Array))
    expect(faker.datatype.bigInt()).toEqual(expect.any(BigInt))
    expect(faker.datatype.boolean()).toEqual(expect.any(Boolean))
    expect(faker.datatype.datetime()).toEqual(expect.any(Date))
    /*
    This is probably most useful in testing whether an object follows a general 
    schema.
    */
    expect({
      key1: faker.datatype.number(),
      key2: faker.datatype.array(),
      key3: faker.datatype.datetime(),
      key4: faker.datatype.float(),
    }).toEqual({
      key1: expect.any(Number),
      key2: expect.any(Array),
      key3: expect.any(Date),
      key4: expect.any(Number),
    })
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
    // This can be used to test properties of an object.
    const received2 = faker.datatype.array(5)
    expect({
      key1: received,
      key2: received2,
    }).toEqual({
      key1: expect.arrayContaining(received),
      key2: expect.arrayContaining(received2),
    })
  })
  test('expect.not.arrayContaining() will match a received array containing the expected array', () => {
    const received = faker.datatype.array(10)
    expect(received).toEqual(
      expect.not.arrayContaining([...received, 'unexpectedvalue'])
    )
  })
})

describe('expect.objectContaining(object)', () => {
  test('expect.objectContaining() will match a received object matching its expected properties', () => {
    const received = {
      key1: faker.datatype.array(10),
      key2: faker.datatype.string(),
      key3: faker.datatype.datetime(),
      key4: {
        key4a: faker.datatype.number(),
        key4b: faker.datatype.string(),
      },
    }
    expect(received).toEqual(
      expect.objectContaining({
        key4: expect.any(Object),
      })
    )
    expect(received).toEqual(
      expect.objectContaining({
        key4: expect.objectContaining({
          key4a: expect.any(Number),
        }),
      })
    )
    expect(received).toEqual(
      expect.objectContaining({
        key3: expect.any(Date),
      })
    )
  })
})

describe('expect.stringContaining(string) and expect.stringMatching(string | regexp)', () => {
  test('expect.stringContaining() will match a received string containing the expected string', () => {
    const received = faker.datatype.string(20)
    expect(received).toEqual(expect.stringContaining(received))
    expect(received).toEqual(expect.stringContaining(received.substring(1, 8)))
    expect(received).toEqual(
      expect.not.stringContaining(
        received.substring(1, 15).split('').reverse().join('')
      )
    )
  })
  test('expect.stringMatching() will match a received string matching the expected string or expression', () => {
    const received = faker.lorem.word()
    expect(received).toEqual(expect.stringMatching(received))
    expect(received).toEqual(expect.stringMatching(/^[a-z]*$/))
  })
})

describe('expect.assertions(number) and expect.hasAssertions()', () => {
  /*
  Mostly useful for verifying that a heavily asynchronous test is executing 
  everything as expected.
  */
  describe('expect.assertions() verifies that a certain number of assertions are called during a test', () => {
    test('a test with no assertions', () => {
      expect.assertions(0)
    })
    test('a test with one assertion', async () => {
      expect.assertions(1)
      await resolvingPromiseCreator(faker.datatype.number()).then((data) => {
        expect(data).toEqual(expect.anything())
      })
    })
    test('a test with two assertions', async () => {
      expect.assertions(2)
      await resolvingPromiseCreator(faker.datatype.number())
        .then((data) => {
          expect(data).toEqual(expect.anything())
          return faker.datatype.string()
        })
        .then((data) => {
          expect(data).toEqual(expect.anything())
        })
    })
  })
  describe('expect.hasAssertions() verifies that at least one assertion is called during a test', () => {
    test('a test with one assertion', async () => {
      expect.hasAssertions()
      await resolvingPromiseCreator(faker.datatype.number()).then((data) => {
        expect(data).toEqual(expect.anything())
      })
    })
  })
})

describe('expect.closeTo(number, numDigitsPrecision?)', () => {
  test('expect.closeTo() is useful when comparing floating point numbers', () => {
    expect({
      key1: 0.1 + 0.5,
    }).toEqual({
      key1: expect.closeTo(0.6, 5),
    })
    expect({
      key1: 22 / 7,
    }).toEqual({
      key1: expect.closeTo(3.1415, 2),
    })
  })
})
