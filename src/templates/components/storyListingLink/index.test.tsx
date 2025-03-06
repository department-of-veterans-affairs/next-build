import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { StoryListingLink } from './'
import { recordEvent } from '@/lib/analytics/recordEvent'

jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

describe('<StoryListingLink /> Component', () => {
  const path = '/some-path'

  beforeEach(() => {
    render(<StoryListingLink path={path} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders an anchor element with correct attributes', () => {
    const linkElement = screen.getByText('See all stories')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement.tagName).toBe('A')
    expect(linkElement).toHaveAttribute('href', path)
    expect(linkElement).toHaveAttribute('id', 'news-stories-listing-link')
    expect(linkElement).toHaveClass('vads-u-display--block')
    expect(linkElement).toHaveClass('vads-u-margin-bottom--7')
  })

  it('invokes recordEvent function with correct event when clicked', () => {
    const linkElement = screen.getByText('See all stories')
    fireEvent.click(linkElement)
    expect(recordEvent).toHaveBeenCalledTimes(1)
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'nav-secondary-button-click',
    })
  })
})
