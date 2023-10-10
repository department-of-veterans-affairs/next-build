import { slugToPath } from './slug'

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
