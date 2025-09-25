import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { Wysiwyg } from '../wysiwyg/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'

export interface VamcSystemPoliciesPage extends PublishedEntity {
  menu: SideNavMenu
  introText?: Wysiwyg
  topOfPageContent?: Wysiwyg
  generalVisitationPolicy?: Wysiwyg
  visitationPolicy?: string
  otherPolicies?: string
  bottomOfPageContent?: Wysiwyg
}
