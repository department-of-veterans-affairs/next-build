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

export const deriveMostRecentDate = (
  datetimeRange,
  now = Date.now() // This is done so that we can mock the current time in tests.
) => {
  const currentTime = Math.floor(Date.now() / 1000)

  // Filter for future events
  const futureEvents = datetimeRange.filter(
    (event) => event.value > currentTime
  )

  // If there are future events, return closest event
  if (futureEvents.length > 0) {
    return futureEvents.reduce((closest, current) => {
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
    return str.replaceAll('AM', 'am').replace('PM', 'pm').replace(',', '.')
  }

  return reformatTime(formattedTime)
}

export const isEventInPast = (eventTime) => {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  return eventTime < nowInSeconds
}
