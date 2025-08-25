import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

export type VamcHealthServicesListing = PublishedEntity & {
  title: string
  introText: string
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
}
