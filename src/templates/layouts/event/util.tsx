import _ from "lodash";


export const formatDateObject = (datetimeRange) => {
  return datetimeRange.map((dateObject) => {
    const startTime = new Date(dateObject.value)
    const endTime = new Date(dateObject.end_value)
    return {
      ...dateObject,
      startTime: dateObject.value,
      endTime: dateObject.end_value,
      value: Math.floor(startTime.getTime() / 1000),
      endValue: Math.floor(endTime.getTime() / 1000)
    }
  })

}

export const deriveMostRecentDate = (
  datetimeRange,
  now = Date.now(), // This is done so that we can mock the current time in tests.
) => {
  // Escape early if no datetimeRange was passed.
  if (!datetimeRange) return datetimeRange;

  // Return back datetimeRange if it is already a singular most recent date.
  if (!_.isArray(datetimeRange)) {
    return datetimeRange;
  }

  // Return back datetimeRange's first item if it only has 1 item.
  if (datetimeRange?.length === 1) {
    return datetimeRange[0];
  }

  // Derive date times relative to now.
  const dates = _.sortBy(datetimeRange, 'endValue');
  const futureDates = _.filter(dates, date => date?.endValue - now > 0);

  // Return the most recent past date if there are no future dates.
  if (_.isEmpty(futureDates)) {
    return dates[dates?.length - 1];
  }

  // Return the most recent future date if there are future dates.
  return futureDates[0];
};

export const deriveFormattedTimestamp = datetime => {
  const startTime = new Date(datetime.startTime);
  const endTime = new Date(datetime.endTime);

  const formattedStartTime = startTime.toLocaleTimeString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' });
  const formattedEndTime = endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' });

  // Format: Mon. Dec 11, 2023, 10:30 am – 11:30 am ET
  return `${formattedStartTime} – ${formattedEndTime}`;
}

export const isEventInPast = (eventTime) => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return eventTime < nowInSeconds;
}