import { FieldFormattedText, FieldNestedLink } from '@/types/drupal/field_type'
import { formatDateObject } from '@/lib/utils/date'

/**
 * A featured event from a VAMC system (same shape that the custom featured-events
 * endpoint returns).
 */
export type FeaturedEventTeaser = {
  /** Event title */
  title: string
  /** Full URL to the event entity */
  entityUrl: string
  /** Event description */
  description: string
  /** Date/time range with timezone information */
  datetimeRangeTimezone: {
    /** Unix timestamp (seconds) for the start of the event */
    value: number
    /** Unix timestamp (seconds) for the end of the event */
    endValue: number
    /** IANA timezone string (e.g., 'America/New_York') */
    timezone: string
  }
  /** Facility location information, or null if not set */
  facilityLocation: {
    /** Facility title */
    title: string
    /** Full URL to the facility entity */
    entityUrl: string
  } | null
  /** Human-readable location string */
  locationHumanReadable: string
  /** Featured flag ('0' for not featured, '1' for featured) */
  featured: string
}

/**
 * This is specifically for the events widget from vets-website. It doesn't look like our
 * other formatted types, but it is the shape that the vets-website event widget expects.
 */
export type EventWidgetTeaser = {
  changed: string
  entityBundle: string
  entityId: string
  entityPublished: boolean
  entityUrl: {
    path: string
  }
  fieldAdditionalInformationAbo: FieldFormattedText
  fieldAdditionalListings: []
  fieldAddress: {
    addressLine1?: string
    addressLine2?: string
    administrativeArea?: string
    countryCode?: string
    locality?: string
    postalCode?: string
  }
  fieldAdministration: {
    entity: {
      entityId: number
    }
  }
  fieldBody: {
    format: string
    processed: string
    value: string
  }
  fieldCtaEmail: string
  fieldDatetimeRangeTimezone: ReturnType<typeof formatDateObject>
  fieldDescription: string | null
  fieldEventCost: string
  fieldEventCta: string
  fieldEventRegistrationrequired: boolean
  fieldFacilityLocation?: {
    entity: {
      entityUrl: {
        path: string
      }
      fieldAddress: {
        addressLine1: string
        addressLine2: string
        administrativeArea: string
        countryCode: string
        locality: string
        postalCode: string
      }
      title: string
    }
  }
  fieldFeatured: boolean
  fieldHowToSignUp: string
  fieldLink: FieldNestedLink
  fieldListing: {
    entity: {
      entityId: string
    }
  }
  fieldLocationHumanreadable: string
  fieldLocationType: string
  fieldOrder: string
  fieldUrlOfAnOnlineEvent: { uri: string; title: string }
  title: string
}
