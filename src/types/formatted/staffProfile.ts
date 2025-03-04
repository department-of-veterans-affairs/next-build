import { MediaImage } from './media'
import { NodeOffice, NodeHealthCareRegionPage } from '@/types/drupal/node'
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
  phoneNumber?: string
  description?: string
  introText: string
  body: string
  media?: MediaImage
  menu?: SidebarData
  completeBiography?: { url: string }
  completeBiographyCreate?: boolean
  photoAllowHiresDownload?: boolean
  vamcOfficalName: string
  office?: NodeOffice | NodeHealthCareRegionPage //TODO: This should be a formatted office type, not Drupal specific.
}
