import { MediaImage } from './media'
import { PhoneNumber as FormattedPhoneNumber } from '@/types/formatted/phoneNumber'
import { PublishedEntity } from './publishedEntity'

export type Link = {
  url: { path: string }
  label: string
  links?: Link[]
}

export type SidebarData = {
  depth: number
  link: { label: string; url: { path: string }; links: Link[] }
  parent: { label: string; url: { path: string }; links: Link[] }
}

export type StaffProfile = PublishedEntity & {
  firstName: string
  lastName: string
  suffix?: string
  emailAddress?: string
  phoneNumber?: FormattedPhoneNumber
  description?: string
  introText: string
  body: string
  media?: MediaImage
  menu?: SidebarData
  completeBiography?: { url: string }
  completeBiographyCreate?: boolean
  photoAllowHiresDownload?: boolean
  vamcOfficalName: string
}
