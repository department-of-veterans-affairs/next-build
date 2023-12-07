import _ from "lodash";


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