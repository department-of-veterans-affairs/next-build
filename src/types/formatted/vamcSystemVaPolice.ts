import { PublishedEntity } from './publishedEntity'
import { Administration } from '@/types/formatted/administration'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '@/types/formatted/wysiwyg'

export type VamcSystemVaPolice = PublishedEntity & {
  title: string
  menu: SideNavMenu
  path: string
  policeOverview: Wysiwyg
  system: string
}
