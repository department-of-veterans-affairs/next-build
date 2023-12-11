import _ from 'lodash'

export const formatDateObject = (datetimeRange) => {
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
  return `${formattedStartTime} – ${formattedEndTime}`
}

export const isEventInPast = (eventTime) => {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  return eventTime < nowInSeconds
}
