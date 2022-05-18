import { faker } from 'test-utils'
import { toCamelCase, camelKeys } from './camelKeys'

test('toCamelCase() works with common test cases', () => {
  expect(toCamelCase('a')).toStrictEqual('a')
  expect(toCamelCase('a_b')).toStrictEqual('aB')
  expect(toCamelCase('a b')).toStrictEqual('aB')
  expect(toCamelCase('a-b')).toStrictEqual('aB')
  expect(toCamelCase('a-b c')).toStrictEqual('aBC')
  expect(toCamelCase('a_b c')).toStrictEqual('aBC')
  expect(toCamelCase('a b-c')).toStrictEqual('aBC')
  expect(toCamelCase('Ive been waiting for so long')).toStrictEqual(
    'iveBeenWaitingForSoLong'
  )
  expect(toCamelCase('For someone to mend_- all the blame')).toStrictEqual(
    'forSomeoneToMendAllTheBlame'
  )
  expect(toCamelCase('It-was_raining Down fingers')).toStrictEqual(
    'itWasRainingDownFingers'
  )
  expect(toCamelCase('The inbreeds    remain')).toStrictEqual(
    'theInbreedsRemain'
  )
})

test('camelKeys() called with a string returns the string', () => {
  const str = faker.lorem.sentence()
  expect(camelKeys(str)).toStrictEqual(str)
})

test('camelKeys() called with a function returns the function', () => {
  const func = () => {}
  expect(camelKeys(func)).toStrictEqual(func)
})

test('camelKeys() called with an array of strings returns the array', () => {
  const arr = Array(5)
    .fill()
    .map(() => faker.lorem.sentence())
  expect(camelKeys(arr)).toStrictEqual(arr)
})

test('camelKeys() called with an object returns the object with camel-cased keys', () => {
  const obj = {
    a: faker.lorem.sentence(),
    b: faker.lorem.sentence(),
    c_e: faker.lorem.sentence(),
    'f  g': faker.lorem.sentence(),
    'h  - __   i': faker.lorem.sentence(),
  }
  expect(camelKeys(obj)).toStrictEqual({
    a: obj.a,
    b: obj.b,
    cE: obj.c_e,
    fG: obj['f  g'],
    hI: obj['h  - __   i'],
  })
})

test('camelKeys() called with an array of mixed objects and strings should return an appropriate array', () => {
  const arr = [
    [[['a']]],
    'a',
    'boat ride',
    {},
    {
      'a b': faker.lorem.sentence(),
      'c _- d': faker.lorem.sentence(),
    },
  ]
  expect(camelKeys(arr)).toStrictEqual([
    [[['a']]],
    'a',
    'boat ride',
    {},
    {
      aB: arr[arr.length - 1]['a b'],
      cD: arr[arr.length - 1]['c _- d'],
    },
  ])
})

test('camelKeys() called with a complex object should return an appropriate object', () => {
  const obj = {
    a: [],
    'b c': [[['a']]],
    'd _- e': {
      'h I': [
        {
          'f G': 3,
        },
      ],
    },
  }
  expect(camelKeys(obj)).toStrictEqual({
    a: [],
    bC: [[['a']]],
    dE: {
      hI: [
        {
          fG: 3,
        },
      ],
    },
  })
})
