import { isBot } from './isBot'

describe('isBot', () => {
  it('should return true for a known bot user agent', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true)
    expect(isBot('Mozilla/5.0 (content crawler spider)')).toBe(true)
    expect(isBot('Mozilla/5.0 IOI')).toBe(true)
  })

  it('should return false for a non-bot user agent', () => {
    expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe(false)
    expect(isBot('AppleWebKit/537.36 (KHTML, like Gecko)')).toBe(false)
  })
})
