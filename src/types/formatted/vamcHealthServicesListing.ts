import { PublishedEntity } from './publishedEntity'
import { Administration } from './administration'
import { VamcEhrSystem } from '@/types/drupal/vamcEhr'

export type VamcHealthServicesListing = PublishedEntity & {
  title: string
  introText: string
  path: string
  administration?: Administration
  vamcEhrSystem: VamcEhrSystem
}
