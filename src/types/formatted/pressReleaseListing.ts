import { PublishedEntity } from './publishedEntity'
import { PressReleaseTeaser } from '@/types/formatted/pressRelease'
import { SideNavMenu } from '@/types/formatted/sideNav'

export type PressReleaseListingLink = {
  path: string
}

export type PressReleaseListing = PublishedEntity & {
  introText: string
  'news-releases': PressReleaseTeaser[]
  menu: SideNavMenu
  currentPage: number
  totalItems: number
  totalPages: number
}
