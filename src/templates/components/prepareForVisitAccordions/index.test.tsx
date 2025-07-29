import React from 'react'
import { render, screen } from '@testing-library/react'
import { PrepareForVisitAccordions } from './index'

const mockAccordions = [
  {
    id: '1',
    type: 'paragraph--basic_accordion',
    header: 'Before your visit',
    html: '<div>Bring your ID and insurance card.</div>',
  },
  {
    id: '2',
    type: 'paragraph--basic_accordion',
    header: 'During your visit',
    html: '<div>Check in at the front desk.</div>',
  },
]

describe('PrepareForVisitAccordions', () => {
  it('renders all accordion headings', () => {
    render(<PrepareForVisitAccordions visitItems={mockAccordions} />)
    expect(
      screen.getByTestId('accordion-item-1-before-your-visit')
    ).toHaveAttribute('header', 'Before your visit')
    expect(
      screen.getByTestId('accordion-item-2-during-your-visit')
    ).toHaveAttribute('header', 'During your visit')
    expect(
      screen.getByText('Bring your ID and insurance card.')
    ).toBeInTheDocument()
    expect(screen.getByText('Check in at the front desk.')).toBeInTheDocument()
  })
})
