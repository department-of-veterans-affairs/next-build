import { numberToTimeString } from './numberToTimeString'

describe('numberToTimeString', () => {
  it('returns an empty string for null input', () => {
    expect(numberToTimeString(null)).toBe('')
  })

  it('formats 730 as "07:30:00"', () => {
    expect(numberToTimeString(730)).toBe('07:30:00')
  })

  it('formats 1600 as "16:00:00"', () => {
    expect(numberToTimeString(1600)).toBe('16:00:00')
  })

  it('formats 0 as "00:00:00"', () => {
    expect(numberToTimeString(0)).toBe('00:00:00')
  })

  it('formats 59 as "00:59:00"', () => {
    expect(numberToTimeString(59)).toBe('00:59:00')
  })

  it('formats 2359 as "23:59:00"', () => {
    expect(numberToTimeString(2359)).toBe('23:59:00')
  })

  it('throws an error for invalid hour (2400)', () => {
    expect(() => numberToTimeString(2400)).toThrow('Invalid time input')
  })

  it('throws an error for invalid minutes (1261)', () => {
    expect(() => numberToTimeString(1261)).toThrow('Invalid time input')
  })

  it('throws an error for negative input', () => {
    expect(() => numberToTimeString(-100)).toThrow('Invalid time input')
  })
})
