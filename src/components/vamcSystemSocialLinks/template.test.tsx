import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcSystemSocialLinks } from './template'

describe('VamcSystemSocialLinks', () => {
  const mockProps = {
    regionNickname: 'Midwest Region',
    links: [
      {
        icon: 'mail',
        href: 'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=NEWS123',
        text: 'Subscribe to Midwest Region news and announcements',
      },
      {
        icon: 'facebook',
        href: 'https://facebook.com/midwest',
        text: 'Facebook Page',
      },
    ],
  }

  test('renders GetUpdatesSection with correct props', () => {
    const { container } = render(<VamcSystemSocialLinks {...mockProps} />)

    expect(
      screen.getByRole('heading', { name: /get updates from midwest region/i })
    ).toBeInTheDocument()

    // Check for va-link elements with the correct text attributes
    const newsLink = container.querySelector(
      'va-link[text="Subscribe to Midwest Region news and announcements"]'
    )
    expect(newsLink).toBeInTheDocument()
    expect(newsLink).toHaveAttribute(
      'href',
      'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=NEWS123'
    )

    const facebookLink = container.querySelector(
      'va-link[text="Facebook Page"]'
    )
    expect(facebookLink).toBeInTheDocument()
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/midwest')
  })

  test('renders with empty links array', () => {
    render(<VamcSystemSocialLinks regionNickname="Test Region" links={[]} />)

    expect(
      screen.getByRole('heading', { name: /get updates from test region/i })
    ).toBeInTheDocument()
  })

  test('passes correct section id to GetUpdatesSection', () => {
    const { container } = render(<VamcSystemSocialLinks {...mockProps} />)

    expect(container.querySelector('#get-updates')).toBeInTheDocument()
  })
})
