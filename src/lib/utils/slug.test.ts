import { slugToPath, pathToSlug } from './slug'

describe('slugToPath', () => {
  test('should properly handle string with leading slash', () => {
    const slug = '/some/path'
    const result = slugToPath(slug)
    expect(result).toBe(slug)
  })

  test('should properly handle string without leading slash', () => {
    const slug = 'some/path'
    const result = slugToPath(slug)
    expect(result).toBe(`/${slug}`)
  })

  test('shold properly handle array', () => {
    const slug = ['some', 'path']
    const result = slugToPath(slug)
    expect(result).toBe(`/${slug[0]}/${slug[1]}`)
  })
})

describe('pathToSlug', () => {
  test('should properly handle string with leading slash', () => {
    const path = '/some/path'
    const result = pathToSlug(path)
    expect(result).toStrictEqual(['some', 'path'])
  })

  test('should properly handle string with trailing slash', () => {
    const path = 'some/path/'
    const result = pathToSlug(path)
    expect(result).toStrictEqual(['some', 'path'])
  })

  test('should properly handle string with leading and trailing slashes', () => {
    const path = '/some/path/'
    const result = pathToSlug(path)
    expect(result).toStrictEqual(['some', 'path'])
  })

  test('should properly handle string without leading or trailing slash', () => {
    const path = 'some/path'
    const result = pathToSlug(path)
    expect(result).toStrictEqual(['some', 'path'])
  })
})
