import React from 'react'
import { render, screen } from '@testing-library/react'
import VamcSystemBillingAndInsurance from './template'
import mockData from './mock.formatted'

describe('VamcSystemBillingAndInsurance', () => {
  it('renders the title', () => {
    render(<VamcSystemBillingAndInsurance {...mockData} />)
    expect(screen.getByText('Billing and insurance')).toBeInTheDocument()
  })

  it('renders intro text with office entity label', () => {
    render(<VamcSystemBillingAndInsurance {...mockData} />)
    const introText = screen.getByText(/You can pay your/i)
    expect(introText).toBeInTheDocument()
  })

  it('renders the main heading with correct id', () => {
    render(<VamcSystemBillingAndInsurance {...mockData} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('id', 'article-heading')
  })

  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystemBillingAndInsurance {...mockData} />)

    // @ts-expect-error - window.sideNav is not a default window property, but
    // we're adding it
    expect(window.sideNav).toEqual(mockData.menu)
  })

  it('renders topOfPageContent in the correct location', () => {
    render(<VamcSystemBillingAndInsurance {...mockData} />)
    expect(
      screen.getByText(/Pay online, by phone, or mail/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Find out how to make a payment/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Pay online, by phone, or by mail/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Pay in person/)).toBeInTheDocument()
  })

  it('renders bottomOfPageContent in the correct location', () => {
    render(<VamcSystemBillingAndInsurance {...mockData} />)
    expect(
      screen.getByText(/Private and other health insurance/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/If you have another form of health coverage/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Learn how VA health care works with other health insurance/
      )
    ).toBeInTheDocument()
  })
})
