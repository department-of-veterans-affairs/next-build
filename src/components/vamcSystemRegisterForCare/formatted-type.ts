import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VamcSystem } from '../vamcSystem/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '../wysiwyg/formatted-type'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/formatted-type'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { VhaFacilityNonclinicalService } from '../vhaFacilityNonclinicalService/formatted-type'

export interface VamcSystemRegisterForCare extends PublishedEntity {
  title: string
  vamcSystem: Pick<VamcSystem, 'id' | 'title'>
  menu: SideNavMenu
  topOfPageContent: Wysiwyg
  bottomOfPageContent: Wysiwyg
  relatedLinks: ListOfLinkTeasers
  services: VhaFacilityNonclinicalService[]
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
}
