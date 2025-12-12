import { createUrlLinks } from './createUrlLinks'

describe('createUrlLinks', () => {
  it('wraps simple https URLs', () => {
    const input = 'Visit https://www.va.gov for more information.'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <a href="https://www.va.gov">https://www.va.gov</a> for more information.'
    )
  })

  it('wraps simple http URLs', () => {
    const input = 'Check http://example.com for details'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Check <a href="http://example.com">http://example.com</a> for details'
    )
  })

  it('wraps URLs with paths', () => {
    const input = 'Visit https://department.va.gov/contingency-planning/'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <a href="https://department.va.gov/contingency-planning/">https://department.va.gov/contingency-planning/</a>'
    )
  })

  it('wraps URLs with query parameters', () => {
    const input = 'Go to https://va.gov/search?query=benefits&page=1'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Go to <a href="https://va.gov/search?query=benefits&page=1">https://va.gov/search?query=benefits&page=1</a>'
    )
  })

  it('wraps URLs with fragments', () => {
    const input = 'See https://va.gov/health#section-2'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'See <a href="https://va.gov/health#section-2">https://va.gov/health#section-2</a>'
    )
  })

  it('handles trailing period after URL', () => {
    const input = 'Visit https://www.va.gov.'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <a href="https://www.va.gov">https://www.va.gov</a>.'
    )
  })

  it('handles trailing comma after URL', () => {
    const input = 'Check https://www.va.gov, then call.'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Check <a href="https://www.va.gov">https://www.va.gov</a>, then call.'
    )
  })

  it('does not wrap URLs already inside href attributes', () => {
    const input = '<a href="https://www.va.gov">Visit our website</a>'
    const output = createUrlLinks(input)
    expect(output).toBe(input)
  })

  it('does not wrap URLs already inside anchor tags', () => {
    const input = '<a href="https://www.va.gov">https://www.va.gov</a>'
    const output = createUrlLinks(input)
    expect(output).toBe(input)
  })

  it('wraps multiple URLs in same content', () => {
    const input =
      'Visit https://www.va.gov or https://benefits.va.gov for help.'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <a href="https://www.va.gov">https://www.va.gov</a> or <a href="https://benefits.va.gov">https://benefits.va.gov</a> for help.'
    )
  })

  it('handles URLs with subdomains', () => {
    const input = 'Check https://department.va.gov for updates'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Check <a href="https://department.va.gov">https://department.va.gov</a> for updates'
    )
  })

  it('returns original content if no URL found', () => {
    const input = 'There is no URL here.'
    const output = createUrlLinks(input)
    expect(output).toBe(input)
  })

  it('handles null input', () => {
    expect(createUrlLinks(null as unknown as string)).toBe(null)
  })

  it('handles empty string', () => {
    expect(createUrlLinks('')).toBe('')
  })

  it('handles undefined input', () => {
    expect(createUrlLinks(undefined as unknown as string)).toBe(undefined)
  })

  it('handles complex real-world example', () => {
    const input =
      'For more information, please visit https://department.va.gov/contingency-planning/'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'For more information, please visit <a href="https://department.va.gov/contingency-planning/">https://department.va.gov/contingency-planning/</a>'
    )
  })

  it('preserves URLs in existing anchor tags with different display text', () => {
    const input =
      '<a href="https://va.gov">Click here</a> or visit https://benefits.va.gov'
    const output = createUrlLinks(input)
    expect(output).toBe(
      '<a href="https://va.gov">Click here</a> or visit <a href="https://benefits.va.gov">https://benefits.va.gov</a>'
    )
  })

  it('handles URL at the end of a sentence with multiple punctuation', () => {
    const input = 'Visit https://www.va.gov!!'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <a href="https://www.va.gov">https://www.va.gov</a>!!'
    )
  })
})
