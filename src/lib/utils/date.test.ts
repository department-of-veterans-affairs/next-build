import {
  isISOString,
  parseMilliseconds,
  parseSeconds,
  parseDate,
  getDateParts,
} from './date'

describe('isISOString', () => {
  describe('with valid ISO strings', () => {
    test('should return true with timezone offset', () => {
      const result = isISOString('2022-10-12T20:00:51-0400')
      expect(result).toBe(true)
    })

    test('should return true with timezone offset with colon', () => {
      const result = isISOString('2022-10-12T20:00:51-04:00')
      expect(result).toBe(true)
    })

    test('should return true without explicit timezone offset', () => {
      const result = isISOString('2023-09-11T14:30:00')
      expect(result).toBe(true)
    })

    test('should return true with explicit Zulu/UTC Time', () => {
      const result = isISOString('2023-09-11T14:30:00Z')
      expect(result).toBe(true)
    })

    test('should return true with fractional seconds', () => {
      const result = isISOString('2023-09-11T14:30:15.500Z')
      expect(result).toBe(true)
    })
  })

  describe('with invalid ISO strings', () => {
    test('should return false with empty input', () => {
      const resultNull = isISOString(null)
      const resultUndefined = isISOString(undefined)
      const resultEmptyString = isISOString('')

      expect(resultNull).toBe(false)
      expect(resultUndefined).toBe(false)
      expect(resultEmptyString).toBe(false)
    })

    test("should return false with string that isn't ISO string", () => {
      const result1 = isISOString('some string')
      const result2 = isISOString('2022-10-12')

      expect(result1).toBe(false)
      expect(result2).toBe(false)
    })
  })
})

describe('parseMilliseconds', () => {
  describe('with valid milliseconds', () => {
    test('should return value when valid number is passed', () => {
      const result = parseMilliseconds(1665619251235)
      expect(result).toBe(1665619251235)
    })

    test('should return value when valid string is passed', () => {
      const result = parseMilliseconds('1665619251235')
      expect(result).toBe(1665619251235)
    })
  })

  describe('with invalid milliseconds', () => {
    test('should return false when passed number is too small', () => {
      const result = parseMilliseconds(1665619251)
      expect(result).toBe(false)
    })

    test('should return false when passed string is too short', () => {
      const result = parseMilliseconds('1665619251')
      expect(result).toBe(false)
    })

    test('should return false when passed number is too large', () => {
      const result = parseMilliseconds(1665619251235000)
      expect(result).toBe(false)
    })

    test('should return false when passed string is too long', () => {
      const result = parseMilliseconds('1665619251235000')
      expect(result).toBe(false)
    })
  })
})

describe('parseSeconds', () => {
  describe('with valid seconds', () => {
    test('should return value when valid number is passed', () => {
      const result = parseSeconds(1665619251)
      expect(result).toBe(1665619251)
    })

    test('should return value when valid string is passed', () => {
      const result = parseSeconds('1665619251')
      expect(result).toBe(1665619251)
    })
  })

  describe('with invalid milliseconds', () => {
    test('should return false when passed number is too large', () => {
      const result = parseSeconds(1665619251235)
      expect(result).toBe(false)
    })

    test('should return false when passed string is too long', () => {
      const result = parseSeconds('1665619251235')
      expect(result).toBe(false)
    })
  })
})

describe('parseDate', () => {
  describe('with valid date input', () => {
    test('should return date when ISO string', () => {
      const result = parseDate('2022-10-12T20:00:51-0400')
      expect(result).not.toBe(null)
      expect(result.getTime()).toBe(1665619251000)
    })

    test('should return date when milliseconds number is passed', () => {
      const result = parseDate(1665619251000)
      expect(result).not.toBe(null)
      expect(result.getTime()).toBe(1665619251000)
    })

    test('should return date when milliseconds string is passed', () => {
      const result = parseDate('1665619251000')
      expect(result).not.toBe(null)
      expect(result.getTime()).toBe(1665619251000)
    })

    test('should return date when seconds number is passed', () => {
      const result = parseDate(1665619251)
      expect(result).not.toBe(null)
      expect(result.getTime()).toBe(1665619251000)
    })

    test('should return date when seconds string is passed', () => {
      const result = parseDate('1665619251')
      expect(result).not.toBe(null)
      expect(result.getTime()).toBe(1665619251000)
    })
  })

  describe('with invalid date input', () => {
    test('should return null when passed a non-date string', () => {
      const result = parseDate("this isn't a date")
      expect(result).toBe(null)
    })

    test('should return null when passed a number that is too big', () => {
      const result = parseDate(1665619251000000)
      expect(result).toBe(null)
    })

    test('should return null when passed a numeric string that is too long', () => {
      const result = parseDate('1665619251000000')
      expect(result).toBe(null)
    })
  })
})

describe('getDateParts', () => {
  describe('with valid date', () => {
    test('should return all date parts when valid date is passed in', () => {
      const date = new Date('2022-01-01T20:00:51-04:00')
      const result = getDateParts(date, 'America/New_York')
      expect(result).toEqual({
        year: {
          twoDigit: '22',
          numeric: 2022,
        },
        month: {
          twoDigit: '01',
          numeric: 1,
          name: 'January',
          shortName: 'Jan',
        },
        day: {
          twoDigit: '01',
          numeric: 1,
          name: 'Saturday',
          shortName: 'Sat',
        },
      })
    })

    test('should return all date parts for correct time zone when time zone is passed in', () => {
      const date = new Date('2022-01-01T20:00:51-04:00')
      const result = getDateParts(date, 'Australia/Sydney')
      expect(result).toEqual({
        year: {
          twoDigit: '22',
          numeric: 2022,
        },
        month: {
          twoDigit: '01',
          numeric: 1,
          name: 'January',
          shortName: 'Jan',
        },
        day: {
          twoDigit: '02',
          numeric: 2,
          name: 'Sunday',
          shortName: 'Sun',
        },
      })
    })
  })

  describe('with invalid date', () => {
    test('should return null when null is passed in', () => {
      const result = getDateParts(null)
      expect(result).toBe(null)
    })
  })
})
