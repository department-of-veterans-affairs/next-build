import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VamcSystem } from '../vamcSystem/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '../wysiwyg/formatted-type'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/formatted-type'
import { ServiceLocation } from '../serviceLocation/formatted-type'
import { FieldAddress } from '@/types/drupal/field_type'

export interface VamcSystemBillingAndInsurance extends PublishedEntity {
  title: string
  vamcSystem: Pick<VamcSystem, 'id' | 'title'>
  menu: SideNavMenu
  aboveTopOfPageContent?: Wysiwyg
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
}
