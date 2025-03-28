import type { PublishedEntity } from './publishedEntity'
import type { FeaturedContent } from './featuredContent'
import type { WysiwygField as FormattedWysiwyg } from './wysiwyg'
import type { textExpander as FormattedTextExpander } from './textExpander'
import { FormattedCcQaSection } from './ccQaSection'
import { PhoneNumber } from './phoneNumber'

export type FormattedVamcSystemVaPolice = PublishedEntity & {
  path?: { alias: string }
  title: string
  field_office: string // just the title of the HealthCareRegionPage/NodeOffice
  field_cc_faq: FormattedCcQaSection
  field_cc_police_report: FeaturedContent
  field_cc_va_police_overview: FormattedWysiwyg
  field_phone_numbers_paragraph: PhoneNumber
  field_cc_term_definitions: FormattedTextExpander
  field_cc_term_definitions_nation: FormattedTextExpander
}
