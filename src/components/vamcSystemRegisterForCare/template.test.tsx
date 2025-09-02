import React from 'react'
import { render, screen } from '@testing-library/react'
import VamcSystemRegisterForCare from './template'
import mockData from './mock.formatted'

describe('VamcSystemRegisterForCare', () => {
  it('renders the title', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)
    expect(screen.getByText('Register for care')).toBeInTheDocument()
  })

  it('renders intro text with office entity label', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)
    const introText = screen.getByText(/Register to get care at one of our/i)
    expect(introText).toBeInTheDocument()
    expect(introText.textContent).toContain('VA Richmond health care')
  })

  it('renders the main heading with correct id', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('id', 'article-heading')
  })

  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)

    // @ts-expect-error - window.sideNav is not a default window property, but
    // we're adding it
    expect(window.sideNav).toEqual(mockData.menu)
  })

  it('renders topOfPageContent in the correct location', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)

    // Check that the topOfPageContent HTML is rendered
    const contentSection = screen.getByText('Patient registration (admissions)')
    expect(contentSection).toBeInTheDocument()
    expect(contentSection.tagName).toBe('H2')
    expect(contentSection).toHaveAttribute(
      'id',
      'patient-registration-admission'
    )

    // Check that the paragraph content is also rendered
    const paragraphContent = screen.getByText(
      /Whether you moved and need to change your medical center/
    )
    expect(paragraphContent).toBeInTheDocument()
  })
})
