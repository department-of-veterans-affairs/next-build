import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VamcSystem } from '../vamcSystem/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'

export interface VamcSystemRegisterForCare extends PublishedEntity {
  title: string
  vamcSystem: Pick<VamcSystem, 'id' | 'title'>
  menu: SideNavMenu
}
