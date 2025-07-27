import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
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
