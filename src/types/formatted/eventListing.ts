import { EventWidgetTeaser } from '@/products/event/formatted-type'
import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from './sideNav'

export type EventListing = PublishedEntity & {
  title: string
  introText: string
  menu?: SideNavMenu
  events: EventWidgetTeaser[]
  totalItems: number
  totalPages: number
}
