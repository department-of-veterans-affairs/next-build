import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { NodeHealthCareRegionPage } from '../drupal/node'
import { Administration } from '@/types/formatted/administration'

export type LocationsListing = PublishedEntity & {
  title: string
  menu: SideNavMenu
  path: string
  administration: Administration
  vamcEhrSystem: NodeHealthCareRegionPage['field_vamc_ehr_system']
}
