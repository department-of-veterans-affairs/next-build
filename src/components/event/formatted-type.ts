import {
  NodeEventListing,
  NodeHealthCareLocalFacility,
} from '@/types/drupal/node'
import { MediaImage } from '@/types/formatted/media'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import {
  FieldAddress,
  FieldFormattedText,
  SocialLinksProps,
  FieldLink,
} from '@/types/drupal/field_type'
import { Administration } from '@/types/formatted/administration'

interface DateTimeRangeItem {
  value: string
  end_value: string
  duration: number
  rrule: number
  rrule_index: number
  timezone: string
}

interface Link {
  url: {
    path: string
  }
  uri: string
  title: string
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
  fieldDatetimeRangeTimezone: DateTimeRangeItem[]
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
