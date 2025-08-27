import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '@/components/wysiwyg/formatted-type'
import { PhoneNumber } from '@/components/phoneNumber/formatted-type'
import { FeaturedContent } from '@/components/featuredContent/formatted-type'
import { QaSection as PublishedQaSection } from '@/components/qaSection/formatted-type'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

export type VamcSystemVaPolice = PublishedEntity & {
  title: string
  menu: SideNavMenu
  path: string
  policeOverview: Wysiwyg
  system: string
  phoneNumber: PhoneNumber
  policeReport: FeaturedContent
  faqs: PublishedQaSection
  lovellVariant?: LovellChildVariant
}
