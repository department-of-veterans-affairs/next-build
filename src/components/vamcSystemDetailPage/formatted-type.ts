import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/formatted-type'
import { Administration } from '../administration/formatted-type'
import { VamcEhrSystem } from '@/types/drupal/vamcEhr'
import { VamcSystem } from '../vamcSystem/formatted-type'
import { FormattedParagraph } from '@/lib/drupal/queries'

export interface VamcSystemDetailPage extends PublishedEntity {
  title: string
  path: string
  introText?: string
  showTableOfContents?: boolean
  menu: SideNavMenu
  administration?: Administration
  vamcEhrSystem: VamcEhrSystem
  vamcSystem: Pick<VamcSystem, 'path'>
  featuredContent: FormattedParagraph[] | null
  relatedLinks: ListOfLinkTeasers | null
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
  showLovellSwitcher: boolean
}
