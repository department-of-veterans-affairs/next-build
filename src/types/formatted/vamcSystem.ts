import { MediaImage } from '@/types/formatted/media'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { PublishedEntity } from './publishedEntity'
import { HealthCareLocalFacility } from './healthCareLocalFacility'
import { FormattedRelatedLinks } from './relatedLinks'

export type MinimalLocalFacility = Pick<
  HealthCareLocalFacility,
  | 'title'
  | 'path'
  | 'operatingStatusFacility'
  | 'address'
  | 'phoneNumber'
  | 'fieldTelephone'
  | 'vaHealthConnectPhoneNumber'
  | 'image'
>

export type VamcSystem = PublishedEntity & {
  title: string
  introText: string
  image: MediaImage
  administrationId: number
  menu: SideNavMenu
  path: string
  mainFacilities: MinimalLocalFacility[]
  relatedLinks: FormattedRelatedLinks
}
