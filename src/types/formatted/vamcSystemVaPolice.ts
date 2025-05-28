import { PublishedEntity } from './publishedEntity'
import { Administration } from '@/types/formatted/administration'
import { SideNavMenu } from '@/types/formatted/sideNav'

export type VamcSystemVaPolice = PublishedEntity & {
  title: string
  menu: SideNavMenu
  path: string
}
