import React from 'react'
import { render, screen } from '@testing-library/react'
import { GetUpdatesSection } from './index'

describe('GetUpdatesSection', () => {
  const links = [
    { label: 'Facebook', url: 'https://facebook.com', type: 'facebook' },
    { label: 'Email', url: 'mailto:test@example.com', type: null },
  ]

  it('renders heading and section id', () => {
    render(
      <GetUpdatesSection
        heading="Stay Updated"
        links={links}
        sectionId="updates"
      />
    )
    const heading = screen.getByRole('heading', { name: 'Stay Updated' })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveAttribute('id', 'updates')
  })

  it('renders all links with correct labels and urls', () => {
    render(
      <GetUpdatesSection heading="Updates" links={links} sectionId="updates" />
    )
    expect(screen.getByTestId('link-facebook')).toHaveAttribute(
      'href',
      'https://facebook.com'
    )
    expect(screen.getByTestId('link-email')).toHaveAttribute(
      'href',
      'mailto:test@example.com'
    )
  })

  it('renders va-icon only when type is present', () => {
    render(
      <GetUpdatesSection heading="Updates" links={links} sectionId="updates" />
    )
    // Facebook link should have an icon
    expect(screen.getByTestId('icon-facebook')).toBeInTheDocument()
    // Email link should NOT have an icon
    expect(screen.queryByTestId('icon-email')).not.toBeInTheDocument()
  })
})
