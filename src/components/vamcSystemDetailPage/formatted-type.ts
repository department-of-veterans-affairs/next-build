import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VamcSystem } from '../vamcSystem/formatted-type'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/formatted-type'

export interface VamcSystemDetailPage extends PublishedEntity {
  title: string
  path: string
  introText?: string
  showTableOfContents?: boolean
  menu: SideNavMenu
  relatedLinks: ListOfLinkTeasers | null
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
}
