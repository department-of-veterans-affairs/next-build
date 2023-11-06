import React from 'react'
import { render, screen } from '@testing-library/react'
import Error404Page from '../404'

// Mocks for analytics event
jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

jest.mock('@/templates/globals/wrapper', () => ({
  Wrapper: ({ children }) => <div>{children}</div>,
}))

describe('Error404Page', () => {
  it('renders without crashing', () => {
    render(<Error404Page headerFooterData={{}} />)
    expect(
      screen.getByText('Sorry — we can’t find that page')
    ).toBeInTheDocument()
  })

  it('displays the search box', () => {
    render(<Error404Page headerFooterData={{}} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays common questions and popular links', () => {
    render(<Error404Page headerFooterData={{}} />)
    expect(screen.getByText('Common Questions')).toBeInTheDocument()
    expect(screen.getByText('Popular on VA.gov')).toBeInTheDocument()
  })
})
