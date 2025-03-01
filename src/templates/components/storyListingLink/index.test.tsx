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

  it('renders a va-link element with correct attributes', () => {
    const linkElement = document.querySelector('va-link')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', path)
    expect(linkElement).toHaveAttribute('text', 'See all stories')
    expect(linkElement).toHaveAttribute('active')
    expect(linkElement).toHaveAttribute(
      'classname',
      'vads-u-display--block vads-u-margin-bottom--7'
    )
  })

  it('invokes recordEvent function with correct event when clicked', () => {
    const linkElement = document.querySelector('va-link')
    fireEvent.click(linkElement)
    expect(recordEvent).toHaveBeenCalledTimes(1)
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'nav-secondary-button-click',
    })
  })
})
