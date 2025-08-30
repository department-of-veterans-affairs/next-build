import React from 'react'
import { render, screen } from '@testing-library/react'
import VamcSystemRegisterForCare from './template'
import mockDrupalData from './mock.json'
import { formatter } from './query'

const mockData = formatter({ entity: mockDrupalData })

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

  it('renders the main article with correct attributes', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)
    const article = screen.getByRole('region')
    expect(article).toHaveAttribute('aria-labelledby', 'article-heading')
    expect(article).toHaveAttribute('role', 'region')
    expect(article).toHaveClass('usa-content')
  })

  it('renders the main heading with correct id', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('id', 'article-heading')
  })
})
