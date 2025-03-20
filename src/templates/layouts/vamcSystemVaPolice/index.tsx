import { WysiwygField } from '@/templates/components/wysiwyg'
import { CCFeaturedContent } from '@/templates/components/ccFeaturedContent'
import { VamcSystemFacilityPage } from '@/templates/components/vamcFacilityPage'
import { FormattedVamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import { VaPoliceContactInfo } from './vaPoliceContactInfo'
import { QaSection } from '@/templates/components/qaSection'

export function VamcSystemVaPolice({
  title,
  field_cc_faq,
  field_cc_police_report,
  field_cc_va_police_overview,
  field_office,
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
        {...field_cc_va_police_overview}
      />
      <va-on-this-page></va-on-this-page>
      <VaPoliceContactInfo
        className="vads-u-margin-bottom--4"
        phoneNumber={field_phone_numbers_paragraph}
        fieldOffice={field_office}
      />
      <CCFeaturedContent featuredContent={field_cc_police_report} />
      <QaSection {...field_cc_faq} />
    </VamcSystemFacilityPage>
  )
}
