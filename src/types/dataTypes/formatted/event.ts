import { BreadcrumbItem } from '../drupal/field_type'
import { FacilityLocation } from '../drupal/node'
import { urlOfOnlineEvent } from '../drupal/node'
import { MediaImage } from './media'
import { MetaTag } from './metatags'

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

export interface Event {
  id: string
  entityId: number
  entityPath: string
  type: string
  published: boolean
  title: string
  image: MediaImage | null
  date: string
  breadcrumbs: BreadcrumbItem[]
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
  }
  locationHumanReadable: string
  eventCTA: string | null
  cost: string
  datetimeRange: DateTimeRangeItem[]
  facilityLocation: FacilityLocation | null
  body: htmlBody | null
  locationType: string
  description: string
  link: Link | null
  metatags: MetaTag[]
  urlOfOnlineEvent: urlOfOnlineEvent
}
