import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'

export interface OutreachHub extends PublishedEntity {
  title: string
  description: string | null
  body: string | null
  menu: SideNavMenu | null
}
