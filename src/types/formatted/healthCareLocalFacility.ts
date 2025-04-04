import { FacilityOperatingStatusFlags } from '../drupal/node'
import { VamcEhr } from '../drupal/vamcEhr'
import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from './sideNav'

export type HealthCareLocalFacility = PublishedEntity & {
  introText: string | null
  operatingStatusFacility: FacilityOperatingStatusFlags
  menu: SideNavMenu | null
  path: string
  administration?: { entityId: number }
  vamcEhrSystem: VamcEhr['field_region_page']['field_vamc_ehr_system']
}
