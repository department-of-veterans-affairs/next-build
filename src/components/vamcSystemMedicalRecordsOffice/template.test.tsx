import React from 'react'
import { render, screen } from '@testing-library/react'
import VamcSystemMedicalRecordsOffice from './template'
import mockData from './mock.formatted'

describe('VamcSystemMedicalRecordsOffice', () => {
  it('renders the title', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)
    expect(screen.getByText('Medical records office')).toBeInTheDocument()
  })

  it('renders intro text with office entity label', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)
    const introText = screen.getByText(
      /Get copies of your VA medical records online, by mail or fax/i
    )
    expect(introText).toBeInTheDocument()
    expect(introText.textContent).toContain('VA Beckley health care')
  })

  it('renders the main heading with correct id', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('id', 'article-heading')
  })

  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)
    expect(window.sideNav).toEqual(mockData.menu)
  })

  it('renders topOfPageContent in the correct location', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)

    // Check that the topOfPageContent HTML is rendered
    const contentSection = screen.getByText('Get your records online')
    expect(contentSection).toBeInTheDocument()
    expect(contentSection.tagName).toBe('H2')
    expect(contentSection).toHaveAttribute('id', 'get-your-records-online')

    // Check that the paragraph content is also rendered
    const paragraphContent = screen.getByText(
      /Access your VA medical records online/
    )
    expect(paragraphContent).toBeInTheDocument()
  })

  it('renders the get records in person content', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)
    const contentSection = screen.getByText('Get your records in person')
    expect(contentSection).toBeInTheDocument()
    expect(contentSection.tagName).toBe('H2')
    expect(contentSection).toHaveAttribute('id', 'get-your-records-in-person')

    // Check that the paragraph content is also rendered
    const paragraphContent = screen.getByText(
      /We can help you get copies of your VA medical records/
    )
    expect(paragraphContent).toBeInTheDocument()
  })

  it('renders the reactWidget', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)
    const reactWidget = document.querySelector(
      '[data-template="paragraphs/react_widget"]'
    )
    expect(reactWidget).toBeInTheDocument()
  })

  it('renders the howWeShareRecordsContent', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)
    const howWeShareRecordsContent = screen.getByText(
      /Per VHA Directives, we have 20 business days to process all requests./
    )
    expect(howWeShareRecordsContent).toBeInTheDocument()
  })
})
