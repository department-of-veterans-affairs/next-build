import { NodeHealthCareLocalFacility } from '../drupal/node'
import { urlOfOnlineEvent } from '../drupal/node'
import { MediaImage } from './media'
import { PublishedEntity } from './publishedEntity'
import {
  FieldAddress,
  FieldFormattedText,
  SocialLinksProps,
} from '../drupal/field_type'

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
}

export type Event = PublishedEntity & {
  image: MediaImage | null
  date: string
  socialLinks: SocialLinksProps
  listing: string
  additionalInfo: FieldFormattedText | null
  address: FieldAddress
  locationHumanReadable: string
  eventCTA: string | null
  emailCTA: string | null
  howToSignUp: string | null
  cost: string
  datetimeRange: DateTimeRangeItem[]
  facilityLocation: NodeHealthCareLocalFacility | null
  body: FieldFormattedText | null
  locationType: string
  description: string
  link: Link | null
  urlOfOnlineEvent: urlOfOnlineEvent
}
