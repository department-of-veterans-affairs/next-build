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

  it('renders the faqsContent', () => {
    const { container } = render(
      <VamcSystemMedicalRecordsOffice {...mockData} />
    )
    const faqsContent = screen.getByText(/Questions about medical records/)
    expect(faqsContent).toBeInTheDocument()

    // console.log(container.innerHTML)
    const accordionDiv = container.querySelector(
      '[data-template="paragraphs/q_a.collapsible_panel"]'
    )
    expect(accordionDiv).toBeInTheDocument()
  })

  it('renders the getRecordsMailOrFaxContent', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)

    // Check for the main heading
    const heading = screen.getByText('Get your records by mail or fax')
    expect(heading).toBeInTheDocument()

    // Check for the instruction text
    const instructionText = screen.getByText(
      /To request a copy of your VA medical records by mail or fax, send a signed and completed VA Form 10-5345a to our Release of Information office./
    )
    expect(instructionText).toBeInTheDocument()

    // Check for the form download link - there are multiple instances, so use getAllByRole
    const downloadLinks = screen.getAllByRole('link', {
      name: /Download VA Form 10-5345a \(PDF\)/,
    })
    expect(downloadLinks).toHaveLength(2) // One in the mail/fax content, one in the in-person content
    expect(downloadLinks[0]).toHaveAttribute(
      'href',
      'https://www.va.gov/vaforms/medical/pdf/VHA%20Form%2010-5345a%20Fill-revision.pdf'
    )
    expect(downloadLinks[0]).toHaveAttribute('hreflang', 'en')
  })

  it('renders the mail heading and address', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)

    // Check for the mail heading
    const mailHeading = screen.getByText('Mail your signed form to')
    expect(mailHeading).toBeInTheDocument()

    // Check that the Address component renders the mailing address
    // The Address codfsmponent renders address_line1, address_line2, and city, state zip
    expect(
      screen.getByText(/VA Boston ATTN: HIMS Medical Records/)
    ).toBeInTheDocument()
  })

  it('renders the fax number section when faxNumber is provided', () => {
    render(<VamcSystemMedicalRecordsOffice {...mockData} />)

    // Check for the fax heading
    const faxHeading = screen.getByText('Fax your signed form to')
    expect(faxHeading).toBeInTheDocument()

    // Check for the fax number - it's rendered inside a va-telephone component
    const faxNumberElement = screen.getByTestId('fax-number')
    expect(faxNumberElement).toBeInTheDocument()
  })

  it('does not render the fax number section when faxNumber is null', () => {
    const mockDataWithoutFax = {
      ...mockData,
      faxNumber: null,
    }

    render(<VamcSystemMedicalRecordsOffice {...mockDataWithoutFax} />)

    // Check that the fax heading is not rendered
    const faxHeading = screen.queryByText('Fax your signed form to')
    expect(faxHeading).not.toBeInTheDocument()

    // Check that the fax number is not rendered
    const faxNumberElement = screen.queryByTestId('fax-number')
    expect(faxNumberElement).not.toBeInTheDocument()
  })
})
