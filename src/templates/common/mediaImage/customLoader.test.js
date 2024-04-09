import customLoader from './customLoader'

describe('customLoader', () => {
  it('should return the src parameter it receives', () => {
    const src = '/test/path.jpg'
    const result = customLoader({ src })
    expect(result).toBe(src)
  })
})
