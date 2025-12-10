import { NodeEvent } from '@/types/drupal/node'
import { FeaturedEventTeaser } from './formatted-type'

/**
 * Helper function to convert mock Drupal event data to FeaturedEventTeaser format.
 */
export function convertEventToFeaturedEventTeaser(
  event: NodeEvent
): FeaturedEventTeaser {
  const lastDatetime = event.field_datetime_range_timezone?.at(-1)
  const facilityLocation = event.field_facility_location
    ? {
        title: event.field_facility_location.title || '',
        entityUrl: event.field_facility_location.path?.alias
          ? `https://va.gov${event.field_facility_location.path.alias}`
          : '',
      }
    : null

  return {
    title: event.title,
    entityUrl: event.path?.alias,
    description: event.field_description || '',
    datetimeRangeTimezone: {
      value: lastDatetime?.value
        ? Math.floor(new Date(lastDatetime.value).getTime() / 1000)
        : 0,
      endValue: lastDatetime?.end_value
        ? Math.floor(new Date(lastDatetime.end_value).getTime() / 1000)
        : 0,
      timezone: lastDatetime?.timezone || 'America/New_York',
    },
    facilityLocation,
    locationHumanReadable: event.field_location_humanreadable || '',
    featured: event.field_featured ? '1' : '0',
  }
}
