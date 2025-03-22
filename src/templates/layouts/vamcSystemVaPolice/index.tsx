import { WysiwygField } from '@/templates/components/wysiwyg'
import { VamcSystemFacilityPage } from '@/templates/common/vamcFacilityPage'
import { FormattedVamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import { SummaryBox } from '@/templates/common/summaryBox'
import { VaPoliceContactInfo } from './vaPoliceContactInfo'
import { CCQaSection } from '@/templates/components/ccQaSection'

export function VamcSystemVaPolice({
  title,
  field_cc_faq,
  field_cc_police_report,
  field_cc_va_police_overview,
  field_phone_numbers_paragraph,
  path,
  entityPath,
}: FormattedVamcSystemVaPolice) {
  return (
    <VamcSystemFacilityPage
      includeFeedbackButton
      path={entityPath || path?.alias || window.location.pathname}
    >
      <h1>{title}</h1>

      <WysiwygField
        className="va-introtext vads-u-font-size--lg vads-u-font-family--serif"
        html={field_cc_va_police_overview.html}
      />
      <va-on-this-page></va-on-this-page>
      <SummaryBox {...field_cc_police_report} />
      <VaPoliceContactInfo />
      {/* This work was already done, just the data processing that transformed the CC FAQ to regular hadn't been */}
      <CCQaSection {...field_cc_faq} />
    </VamcSystemFacilityPage>
  )
}
