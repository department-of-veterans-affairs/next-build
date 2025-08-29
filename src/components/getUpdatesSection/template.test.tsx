import React from 'react'
import { render, screen } from '@testing-library/react'
import { GetUpdatesSection } from './template'

describe('GetUpdatesSection', () => {
  const links = [
    { text: 'Facebook', href: 'https://facebook.com', type: 'facebook' },
    { text: 'Email', href: 'mailto:test@example.com', type: null },
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
    const { container } = render(
      <GetUpdatesSection heading="Updates" links={links} sectionId="updates" />
    )
    expect(container.querySelector('va-link[text="Facebook"]')).toHaveAttribute(
      'href',
      'https://facebook.com'
    )
    expect(container.querySelector('va-link[text="Email"]')).toHaveAttribute(
      'href',
      'mailto:test@example.com'
    )
  })

  it('renders va-icon only when type is present', () => {
    const { container } = render(
      <GetUpdatesSection heading="Updates" links={links} sectionId="updates" />
    )
    // Facebook link should have an icon
    expect(
      container.querySelector('va-icon[icon="facebook"]')
    ).toBeInTheDocument()
    // Email link should NOT have an icon
    expect(
      container.querySelector('va-icon[icon="email"]')
    ).not.toBeInTheDocument()
  })
})
