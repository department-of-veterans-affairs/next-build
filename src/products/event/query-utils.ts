import { NodeEvent } from '@/types/drupal/node'

/**
 * Recurring events include entries in their field_datetime_range_timezone for each
 * occurrence of the event. This function returns the first occurrence of each event
 * after the timestamp. For non-recurring events, it won't touch the event but will
 * filter out any events before the timestamp. Remaining events will then be sorted from
 * earliest to latest.
 *
 * This function was written to be able to find the next event after a given timestamp.
 * For recurring events, each event will have multiple entries in the
 * field_datetime_range_timezone array—some in the past and some in the future. In order
 * to sort them, we need to be able to compare the "next occurence" of one event with the
 * "next occurence" of another event. We can't build a query for the Drupal JSON API that
 * will filter each event's field_datetime_range_timezone before sorting. Therefore we
 * have to fetch all of the events, figure out the "next occurence" of each event, and
 * then use that information to sort the events and take the first one.
 *
 * This is based on [this function from vets-website that drives the event listing page](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/static-pages/events/helpers/index.js#L78).
 * Originally I recreated a version of that function here, which expanded all recurring
 * events, but I found that really I only needed the next occurence of each event for my
 * use case. A copy of that function can be found in an earlier commit.
 */
export function getNextEventOccurrences(
  events: NodeEvent[],
  afterTimestamp: number
) {
  const filteredEvents = events.reduce((eventsAfterTimestamp, event) => {
    const eventTimes = event.field_datetime_range_timezone.filter(
      (time) => timestamp(time.value) > afterTimestamp
    )
    if (eventTimes.length > 0) {
      eventsAfterTimestamp.push({
        ...event,
        field_datetime_range_timezone: eventTimes,
      })
    }

    return eventsAfterTimestamp
  }, [] as NodeEvent[])

  filteredEvents.sort(
    (event1, event2) =>
      timestamp(event1?.field_datetime_range_timezone[0]?.value) -
      timestamp(event2?.field_datetime_range_timezone[0]?.value)
  )

  return filteredEvents
}

function timestamp(date: string) {
  return new Date(date).getTime() / 1000
}
