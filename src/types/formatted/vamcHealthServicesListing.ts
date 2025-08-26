import { PublishedEntity } from './publishedEntity'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { Administration } from './administration'
import { VamcEhrSystem } from '@/types/drupal/vamcEhr'
import { SideNavMenu } from '@/types/formatted/sideNav'

export type VamcHealthServicesListing = PublishedEntity & {
  title: string
  introText: string
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
  path: string
  administration?: Administration
  vamcEhrSystem: VamcEhrSystem
  menu: SideNavMenu | null
  featuredContent?: Array<{
    id: string
    type: string
    title: string
    summary: string
    uri: string
    parentField: string
  }>
}
