import { createUrlLinks } from './createUrlLinks'

describe('createUrlLinks', () => {
  it('wraps simple https URLs', () => {
    const input = 'Visit https://www.va.gov for more information.'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <va-link href="https://www.va.gov" text="https://www.va.gov"></va-link> for more information.'
    )
  })

  it('wraps simple http URLs', () => {
    const input = 'Check http://example.com for details'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Check <va-link href="http://example.com" text="http://example.com"></va-link> for details'
    )
  })

  it('wraps URLs with paths', () => {
    const input = 'Visit https://department.va.gov/contingency-planning/'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <va-link href="https://department.va.gov/contingency-planning/" text="https://department.va.gov/contingency-planning/"></va-link>'
    )
  })

  it('wraps URLs with query parameters', () => {
    const input = 'Go to https://va.gov/search?query=benefits&page=1'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Go to <va-link href="https://va.gov/search?query=benefits&page=1" text="https://va.gov/search?query=benefits&page=1"></va-link>'
    )
  })

  it('wraps URLs with fragments', () => {
    const input = 'See https://va.gov/health#section-2'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'See <va-link href="https://va.gov/health#section-2" text="https://va.gov/health#section-2"></va-link>'
    )
  })

  it('handles trailing period after URL', () => {
    const input = 'Visit https://www.va.gov.'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <va-link href="https://www.va.gov" text="https://www.va.gov"></va-link>.'
    )
  })

  it('handles trailing comma after URL', () => {
    const input = 'Check https://www.va.gov, then call.'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Check <va-link href="https://www.va.gov" text="https://www.va.gov"></va-link>, then call.'
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
      'Visit <va-link href="https://www.va.gov" text="https://www.va.gov"></va-link> or <va-link href="https://benefits.va.gov" text="https://benefits.va.gov"></va-link> for help.'
    )
  })

  it('handles URLs with subdomains', () => {
    const input = 'Check https://department.va.gov for updates'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Check <va-link href="https://department.va.gov" text="https://department.va.gov"></va-link> for updates'
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
      'For more information, please visit <va-link href="https://department.va.gov/contingency-planning/" text="https://department.va.gov/contingency-planning/"></va-link>'
    )
  })

  it('preserves URLs in existing anchor tags with different display text', () => {
    const input =
      '<a href="https://va.gov">Click here</a> or visit https://benefits.va.gov'
    const output = createUrlLinks(input)
    expect(output).toBe(
      '<a href="https://va.gov">Click here</a> or visit <va-link href="https://benefits.va.gov" text="https://benefits.va.gov"></va-link>'
    )
  })

  it('handles URL at the end of a sentence with multiple punctuation', () => {
    const input = 'Visit https://www.va.gov!!'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Visit <va-link href="https://www.va.gov" text="https://www.va.gov"></va-link>!!'
    )
  })

  it('preserves balanced parentheses in URLs (Wikipedia style)', () => {
    const input =
      'See https://en.wikipedia.org/wiki/VA_(disambiguation) for info.'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'See <va-link href="https://en.wikipedia.org/wiki/VA_(disambiguation)" text="https://en.wikipedia.org/wiki/VA_(disambiguation)"></va-link> for info.'
    )
  })

  it('strips unbalanced trailing closing paren', () => {
    const input = '(Visit https://www.va.gov)'
    const output = createUrlLinks(input)
    expect(output).toBe(
      '(Visit <va-link href="https://www.va.gov" text="https://www.va.gov"></va-link>)'
    )
  })

  it('strips multiple unbalanced trailing closing parens', () => {
    const input = '((See https://www.va.gov))'
    const output = createUrlLinks(input)
    expect(output).toBe(
      '((See <va-link href="https://www.va.gov" text="https://www.va.gov"></va-link>))'
    )
  })

  it('handles URL with parens followed by sentence-ending paren', () => {
    const input = '(Check https://en.wikipedia.org/wiki/Test_(page))'
    const output = createUrlLinks(input)
    expect(output).toBe(
      '(Check <va-link href="https://en.wikipedia.org/wiki/Test_(page)" text="https://en.wikipedia.org/wiki/Test_(page)"></va-link>)'
    )
  })

  it('handles URL with multiple parens and extra trailing parens', () => {
    const input = 'Link: https://example.com/path(param)).'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'Link: <va-link href="https://example.com/path(param)" text="https://example.com/path(param)"></va-link>).'
    )
  })

  it('handles nested balanced parens in URLs', () => {
    const input = 'See https://example.com/a(b(c)d) for details'
    const output = createUrlLinks(input)
    expect(output).toBe(
      'See <va-link href="https://example.com/a(b(c)d)" text="https://example.com/a(b(c)d)"></va-link> for details'
    )
  })

  it('strips unbalanced opening paren when closing paren is cut off by space', () => {
    const input = 'https://google.com(google it)'
    const output = createUrlLinks(input)
    expect(output).toBe(
      '<va-link href="https://google.com" text="https://google.com"></va-link>(google it)'
    )
  })

  it('strips multiple unbalanced opening parens', () => {
    const input = 'https://example.com((test'
    const output = createUrlLinks(input)
    expect(output).toBe(
      '<va-link href="https://example.com" text="https://example.com"></va-link>((test'
    )
  })
})
