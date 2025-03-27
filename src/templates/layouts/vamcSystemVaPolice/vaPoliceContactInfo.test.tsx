import React from 'react'
import { render, screen } from '@testing-library/react'
import mockPhoneNumber from '@/mocks/phoneNumber.mock'
import { VaPoliceContactInfo } from './vaPoliceContactInfo'

describe('VaPoliceContactInfo with valid data', () => {
  const fieldOfficeName = 'Lovell Federal health care - VA'
  test('renders VaPoliceContactInfo component with phone number and name', () => {
    render(
      <VaPoliceContactInfo
        phoneNumber={mockPhoneNumber}
        fieldOfficeName={fieldOfficeName}
      />
    )

    expect(screen.queryByTestId('va-police-contact-info')).toBeInTheDocument()
    expect(
      screen.queryByTestId('va-police-contact-info-name')
    ).toHaveTextContent(new RegExp(fieldOfficeName))
    const phoneNumber = screen.queryByTestId(
      'va-police-contact-info-phone-number'
    )
    expect(phoneNumber).toBeInTheDocument()
    expect(phoneNumber).toHaveAttribute('contact', mockPhoneNumber.number)
    expect(phoneNumber).toHaveAttribute('extension', mockPhoneNumber.extension)
  })
  test('Does not render VaPoliceContactInfo component with missing phone number', () => {
    render(
      <VaPoliceContactInfo
        phoneNumber={undefined}
        fieldOfficeName={fieldOfficeName}
      />
    )
    expect(
      screen.queryByTestId('va-police-contact-info')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('va-police-contact-info-name')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('va-police-contact-info-phone-number')
    ).not.toBeInTheDocument()
  })
  test('Does not render VaPoliceContactInfo component with missing field office name', () => {
    render(
      <VaPoliceContactInfo phoneNumber={mockPhoneNumber} fieldOfficeName={''} />
    )
    expect(
      screen.queryByTestId('va-police-contact-info')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('va-police-contact-info-name')
    ).not.toBeInTheDocument()
  })
})
