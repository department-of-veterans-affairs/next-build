import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { NodeHealthCareRegionPage } from '../drupal/node'
import { Administration } from '@/types/formatted/administration'
import { HealthCareLocalFacility } from '@/products/healthCareLocalFacility/formatted-type'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

export type MinimalLocalFacility = Pick<
  HealthCareLocalFacility,
  | 'title'
  | 'path'
  | 'operatingStatusFacility'
  | 'address'
  | 'mainPhoneString'
  | 'mentalHealthPhoneNumber'
  | 'vaHealthConnectPhoneNumber'
  | 'image'
>

export type LocationsListing = PublishedEntity & {
  title: string
  menu: SideNavMenu
  path: string
  administration: Administration
  vamcEhrSystem: NodeHealthCareRegionPage['field_vamc_ehr_system']
  mainFacilities: MinimalLocalFacility[]
  healthClinicFacilities: MinimalLocalFacility[]
  mobileFacilities: MinimalLocalFacility[]
  lovellVariant?: LovellChildVariant
  lovellSwitchPath?: string
  otherVaLocationIds: string[]
}
