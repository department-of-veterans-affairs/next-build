import { capitalizeWords } from './capitalizeWords'

describe('capitalizeWords', () => {
  it('capitalizes the first letter of each word in a string', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World')
    expect(capitalizeWords('va health and benefits')).toBe(
      'Va Health And Benefits'
    )
  })

  it('handles empty strings', () => {
    expect(capitalizeWords('')).toBe('')
  })

  it('handles strings with extra spaces', () => {
    expect(capitalizeWords('  hello   world  ')).toBe('  Hello   World  ')
  })
})
