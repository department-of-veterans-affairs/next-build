import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { MediaImage } from '@/components/mediaDocument/formatted-type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import {
  FieldAddress,
  SocialLinksProps,
  FieldLink,
  FieldDateTimeRange,
  FieldNestedLink,
} from '@/types/drupal/field_type'
import { Administration } from '@/components/administration/formatted-type'

export type Event = PublishedEntity & {
  image: MediaImage | null
  date: string
  socialLinks: SocialLinksProps
  listing: string
  listingOffice: string
  additionalInfo: string
  address: FieldAddress
  locationHumanReadable: string
  eventCTA: string | null
  emailCTA: string | null
  howToSignUp: string | null
  cost: string
  registrationRequired: boolean
  datetimeRange: FieldDateTimeRange[]
  facilityLocation: NodeHealthCareLocalFacility | null
  body: string
  locationType: string
  description: string
  link: FieldNestedLink | null
  urlOfOnlineEvent: FieldLink
  administration: Administration
}
