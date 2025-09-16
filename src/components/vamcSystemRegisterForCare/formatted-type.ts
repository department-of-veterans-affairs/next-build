import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VamcSystem } from '../vamcSystem/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '../wysiwyg/formatted-type'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/formatted-type'
import { ServiceLocation } from '../serviceLocation/formatted-type'
import { FieldAddress } from '@/types/drupal/field_type'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

export interface VamcSystemRegisterForCare extends PublishedEntity {
  title: string
  vamcSystem: Pick<VamcSystem, 'id' | 'title'>
  menu: SideNavMenu
  topOfPageContent: Wysiwyg
  bottomOfPageContent: Wysiwyg
  relatedLinks: ListOfLinkTeasers
  services: Array<{
    id: string
    title: string
    path: string
    serviceLocations: ServiceLocation[]
    address: FieldAddress
    phoneNumber: string
  }>
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
}
