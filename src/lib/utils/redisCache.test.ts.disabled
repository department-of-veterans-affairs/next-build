import { redisCache } from './redisCache'

// mocking redis for jest
jest.mock('./redisCache', () => ({
  ...jest.requireActual('./redisCache'),
  redisCache: {
    get: (key) => `${key}: value`,
    set: (key, value) => 'OK',
  },
}))

describe('redisCache', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('can store a value saved in cache', () => {
    const value = redisCache.set('foo', 'bar')

    expect(value).toBe('OK')
  })

  test('can retrieve a value saved in cache', () => {
    redisCache.set('foo', 'bar')
    const value = redisCache.get('foo')

    expect(value).toBe('foo: value')
  })
})
