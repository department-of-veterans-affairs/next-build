import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { Administration } from '@/components/administration/formatted-type'
import { VamcEhrSystem } from '@/types/drupal/vamcEhr'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { LinkTeaser } from '@/components/linkTeaser/formatted-type'

export type VamcHealthServicesListing = PublishedEntity & {
  title: string
  introText: string
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
  path: string
  administration?: Administration
  vamcEhrSystem: VamcEhrSystem
  menu: SideNavMenu | null
  featuredContent?: LinkTeaser[]
}
