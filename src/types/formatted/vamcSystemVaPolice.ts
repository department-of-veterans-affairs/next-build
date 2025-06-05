import { PublishedEntity } from './publishedEntity'
import { Administration } from '@/types/formatted/administration'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { Phone } from './contactInfo'
import { PhoneNumber } from '@/types/formatted/phoneNumber'
import { FeaturedContent } from './featuredContent'
import { QaGroup } from './qaGroup'
import { QaSection } from './qaSection'
import { FormattedCcQaSection } from './ccQaSection'


export type VamcSystemVaPolice = PublishedEntity & {
  title: string
  menu: SideNavMenu
  path: string
  policeOverview: Wysiwyg
  system: string
  phoneNumber: PhoneNumber
  policeReport: FeaturedContent
  // questionsAccordion: QaSection
  field_cc_faq: FormattedCcQaSection


}
