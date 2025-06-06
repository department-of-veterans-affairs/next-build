import { NodeEvent } from "@/types/drupal/node";

/**
 * Based on [this function from vets-website that drives the event listing page](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/static-pages/events/helpers/index.js#L78),
 * this function takes each recurring event and makes copies of it to represent each
 * occurrence of the event. Optionally filters out any event before the `afterTimestamp`.
 * It then sorts all of the events from earliest to latest.
 * 
 * @param events - The events to expand.
 * @param afterTimestamp - If this unix timestamp (seconds) is provided, it will only
 * include events that occur after that timestamp in the returned array.
 * @returns An array of expanded events.
 */
export function expandRecurringEvents(events: NodeEvent[], afterTimestamp?: number) {
  const allEvents = events.reduce((fullEvents, event) => {
    let eventTimes = event.field_datetime_range_timezone ?? [];
    if (afterTimestamp) {
      eventTimes = eventTimes.filter(time => time.value > afterTimestamp);
    }

    // Create copies of the event for each occurrence, excluding previous occurences in
    // the field_datetime_range_timezone array.
    eventTimes.forEach((_, index) => {
      const timeZonesCopy = [...eventTimes];
      for (let i = 0; i < index; i++) {
        timeZonesCopy.unshift(timeZonesCopy.pop());
      }
      fullEvents.push({ ...event, field_datetime_range_timezone: timeZonesCopy });
    });

    return fullEvents;
  }, [] as NodeEvent[]);

  allEvents.sort(
    (event1, event2) =>
      event1?.field_datetime_range_timezone[0]?.value -
      event2?.field_datetime_range_timezone[0]?.value,
  );

  return allEvents;
}

/**
 * Recurring events include entries in their field_datetime_range_timezone for each
 * occurrence of the event. This function returns the first occurrence of each event
 * after the timestamp. For non-recurring events, it won't touch the event but will
 * filter out any events before the timestamp. Remaining events will then be sorted from
 * earliest to latest.
 */
export function getNextEventOccurrences(events: NodeEvent[], afterTimestamp: number) {
  const filteredEvents = events.reduce((eventsAfterTimestamp, event) => {
    const eventTimes = event.field_datetime_range_timezone.filter(time => time.value > afterTimestamp);
    if (eventTimes.length > 0) {
      eventsAfterTimestamp.push({...event, field_datetime_range_timezone: eventTimes});
    }

    return eventsAfterTimestamp;
  }, [] as NodeEvent[]);

  filteredEvents.sort(
    (event1, event2) =>
      event1?.field_datetime_range_timezone[0]?.value -
      event2?.field_datetime_range_timezone[0]?.value,
  );

  return filteredEvents;
}