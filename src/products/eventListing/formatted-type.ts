import { EventWidgetTeaser } from '@/types/formatted/event'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'

export type EventListing = PublishedEntity & {
  title: string
  introText: string
  menu?: SideNavMenu
  events: EventWidgetTeaser[]
  totalItems: number
  totalPages: number
}
