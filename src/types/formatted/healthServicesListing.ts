import { PublishedEntity } from './publishedEntity'

export type HealthServicesListing = PublishedEntity & {
  title: string
  description: string
  introText: string
}
