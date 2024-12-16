import { NodeEventListing, NodeHealthCareLocalFacility } from '../drupal/node'
import { MediaImage } from './media'
import { PublishedEntity } from './publishedEntity'
import {
  FieldAddress,
  FieldFormattedText,
  SocialLinksProps,
  FieldLink,
} from '../drupal/field_type'
import { Administration } from './administration'

interface DateTimeRangeItem {
  value: string
  end_value: string
  duration: number
  rrule: number
  rrule_index: number
  timezone: string
}

export type Event = PublishedEntity & {
  image: MediaImage | null
  date: string
  socialLinks: SocialLinksProps
  listing: string
  listingOffice: string
  additionalInfo: FieldFormattedText | null
  address: FieldAddress
  locationHumanReadable: string
  eventCTA: string | null
  emailCTA: string | null
  howToSignUp: string | null
  cost: string
  registrationRequired: boolean
  datetimeRange: DateTimeRangeItem[]
  facilityLocation: NodeHealthCareLocalFacility | null
  body: FieldFormattedText | null
  locationType: string
  description: string
  link: Link | null
  urlOfOnlineEvent: FieldLink
  administration: Administration
}

// export type EventTeaser = PublishedEntity & {
// This doesn't look like our other formatted types, but it is the shape that the vets-website event widget expects.
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
  fieldDatetimeRangeTimezone: {
    duration: number
    endTime: string
    endValue: number
    startTime: string
    timezone: string
    value: number
  }
  fieldDescription: string
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
  fieldLink: Link
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

/** @todo: this type feels far too general to be placed here. - TFC */
interface Link {
  url: {
    path: string
  }
  uri: string
  title: string
}
