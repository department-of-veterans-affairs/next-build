import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from './sideNav'
import { StaffProfileTeaser } from '@/products/staffProfile/formatted-type'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

export type LeadershipListing = PublishedEntity & {
  title: string
  introText: string
  menu: SideNavMenu | null
  profiles: StaffProfileTeaser[]
  lovellVariant?: LovellChildVariant
  lovellSwitchPath?: string
}
