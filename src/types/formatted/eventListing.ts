import { EventTeaser } from "./event"
import { PublishedEntity } from "./publishedEntity"
import { SideNavMenu } from "./sideNav"

export type EventListing = PublishedEntity & {
  title: string
  menu: SideNavMenu
  events: EventTeaser[]
}
