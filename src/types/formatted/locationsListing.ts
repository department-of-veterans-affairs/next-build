import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'

export type LocationsListing = PublishedEntity & {
  title: string
  menu: SideNavMenu
  path: string
}
