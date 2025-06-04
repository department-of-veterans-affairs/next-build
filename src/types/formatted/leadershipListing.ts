import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from './sideNav'
import { StaffProfileTeaser } from './staffProfile'

export type LeadershipListing = PublishedEntity & {
  title: string
  introText: string
  menu: SideNavMenu | null
  profiles: StaffProfileTeaser[]
}
