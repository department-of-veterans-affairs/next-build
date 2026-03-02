import { EventWidgetTeaser } from '@/components/eventTeaser/formatted-type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

export type EventListing = PublishedEntity & {
  title: string
  introText: string
  menu?: SideNavMenu
  events: EventWidgetTeaser[]
  totalItems: number
  totalPages: number
  lovellVariant: LovellChildVariant | null
  lovellSwitchPath: string | null
}
