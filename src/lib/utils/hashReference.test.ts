import { hashReference } from './hashReference'

describe('hashReference', () => {
  it('returns null when null is passed', () => {
    expect(hashReference(null)).toEqual(null)
  })

  it('returns null when undefined is passed', () => {
    expect(hashReference(undefined)).toEqual(null)
  })

  it('returns null when empty string is passed', () => {
    expect(hashReference('')).toEqual(null)
  })

  it('returns a hyphenated string', () => {
    expect(hashReference('Testing One two three')).toEqual(
      'testing-one-two-three'
    )
  })

  it('returns hyphenated string and removes multiple spaces', () => {
    expect(hashReference('testing  one two  three')).toEqual(
      'testing-one-two-three'
    )
  })

  it('returns hyphenated string with spaces removed from both sides of string', () => {
    expect(hashReference('  Testing one two three   ')).toEqual(
      'testing-one-two-three'
    )
  })

  it('returns hyphenated string in all lowercase', () => {
    expect(hashReference('Lorem IPSUM dolor SIT amet')).toEqual(
      'lorem-ipsum-dolor-sit-amet'
    )
  })
  it('returns hyphenated string without punctuation', () => {
    expect(hashReference('lorem, ipsum. dolor; sit amet')).toEqual(
      'lorem-ipsum-dolor-sit-amet'
    )
  })
  it('returns hyphenated string at a set length', () => {
    expect(hashReference('lorem ipsum dolor sit amet', 20)).toEqual(
      'lorem-ipsum-dolor-si'
    )
  })
  it('returns hyphenated string with normalized & stripped out diacritics', () => {
    // normalize diacritics:
    // \u00e9 = é (single character e with acute accent)
    // e\u0301 = é (e + combining acute accent)
    // \u00f1 = ñ (single character n with tilde)
    // n\u0303 = ñ (n + combining tilde)
    expect(hashReference('a \u00e9 e\u0301 \u00f1 n\u0303')).toEqual(
      'a-e-e-n-n'
    )
  })
})
