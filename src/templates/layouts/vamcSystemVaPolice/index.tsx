import { Paragraph } from '@/templates/components/paragraph'
import { WysiwygField } from '@/templates/components/wysiwyg'
import { FeaturedContent } from '@/templates/components/featuredContent'
import VamcSystemFacilityPage from '@/templates/components/vamcFacilityPage'
import { FormattedVamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import { VaPoliceContactInfo } from './vaPoliceContactInfo'
import { QaSection } from '@/templates/components/qaSection'
import { useEffect, useState } from 'react'

export function VamcSystemVaPolice({
  title,
  field_cc_faq,
  field_cc_police_report,
  field_cc_va_police_overview,
  field_office,
  field_phone_numbers_paragraph,
  lastUpdated,
}: FormattedVamcSystemVaPolice) {
  return (
    <VamcSystemFacilityPage includeFeedbackButton lastUpdated={lastUpdated}>
      <h1>{title}</h1>
      <WysiwygField
        className="va-introtext vads-u-font-size--lg vads-u-font-family--serif"
        html={field_cc_va_police_overview.html}
      />
      <va-on-this-page></va-on-this-page>
      <VaPoliceContactInfo
        className="vads-u-margin-bottom--4"
        phoneNumber={field_phone_numbers_paragraph}
        fieldOffice={field_office}
      />
      <FeaturedContent
        featuredContent={field_cc_police_report}
        headlineClassName="vads-u-font-size--h3"
        className="vads-u-margin-bottom--4"
      />
      <QaSection
        header={field_cc_faq.header}
        intro={field_cc_faq.intro}
        type={field_cc_faq.type}
        questions={field_cc_faq.questions}
        displayAccordion
        id={field_cc_faq.id}
      />
    </VamcSystemFacilityPage>
  )
}
