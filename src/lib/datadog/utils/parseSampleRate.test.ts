import { parseSampleRate } from './parseSampleRate'

describe('parseSampleRate', () => {
  it('should return the parsed number for valid numeric strings', () => {
    expect(parseSampleRate('1')).toBe(1)
    expect(parseSampleRate('10')).toBe(10)
    expect(parseSampleRate('100')).toBe(100)
    expect(parseSampleRate('0.5')).toBe(0.5)
    expect(parseSampleRate('0.1')).toBe(0.1)
  })

  it('should return 0 for zero string (not undefined, unlike OR fallback)', () => {
    expect(parseSampleRate('0')).toBe(0)
  })

  it('should return undefined for invalid or non-numeric strings', () => {
    expect(parseSampleRate('abc')).toBeUndefined()
    expect(parseSampleRate('invalid')).toBeUndefined()
    expect(parseSampleRate('')).toBeUndefined()
    expect(parseSampleRate('  ')).toBeUndefined()
  })

  it('should return undefined for undefined input', () => {
    expect(parseSampleRate(undefined)).toBeUndefined()
  })

  it('should parse decimal strings with leading zeros', () => {
    expect(parseSampleRate('0.25')).toBe(0.25)
    expect(parseSampleRate('00.5')).toBe(0.5)
  })

  it('should parse strings with leading/trailing whitespace', () => {
    expect(parseSampleRate('  0.5  ')).toBe(0.5)
    expect(parseSampleRate('  10  ')).toBe(10)
  })

  it('should return the number for partial numeric strings (parseFloat behavior)', () => {
    expect(parseSampleRate('0.5abc')).toBe(0.5)
    expect(parseSampleRate('10px')).toBe(10)
  })
})
