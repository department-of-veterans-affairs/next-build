import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VamcSystem } from '../vamcSystem/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '../wysiwyg/formatted-type'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/formatted-type'
import { ServiceLocation } from '../serviceLocation/formatted-type'
import { FieldAddress } from '@/types/drupal/field_type'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { ReactWidget } from '../reactWidget/formatted-type'
import { QaSection } from '../qaSection/formatted-type'

export interface VamcSystemMedicalRecordsOffice extends PublishedEntity {
  title: string
  vamcSystem: Pick<VamcSystem, 'id' | 'title'>
  menu: SideNavMenu
  topOfPageContent: Wysiwyg
  getRecordsInPersonContent: Wysiwyg
  howWeShareRecordsContent: Wysiwyg
  faqsContent: QaSection
  reactWidget: ReactWidget
  relatedLinks: ListOfLinkTeasers
  services: Array<{
    id: string
    title: string
    path: string
    serviceLocations: ServiceLocation[]
    address: FieldAddress
    phoneNumber: string
  }>
  getRecordsMailOrFaxContent: Wysiwyg
  mailingAddress: FieldAddress
  faxNumber: string | null
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
}
