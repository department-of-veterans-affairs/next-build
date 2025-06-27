import { PublishedEntity } from './publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { PhoneNumber } from '@/types/formatted/phoneNumber'
import { FeaturedContent } from './featuredContent'
import { QaSection } from './qaSection'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

export type VamcSystemVaPolice = PublishedEntity & {
  title: string
  menu: SideNavMenu
  path: string
  policeOverview: Wysiwyg
  system: string
  phoneNumber: PhoneNumber
  policeReport: FeaturedContent
  faqs: QaSection
  lovellVariant?: LovellChildVariant
}
