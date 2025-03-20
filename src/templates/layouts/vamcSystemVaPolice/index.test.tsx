import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcSystemVaPolice } from './index'
import mockFormattedFAQ from '@/mocks/mockFormattedFAQ.mock'
import mockPhoneNumber from '@/mocks/mockPhoneNumber.mock'
import mockFieldOffice from '@/mocks/mockFieldOffice.mock'
import mockFeaturedContent from '@/mocks/mockFeaturedContent.mock'
import mockWysiwyg from '@/mocks/mockWysiwyg.mock'
describe('VamcSystemVaPolice with valid data', () => {
  test('renders VamcSystemVaPolice component', () => {
    const title = 'Hello'
    render(
      <VamcSystemVaPolice
        title={title}
        field_cc_faq={mockFormattedFAQ}
        field_phone_numbers_paragraph={mockPhoneNumber}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - mock data is suffering from type errrors deep in a nested field media type
        field_office={mockFieldOffice}
        field_cc_police_report={mockFeaturedContent}
        field_cc_va_police_overview={mockWysiwyg}
        id={'abc'}
        type=""
        published={true}
        lastUpdated=""
      />
    )

    expect(screen.queryByText(title)).toBeInTheDocument()
    expect(screen.queryByText(mockFormattedFAQ.header)).toBeInTheDocument()
    expect(screen.queryByText(mockFeaturedContent.title)).toBeInTheDocument()
    expect(
      screen.queryByText(
        /Use our non-emergency phone number to request more information about VA police at /
      )
    ).toBeInTheDocument()
    expect(
      screen.getByTestId(mockFeaturedContent.link.id || 'featured-content-link')
    ).toBeInTheDocument()
  })
})
