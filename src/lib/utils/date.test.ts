/* eslint-disable import/no-extraneous-dependencies */
import { jest } from '@jest/globals'

jest.mock('date-fns-tz', () => ({
  formatInTimeZone: jest.fn(),
}))

import {
  isISOString,
  parseMilliseconds,
  parseSeconds,
  parseDate,
  getDateParts,
  formatDateObject,
  deriveMostRecentDate,
  deriveFormattedTimestamp,
  isEventInPast,
  filterPastEvents,
  formatEventDateTime,
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

describe('formatDateObject', () => {
  it('should add startTime, endTime, value, and endValue to each date object', () => {
    const datetimeRange = [
      {
        value: new Date('2023-09-07T14:00:00Z'),
        end_value: new Date('2023-09-07T16:00:00Z'),
      },
    ]
    const result = formatDateObject(datetimeRange)
    expect(result[0]).toHaveProperty('startTime')
    expect(result[0]).toHaveProperty('endTime')
    expect(result[0]).toHaveProperty('value')
    expect(result[0]).toHaveProperty('endValue')
  })
})

describe('FilterPastEvents', () => {
  it('should filter out past events from date time range for events', () => {
    const datetimeRange = [
      {
        value: new Date('2023-09-07T14:00:00Z'),
        end_value: new Date('2023-09-07T16:00:00Z'),
      },
      {
        value: new Date('2999-09-07T14:00:00Z'),
        end_value: new Date('2999-09-07T16:00:00Z'),
      },
    ]
    const result = filterPastEvents(datetimeRange)
    expect(result).toHaveLength(1)
  })
})

describe('deriveMostRecentDate', () => {
  it('should return the closest future or ongoing event', () => {
    const mockCurrentTime = new Date('2023-08-01T18:00:00Z').getTime()
    jest.spyOn(Date, 'now').mockImplementation(() => mockCurrentTime)

    const datetimeRange = [
      {
        value: new Date('2023-07-01T14:00:00Z').getTime() / 1000,
        endValue: new Date('2023-07-01T16:00:00Z').getTime() / 1000,
      }, // Past event
      {
        value: new Date('2023-08-01T14:00:00Z').getTime() / 1000,
        endValue: new Date('2023-08-01T19:00:00Z').getTime() / 1000,
      },
      {
        value: new Date('2023-09-01T14:00:00Z').getTime() / 1000,
        endValue: new Date('2023-09-01T16:00:00Z').getTime() / 1000,
      }, // Closest future event
      {
        value: new Date('2023-10-01T14:00:00Z').getTime() / 1000,
        endValue: new Date('2023-10-01T16:00:00Z').getTime() / 1000,
      }, // Later future event
    ]

    const closestEvent = deriveMostRecentDate(datetimeRange)
    expect(closestEvent.value).toEqual(datetimeRange[1].value)

    jest.restoreAllMocks()
  })

  it('should return the most recent past event if no future events', () => {
    const mockCurrentTime = new Date('2023-12-01T12:00:00Z').getTime()
    jest.spyOn(Date, 'now').mockImplementation(() => mockCurrentTime)

    const datetimeRange = [
      { value: new Date('2023-07-01T14:00:00Z').getTime() / 1000 }, // Earlier past event
      { value: new Date('2023-11-01T14:00:00Z').getTime() / 1000 }, // Most recent past event
    ]

    const closestEvent = deriveMostRecentDate(datetimeRange)
    expect(closestEvent.value).toEqual(datetimeRange[1].value)

    jest.restoreAllMocks()
  })
})
describe('deriveFormattedTimestamp', () => {
  it('should correctly format the event timestamp', () => {
    const datetime = {
      startTime: new Date('2023-09-07T14:00:00Z'),
      endTime: new Date('2023-09-07T16:00:00Z'),
    }
    const result = deriveFormattedTimestamp(datetime)

    expect(result).toMatch(
      /Thu. Sep 7, 2023, \d{1,2}:\d{2} [apm]{2} [A-Z]{2,4} – \d{1,2}:\d{2} [apm]{2} [A-Z]{2,4}/
    )
  })
})

describe('isEventInPast', () => {
  it('should return true for past events', () => {
    const pastEventTime = new Date('2020-01-01').getTime() / 1000
    expect(isEventInPast(pastEventTime)).toBeTruthy()
  })

  it('should return false for future events', () => {
    const futureEventTime = new Date('2099-01-01').getTime() / 1000
    expect(isEventInPast(futureEventTime)).toBeFalsy()
  })
})

test('getDateParts should return null for falsy values', () => {
  //@ts-expect-error for testing
  expect(getDateParts('')).toBe(null)
})

test('parseDate should return null for inputs that do not match any date format', () => {
  expect(parseDate('')).toBe(null)
})

describe('formatEventDateTime', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  /**
   * Helper function to mock the system time zone
   */
  const mockUserTimeZone = (mockTimeZone: string) => {
    jest
      .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({
        locale: 'en-US',
        calendar: 'gregory',
        numberingSystem: 'latn',
        timeZone: mockTimeZone,
      })
  }

  it('should format time based on mocked Eastern Time (ET)', () => {
    mockUserTimeZone('America/New_York')
    const mostRecentDate = {
      value: 1683201600,
      endValue: 1683208800,
    }
    const result = formatEventDateTime(mostRecentDate)
    expect(result).toMatch(/Thu\. May 4, 2023, 8:00 a\.m\. – 10:00 a\.m\. ET/)
  })

  it('should format time based on mocked Pacific Time (PT)', () => {
    mockUserTimeZone('America/Los_Angeles')
    const mostRecentDate = {
      value: 1683201600,
      endValue: 1683208800,
    }
    const result = formatEventDateTime(mostRecentDate)
    expect(result).toMatch(/Thu\. May 4, 2023, 5:00 a\.m\. – 7:00 a\.m\. PT/)
  })

  it('should format time to User time even when mostRecentDate has undefined timezone', () => {
    mockUserTimeZone('America/Chicago')
    const mostRecentDate = {
      value: 1683201600,
      endValue: 1683208800,
      timezone: undefined,
    }
    const result = formatEventDateTime(mostRecentDate)
    expect(result).toMatch(/Thu\. May 4, 2023, 7:00 a\.m\. – 9:00 a\.m\. CT/)
  })

  it('should return "Invalid date" for incorrect timestamps', () => {
    mockUserTimeZone('America/New_York')
    const mostRecentDate = {
      value: -1,
      endValue: -1,
    }
    const result = formatEventDateTime(mostRecentDate)
    expect(result).toBe('Invalid date – Invalid date ET')
  })

  it('should format event in US timezone if user is international (Asia)', () => {
    mockUserTimeZone('Asia/Tokyo')
    const mostRecentDate = {
      value: 1683201600,
      endValue: 1683208800,
      timezone: 'America/New_York',
    }
    const result = formatEventDateTime(mostRecentDate)
    expect(result).toMatch(/Thu\. May 4, 2023, 8:00 a\.m\. – 10:00 a\.m\. ET/)
  })

  it('should correctly format an event from 12:00 a.m. to 12:00 p.m.', () => {
    mockUserTimeZone('America/New_York')
    const mostRecentDate = {
      value: 1683172800,
      endValue: 1683216000,
      timezone: 'America/New_York',
    }
    const result = formatEventDateTime(mostRecentDate)
    expect(result).toBe('Thu. May 4, 2023, 12:00 a.m. – 12:00 p.m. ET')
  })
})
