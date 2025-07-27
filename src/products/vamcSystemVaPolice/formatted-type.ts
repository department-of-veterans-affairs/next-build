import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { PhoneNumber } from '@/types/formatted/phoneNumber'
import { FeaturedContent } from '@/types/formatted/featuredContent'
import { QaSection } from '@/types/formatted/qaSection'
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
