import { MediaImage } from './media'
import { PhoneNumber as FormattedPhoneNumber } from './phoneNumber'

export type PersonProfileTeaser = {
  completeBiographyCreate: boolean
  description?: string
  emailAddress?: string
  entityPath?: string
  firstName: string
  lastName: string
  media?: MediaImage
  office: string
  phoneNumber?: FormattedPhoneNumber
  suffix?: string
}
