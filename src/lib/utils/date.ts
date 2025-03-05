export const ISO_8601_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|(\+|-)\d{2}:?\d{2})?$/

export function isISOString(d: string | number): boolean {
  return typeof d === 'string' && ISO_8601_REGEX.test(d)
}

function parseIntWithDigitCountCheck(
  d: string | number,
  check: (num: number) => boolean
): number | false {
  const dNumber = typeof d === 'number' ? d : parseInt(d)
  if (isNaN(dNumber)) {
    return false
  }

  const digitCount = `${dNumber}`.length
  return check(digitCount) ? dNumber : false
}

export function parseMilliseconds(d: string | number): number | false {
  return parseIntWithDigitCountCheck(
    d,
    (digitCount) => digitCount >= 12 && digitCount <= 14
  )
}

export function parseSeconds(d: string | number): number | false {
  return parseIntWithDigitCountCheck(d, (digitCount) => digitCount <= 11)
}

/**
 *
 * @param d Input can be of various forms:
 *  1. ISO String: '2022-10-12T20:00:51-0400'
 *  2. Milliseconds number: 1665619251000
 *  3. Milliseconds string: '1665619251000'
 *  4. Seconds number: 1665619251
 *  5. Seconds string: '1665619251'
 */
export function parseDate(d: string | number): Date {
  if (!d) {
    return null
  }

  let date: Date
  let milliseconds: number | false
  let seconds: number | false

  if (isISOString(d)) {
    date = new Date(d)
  } else if ((milliseconds = parseMilliseconds(d))) {
    date = new Date(milliseconds)
  } else if ((seconds = parseSeconds(d))) {
    date = new Date(seconds * 1000)
  } else {
    return null
  }

  return isNaN(date.getTime()) ? null : date
}

/**
 *
 * @param date Defaults to current date
 * @param timezone e.g. `America/New_York`
 */
export function getDateParts(
  date: Date = new Date(),
  timezone = 'America/New_York'
): {
  year: {
    twoDigit: string
    numeric: number
  }
  month: {
    twoDigit: string
    numeric: number
    name: string
    shortName: string
  }
  day: {
    twoDigit: string
    numeric: number
    name: string
    shortName: string
  }
} {
  if (!date) {
    // date defaults to today, but return null if null passed in or some other empty value
    return null
  }

  const dateParts = {
    year: {
      twoDigit: null,
      numeric: null,
    },
    month: {
      twoDigit: null,
      numeric: null,
      name: null,
      shortName: null,
    },
    day: {
      twoDigit: null,
      numeric: null,
      name: null,
      shortName: null,
    },
  }
  try {
    const twoDigitDateParts = new Intl.DateTimeFormat('en-us', {
      timeZone: timezone,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).formatToParts(date)
    dateParts.year.twoDigit = twoDigitDateParts.find(
      (part) => part.type === 'year'
    )?.value
    dateParts.month.twoDigit = twoDigitDateParts.find(
      (part) => part.type === 'month'
    )?.value
    dateParts.day.twoDigit = twoDigitDateParts.find(
      (part) => part.type === 'day'
    )?.value

    const numericDateParts = new Intl.DateTimeFormat('en-us', {
      timeZone: timezone,
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(date)
    dateParts.year.numeric = parseInt(
      numericDateParts.find((part) => part.type === 'year')?.value
    )
    dateParts.month.numeric = parseInt(
      numericDateParts.find((part) => part.type === 'month')?.value
    )
    dateParts.day.numeric = parseInt(
      numericDateParts.find((part) => part.type === 'day')?.value
    )

    const nameDateParts = new Intl.DateTimeFormat('en-us', {
      timeZone: timezone,
      weekday: 'long',
      month: 'long',
    }).formatToParts(date)
    dateParts.month.name = nameDateParts.find(
      (part) => part.type === 'month'
    )?.value
    dateParts.day.name = nameDateParts.find(
      (part) => part.type === 'weekday'
    )?.value

    const shortNameDateParts = new Intl.DateTimeFormat('en-us', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
    }).formatToParts(date)
    dateParts.month.shortName = shortNameDateParts.find(
      (part) => part.type === 'month'
    )?.value
    dateParts.day.shortName = shortNameDateParts.find(
      (part) => part.type === 'weekday'
    )?.value

    return dateParts
  } catch (e) {
    return null
  }
}

export const formatDateObject = (datetimeRange) => {
  if (!datetimeRange) return []

  return datetimeRange.map((dateObject) => {
    const startTime = new Date(dateObject.value)
    const endTime = new Date(dateObject.end_value)
    return {
      ...dateObject,
      startTime: dateObject.value,
      endTime: dateObject.end_value,
      value: Math.floor(startTime.getTime() / 1000),
      endValue: Math.floor(endTime.getTime() / 1000),
    }
  })
}

export const filterPastEvents = (eventTimes) => {
  if (!eventTimes) return []
  const now = new Date()
  return eventTimes.filter((dateObject) => {
    const endTime = new Date(dateObject.end_value)
    return endTime > now // Keep only if end_time is in the future
  })
}

export const deriveMostRecentDate = (
  datetimeRange,
  now = Date.now() // This is done so that we can mock the current time in tests.
) => {
  const currentTime = Math.floor(Date.now() / 1000)

  // Filter for ongoing and future events
  const ongoingAndFutureEvents = datetimeRange.filter(
    (event) => event.endValue > currentTime
  )

  // If there are future events, return closest event
  if (ongoingAndFutureEvents.length > 0) {
    return ongoingAndFutureEvents.reduce((closest, current) => {
      return closest.value < current.value ? closest : current
    })
  }

  // If there are no future events, filter for past events and return most recent
  const pastEvents = datetimeRange.filter((event) => event.value <= currentTime)
  if (pastEvents.length > 0) {
    return pastEvents.reduce((mostRecent, current) => {
      return mostRecent.value > current.value ? mostRecent : current
    })
  }
  // If none return
  return datetimeRange
}

export const deriveFormattedTimestamp = (datetime) => {
  if (!datetime) return
  const startTime = new Date(datetime.startTime)
  const endTime = new Date(datetime.endTime)
  const formattedStartTime = startTime.toLocaleTimeString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  })
  const formattedEndTime = endTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  })

  // Format: Mon. Dec 11, 2023, 10:30 am – 11:30 am ET
  // return `${formattedStartTime} – ${formattedEndTime}`

  const formattedTime = `${formattedStartTime} – ${formattedEndTime}`

  function reformatTime(str) {
    return str.replaceAll('AM', 'am').replaceAll('PM', 'pm').replace(',', '.')
  }

  return reformatTime(formattedTime)
}

