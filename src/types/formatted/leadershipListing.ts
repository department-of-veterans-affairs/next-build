import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from './sideNav'

export type LeadershipListing = PublishedEntity & {
  title: string
  introText: string
  menu: SideNavMenu | null
}
