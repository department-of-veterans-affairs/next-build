import { generateAbsoluteUrl, generateAbsoluteUrlFromEnv } from './environment'

describe('generateAbsoluteUrlFromEnv', () => {
  const originalEnvironmentVariables = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnvironmentVariables }
  })

  afterAll(() => {
    process.env = originalEnvironmentVariables
  })

  test('should use SITE_URL environment variable when provided', () => {
    process.env.SITE_URL = 'https://www.example.com'
    const relativeUrl = 'path/to/resource'
    const result = generateAbsoluteUrlFromEnv(relativeUrl)
    expect(result).toBe('https://www.example.com/path/to/resource')
  })

  test('should handle missing SITE_URL environment variable', () => {
    process.env.SITE_URL = ''
    process.env.NEXT_PUBLIC_SITE_URL = ''
    const relativeUrl = 'path/to/resource'
    const result = generateAbsoluteUrlFromEnv(relativeUrl)
    expect(result).toBe('/path/to/resource')
  })
})

describe('generateAbsoluteUrl', () => {
  const origin = 'https://www.va.gov'
  const relativeUrl = 'some/path'
  const expectedResult = `${origin}/${relativeUrl}`

  test('should properly handle origin with trailing slash and url with leading slash', () => {
    const result = generateAbsoluteUrl(`${origin}/`, `/${relativeUrl}`)
    expect(result).toBe(expectedResult)
  })

  test('should properly handle origin with trailing slash and url without leading slash', () => {
    const result = generateAbsoluteUrl(`${origin}/`, relativeUrl)
    expect(result).toBe(expectedResult)
  })

  test('should properly handle origin without trailing slash and url with leading slash', () => {
    const result = generateAbsoluteUrl(origin, `/${relativeUrl}`)
    expect(result).toBe(expectedResult)
  })

  test('should properly handle origin without trailing slash and url without leading slash', () => {
    const result = generateAbsoluteUrl(origin, relativeUrl)
    expect(result).toBe(expectedResult)
  })

  test('should return relative url with leading slash when origin is blank', () => {
    const result = generateAbsoluteUrl('', relativeUrl)
    expect(result).toBe(`/${relativeUrl}`)
  })
})