const TIMEZONE_MAP = {
  'America/New_York': 'ET',
  'America/Chicago': 'CT',
  'America/Denver': 'MT',
  'America/Los_Angeles': 'PT',
  'America/Phoenix': 'MT',
  'America/Anchorage': 'AT',
  'Pacific/Honolulu': 'HT',
}

/**
 * Formats a datetime object into a standardized VA string format
 * Example output: "Fri May 3, 2024, 10:00 a.m. – 3:00 p.m. ET"
 */
export const deriveVaFormattedTimestamp = (datetime) => {
  if (!datetime) return

  try {
    // Convert array format since Event component tests have this
    if (Array.isArray(datetime)) {
      datetime = {
        startTime: datetime[0].value,
        endTime: datetime[0].end_value,
        timezone: datetime[0].timezone,
      }
    }

    // Handle both value/end_value and startTime/endTime property names
    const startTime = new Date(datetime.startTime || datetime.value)
    const endTime = new Date(datetime.endTime || datetime.end_value)

    // Format date as "Fri March 15, 2024"
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    // Format time as "10:00 AM"
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: datetime.timezone,
    })

    // Remove comma after weekday: "Fri, March" -> "Fri March" so some regex
    const datePart = dateFormatter.format(startTime).replace(/^(...), /, '$1 ')
    // Convert "AM/PM" to "a.m./p.m."
    const startTimePart = timeFormatter
      .format(startTime)
      .replace('AM', 'a.m.')
      .replace('PM', 'p.m.')
    const endTimePart = timeFormatter
      .format(endTime)
      .replace('AM', 'a.m.')
      .replace('PM', 'p.m.')
    // Map timezone to abbreviation: "America/New_York" -> "ET"
    const timeZone = TIMEZONE_MAP[datetime.timezone] || 'ET'

    // Combine into final format: "Fri March 15, 2024, 10:00 a.m. – 3:00 p.m. ET"
    return `${datePart}, ${startTimePart} – ${endTimePart} ${timeZone}`
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return
  }
}

export const isEventInPast = (eventTime) => {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  return eventTime < nowInSeconds
}
