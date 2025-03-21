import { MediaImage } from './media'

export type PersonProfileTeaser = {
  description: string
  entityPath: string
  firstName: string
  lastName: string
  media: MediaImage
  office: string
  phoneNumber?: string
  suffix?: string
}
