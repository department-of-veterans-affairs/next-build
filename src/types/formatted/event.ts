import { NodeHealthCareLocalFacility } from '../drupal/node'
import { urlOfOnlineEvent } from '../drupal/node'
import { MediaImage } from './media'
import { PublishedEntity } from './publishedEntity'

interface DateTimeRangeItem {
  value: string
  end_value: string
  duration: number
  rrule: number
  rrule_index: number
  timezone: string
}

interface htmlBody {
  value: string
  format: string
  processed: string
}

interface Link {
  url: {
    path: string
  }
}

export type Event = PublishedEntity & {
  image: MediaImage | null
  date: string
  socialLinks: {
    path: string
    title: string
  }
  listing: string
  additionalInfo: htmlBody | null
  address: {
    langcode?: string
    country_code?: string
    administrativeArea?: string
    locality?: string
    address_line1?: string
    address_line2?: string
    administrative_area?: string
  }
  locationHumanReadable: string
  eventCTA: string | null
  cost: string
  datetimeRange: DateTimeRangeItem[]
  facilityLocation: NodeHealthCareLocalFacility | null
  body: htmlBody | null
  locationType: string
  description: string
  link: Link | null
  urlOfOnlineEvent: urlOfOnlineEvent
  lastUpdated: string
}
