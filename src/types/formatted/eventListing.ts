import { EventWidgetTeaser } from './event'
import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from './sideNav'

export type EventListing = PublishedEntity & {
  title: string
  introText: string
  menu: SideNavMenu
  events: EventWidgetTeaser[]
}
