import { MediaImage } from './media'
import { PhoneNumber as FormattedPhoneNumber } from '@/types/formatted/phoneNumber'

export type PersonProfile = {
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
  displayType: 'page' | 'component'
}
