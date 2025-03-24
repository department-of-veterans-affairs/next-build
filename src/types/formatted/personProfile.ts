import { MediaImage } from './media'
import { NodeOffice, NodeHealthCareRegionPage } from '@/types/drupal/node'
import { PhoneNumber as FormattedPhoneNumber } from '@/types/formatted/phoneNumber'
import { PublishedEntity } from './publishedEntity'

export type PersonProfile = PublishedEntity & {
  firstName: string
  lastName: string
  suffix?: string
  emailAddress?: string
  phoneNumber?: FormattedPhoneNumber
  description?: string
  introText: string
  body: string
  media?: MediaImage
  completeBiography?: { url: string }
  completeBiographyCreate?: boolean
  photoAllowHiresDownload?: boolean
  vamcOfficalName: string
  office: NodeOffice | NodeHealthCareRegionPage //TODO: This should be a formatted office type, not Drupal specific.
}
