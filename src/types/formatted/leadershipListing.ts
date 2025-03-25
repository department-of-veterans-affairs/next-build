import { PersonProfile } from './personProfile'
import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from './sideNav'

export type LeadershipListing = PublishedEntity & {
  description: string
  introText?: string
  leadership: PersonProfile[]
  menu?: SideNavMenu
  title: string
}
