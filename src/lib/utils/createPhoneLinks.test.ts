import { createPhoneLinks } from './createPhoneLinks'

describe('createPhoneLinks', () => {
  it('wraps simple phone numbers', () => {
    const input = 'Call us at 800-555-1234.'
    const output = createPhoneLinks(input)
    expect(output).toContain(
      '<va-telephone contact="800-555-1234" extension=""></va-telephone>'
    )
  })

  it('wraps phone numbers with parentheses and spaces', () => {
    const input = 'Call (800) 555 1234 now!'
    const output = createPhoneLinks(input)
    expect(output).toContain(
      '<va-telephone contact="800-555-1234" extension=""></va-telephone>'
    )
  })

  it('wraps phone numbers with extension using x', () => {
    const input = 'Dial 800-555-1234 x123 for service.'
    const output = createPhoneLinks(input)
    expect(output).toContain(
      '<va-telephone contact="800-555-1234" extension="123"></va-telephone>'
    )
  })

  it('wraps phone numbers with extension using ext.', () => {
    const input = 'Call 800-555-1234 ext. 456'
    const output = createPhoneLinks(input)
    expect(output).toContain(
      '<va-telephone contact="800-555-1234" extension="456"></va-telephone>'
    )
  })

  it('does not wrap numbers inside <va-telephone>', () => {
    const input = 'Call <va-telephone contact="800-555-1234"></va-telephone>'
    const output = createPhoneLinks(input)
    expect(output).toBe(input)
  })

  it('does not wrap numbers inside <a> tags', () => {
    const input = 'Call <a href="tel:800-555-1234">800-555-1234</a>'
    const output = createPhoneLinks(input)
    expect(output).toBe(input)
  })

  it('wraps multiple phone numbers', () => {
    const input = 'Call 800-555-1234 or 212-999-8888 for assistance.'
    const output = createPhoneLinks(input)
    expect(output.match(/<va-telephone/g)?.length).toBe(2)
  })

  it('returns original content if no phone number found', () => {
    const input = 'There is no phone number here.'
    const output = createPhoneLinks(input)
    expect(output).toBe(input)
  })

  it('handles malformed numbers gracefully', () => {
    const input = 'Phone: 800-555.1234'
    const output = createPhoneLinks(input)
    expect(output).toBe(input)
  })

  it('handles null or empty string', () => {
    expect(createPhoneLinks('')).toBe('')
  })
})
