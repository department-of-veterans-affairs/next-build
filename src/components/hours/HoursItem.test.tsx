import React from 'react'
import { render, screen } from '@testing-library/react'
import { HoursItem } from './HoursItem'
import { FieldOfficeHours } from '@/types/drupal/field_type'

describe('HoursItem', () => {
  const renderComponent = (item: FieldOfficeHours) => {
    render(<HoursItem item={item} />)
  }

  it('renders the correct abbreviated day name in bold', () => {
    renderComponent({ day: 2, starthours: 900, endhours: 1700, comment: null })
    const dayElement = screen.getByText(/Tue:/, { selector: 'strong' })
    expect(dayElement).toBeInTheDocument()
  })

  it('renders Open 24 hours if start and end hours are 0 and no comment', () => {
    renderComponent({ day: 0, starthours: 0, endhours: 0, comment: null })
    expect(screen.getByText(/Open 24 hours/i)).toBeInTheDocument()
  })

  it('renders Closed if both hours are null and no comment', () => {
    renderComponent({ day: 1, starthours: null, endhours: null, comment: null })
    expect(screen.getByText(/Closed/i)).toBeInTheDocument()
  })

  it('renders time range correctly when hours are defined', () => {
    renderComponent({ day: 3, starthours: 930, endhours: 1730, comment: null })
    expect(screen.getByText(/9:30 a\.m\. to 5:30 p\.m\./i)).toBeInTheDocument()
  })

  it('renders midnight and noon correctly', () => {
    renderComponent({ day: 4, starthours: 0, endhours: 1200, comment: null })
    expect(screen.getByText(/midnight to noon/i)).toBeInTheDocument()
  })

  it('renders comment if provided', () => {
    renderComponent({
      day: 5,
      starthours: 1000,
      endhours: 1600,
      comment: 'By appointment only',
    })
    expect(
      screen.getByText(/10:00 a\.m\. to 4:00 p\.m\. By appointment only/i)
    ).toBeInTheDocument()
  })

  it('handles Sunday as day 0 correctly', () => {
    renderComponent({ day: 0, starthours: 800, endhours: 1200, comment: null })
    expect(screen.getByText(/Sun:/i)).toBeInTheDocument()
  })

  it('handles Sunday as day 7 correctly', () => {
    renderComponent({ day: 7, starthours: 800, endhours: 1200, comment: null })
    expect(screen.getByText(/Sun:/i)).toBeInTheDocument()
  })

  it('ignores -1 hour values and omits them from display', () => {
    renderComponent({ day: 1, starthours: -1, endhours: 1400, comment: null })
    expect(screen.getByText(/^2:00 p\.m\./i)).toBeInTheDocument()
  })
})
