import React from 'react'
import { render, screen } from '@testing-library/react'
import { PrepareForVisitAccordions } from './index'

const mockAccordions = [
  {
    id: '0',
    type: 'paragraph--basic_accordion',
    header: 'Before your visit',
    html: '<div>Bring your ID and insurance card.</div>',
  },
  {
    id: '1',
    type: 'paragraph--basic_accordion',
    header: 'During your visit',
    html: '<div>Check in at the front desk.</div>',
  },
]

describe('PrepareForVisitAccordions', () => {
  it('renders all accordion headings', () => {
    render(<PrepareForVisitAccordions visitItems={mockAccordions} />)
    expect(
      screen.getByTestId('accordion-item-0-before-your-visit')
    ).toHaveAttribute('header', 'Before your visit')
    expect(
      screen.getByTestId('accordion-item-1-during-your-visit')
    ).toHaveAttribute('header', 'During your visit')
    expect(
      screen.getByText('Bring your ID and insurance card.')
    ).toBeInTheDocument()
    expect(screen.getByText('Check in at the front desk.')).toBeInTheDocument()
  })
  it('applies top margin class when topMargin prop is false', () => {
    render(
      <PrepareForVisitAccordions
        visitItems={mockAccordions}
        topMargin={false}
      />
    )
    const heading = screen.getByText('Prepare for your visit')
    expect(heading).toHaveClass('vads-u-margin-top--0')
  })
})
