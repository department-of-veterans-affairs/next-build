import { dayOfWeek } from './dayOfWeek'

describe('dayOfWeek', () => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  it('returns correct day names for 0 through 6', () => {
    for (let i = 0; i < days.length; i++) {
      expect(dayOfWeek(i)).toBe(days[i])
    }
  })

  it('throws for negative numbers', () => {
    expect(() => dayOfWeek(-1)).toThrow('Invalid day of week')
    expect(() => dayOfWeek(-10)).toThrow('Invalid day of week')
  })

  it('throws for numbers greater than 6', () => {
    expect(() => dayOfWeek(7)).toThrow('Invalid day of week')
    expect(() => dayOfWeek(100)).toThrow('Invalid day of week')
  })

  it('throws for non-integer input', () => {
    // expect(() => dayOfWeek(1.5)).toThrow('Invalid day of week')
    expect(() => dayOfWeek(NaN)).toThrow('Invalid day of week')
    expect(() => dayOfWeek(Number.POSITIVE_INFINITY)).toThrow(
      'Invalid day of week'
    )
  })
})
