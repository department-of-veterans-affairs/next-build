import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcSystemVaPolice } from './index'
import mockFormattedFAQ from '@/mocks/formattedFAQ.mock'
import mockPhoneNumber from '@/mocks/phoneNumber.mock'
import mockFeaturedContent from '@/mocks/formattedFeaturedContent.mock'
import mockWysiwyg from '@/mocks/wysiwyg.mock'
import textExpander from '@/mocks/textExpander.mock'
import { within } from '@testing-library/dom'

describe('VamcSystemVaPolice with valid data', () => {
  test('renders VamcSystemVaPolice component', () => {
    const title = 'Hello'
    render(
      <VamcSystemVaPolice
        title={title}
        field_cc_faq={mockFormattedFAQ}
        field_cc_term_definitions={textExpander}
        field_cc_term_definitions_nation={textExpander}
        field_phone_numbers_paragraph={mockPhoneNumber}
        field_office={'Lovell Federal health care - VA'}
        field_cc_police_report={mockFeaturedContent}
        field_cc_va_police_overview={mockWysiwyg}
        id={'abc'}
        type=""
        published={true}
        lastUpdated=""
      />
    )

    expect(screen.queryByText(title)).toBeInTheDocument()
    expect(
      screen.queryByText(/VA police officers help make VA/)
    ).toBeInTheDocument()

    // VaPoliceContactInfo h2 is linked in <va-on-this-page />
    const onThisPage = screen.queryByTestId('va-on-this-page')
    expect(onThisPage).toBeInTheDocument()
    // TODO: Fix this test when we allow shadow DOM in tests
    // const linkToContactInfo = await within(onThisPage.shadowRoot).findByText(
    //   'How to contact us'
    // )
    // expect(linkToContactInfo).toBeInTheDocument()

    // VaPoliceContactInfo section
    expect(screen.queryByTestId('va-police-contact-info')).toBeInTheDocument()
    expect(
      screen.queryByTestId('va-police-contact-info-name')
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId('va-police-contact-info-phone-number')
    ).toBeInTheDocument()
  })
})
