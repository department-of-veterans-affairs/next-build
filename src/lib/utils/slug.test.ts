import { slugToPath, pathToSlug, slugifyTitle } from './slug'

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

describe('slugifyTitle', () => {
  test('should return null when empty title', () => {
    const title = ''
    const result = slugifyTitle(title)
    expect(result).toBe(null)
  })

  test('should remove special characters', () => {
    const title = 'A title with "special" characters!'
    const result = slugifyTitle(title)
    expect(result).toBe('a-title-with-special-characters')
  })

  test('should truncate to desired length', () => {
    const title = 'This is a longer title that we want to truncate'
    const truncateLength = 22
    const result = slugifyTitle(title, truncateLength)
    expect(result).toBe('this-is-a-longer-title')
  })

  test('should not truncate if slugified title is shorter than truncateLength', () => {
    const title = 'This is a title'
    const truncateLength = 50
    const result = slugifyTitle(title, truncateLength)
    expect(result).toBe('this-is-a-title')
  })
})
