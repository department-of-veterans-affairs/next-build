import { FacilityOperatingStatusFlags } from '../drupal/node'
import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from './sideNav'

export type HealthCareLocalFacility = PublishedEntity & {
  // Other attributes here
  introText: string | null
  operatingStatusFacility: FacilityOperatingStatusFlags
  menu: SideNavMenu | null
}
