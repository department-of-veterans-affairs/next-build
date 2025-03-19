import { NodeHealthCareRegionPage, NodeOffice } from '../drupal/node'
import type { PublishedEntity } from './publishedEntity'
import type { FeaturedContent } from './featuredContent'
import type { CCQaSection as FormattedCCQASection } from './qaSection'
import type { WysiwygField as FormattedWysiwyg } from './wysiwyg'
import type { PhoneNumber as FormattedPhoneNumber } from './phoneNumber'

export type FormattedVamcSystemVaPolice = PublishedEntity & {
  title: string
  field_cc_faq: FormattedCCQASection
  field_cc_police_report: FeaturedContent
  field_cc_va_police_overview: FormattedWysiwyg
  field_phone_numbers_paragraph: FormattedPhoneNumber
  field_office: NodeHealthCareRegionPage
}
