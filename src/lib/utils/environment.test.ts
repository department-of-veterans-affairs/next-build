import { generateAbsoluteUrl } from './environment'

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
