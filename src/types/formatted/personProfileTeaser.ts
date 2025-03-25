import { MediaImage } from './media'

export type PersonProfileTeaser = {
  completeBiographyCreate: boolean
  description: string
  emailAddress?: string
  entityPath: string
  firstName: string
  lastName: string
  media: MediaImage
  office: string
  phoneNumber?: string
  suffix?: string
}
