import { Path } from '@/types/dataTypes/formatted/path'
import { MediaImage } from './media'
import {
  NodeOffice,
  NodeHealthCareRegionPage,
} from '@/types/dataTypes/drupal/node'

export type PersonProfile = {
  id: string
  type: string
  entityId: number
  entityPath: string
  path: Path
  title?: string
  firstName: string
  lastName: string
  suffix?: string
  emailAddress?: string
  phoneNumber?: string
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
