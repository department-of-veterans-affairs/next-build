import { FacilityOperatingStatusFlags } from '../drupal/node'
import { PublishedEntity } from './publishedEntity'

export type HealthCareLocalFacility = PublishedEntity & {
  // Other attributes here
  introText: string | null
  operatingStatusFacility: FacilityOperatingStatusFlags
}
