import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'

export interface VamcSystemPoliciesPage extends PublishedEntity {
  menu: SideNavMenu
  introText?: string
  topOfPageContent?: string
  generalVisitationPolicy?: string
  visitationPolicy?: string
  otherPolicies?: string
  bottomOfPageContent?: string
}
