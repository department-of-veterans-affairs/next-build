import React from 'react'
import { render, screen } from '@testing-library/react'
import FacilitySocialLinks from './FacilitySocialLinks'

describe('FacilitySocialLinks', () => {
  const baseProps = {
    regionNickname: 'Midwest Region',
  }

  test('renders nothing if no links are present', () => {
    render(<FacilitySocialLinks {...baseProps} />)
    expect(
      screen.queryByRole('heading', {
        label: /get updates from midwest region/i,
      })
    ).not.toBeInTheDocument()
  })

  // This currently fails because there are no links present
  test('renders heading with region nickname', () => {
    render(
      <FacilitySocialLinks {...baseProps} fieldGovdeliveryIdNews="NEWS123" />
    )
    expect(
      screen.getByRole('heading', { label: /get updates from midwest region/i })
    ).toBeInTheDocument()
  })

  test('renders news subscription link with correct text and href', () => {
    const { container } = render(
      <FacilitySocialLinks {...baseProps} fieldGovdeliveryIdNews="NEWS123" />
    )

    const links = container.querySelectorAll('va-link')
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('text')).toBe(
      'Subscribe to Midwest Region news and announcements'
    )
    expect(links[0].getAttribute('href')).toBe(
      'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=NEWS123'
    )
  })

  test('renders emergency subscription link with correct text and href', () => {
    const { container } = render(
      <FacilitySocialLinks {...baseProps} fieldGovdeliveryIdEmerg="EMERG456" />
    )

    const links = container.querySelectorAll('va-link')
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('text')).toBe(
      'Subscribe to Midwest Region emergency notifications'
    )
    expect(links[0].getAttribute('href')).toBe(
      'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=EMERG456'
    )
  })

  test('renders operating status link with correct text and href', () => {
    const { container } = render(
      <FacilitySocialLinks
        {...baseProps}
        fieldOperatingStatus={{ url: '/status' }}
      />
    )

    const links = container.querySelectorAll('va-link')
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('text')).toBe(
      'Midwest Region operating status'
    )
    expect(links[0].getAttribute('href')).toBe('/status')
  })

  test('renders all social media links with correct text and href attributes', () => {
    const { container } = render(
      <FacilitySocialLinks
        {...baseProps}
        fieldFacebook={{
          uri: 'https://facebook.com/midwest',
          title: 'Facebook Page',
        }}
        fieldTwitter={{
          uri: 'https://twitter.com/midwest',
          title: 'Twitter Page',
        }}
        fieldFlickr={{
          uri: 'https://flickr.com/midwest',
          title: 'Flickr Page',
        }}
        fieldInstagram={{
          uri: 'https://instagram.com/midwest',
          title: 'Instagram Page',
        }}
        fieldYoutube={{
          uri: 'https://youtube.com/midwest',
          title: 'YouTube Page',
        }}
      />
    )

    const expectations = [
      ['Facebook Page', 'https://facebook.com/midwest'],
      ['Twitter Page', 'https://twitter.com/midwest'],
      ['Flickr Page', 'https://flickr.com/midwest'],
      ['Instagram Page', 'https://instagram.com/midwest'],
      ['YouTube Page', 'https://youtube.com/midwest'],
    ]

    for (const [text, href] of expectations) {
      const link = container.querySelector(`va-link[text="${text}"]`)
      expect(link).toBeInTheDocument()
      expect(link?.getAttribute('href')).toBe(href)
    }

    // Expect none of the GovDelivery links to be present
    expect(
      container.querySelector(
        'va-link[href^="https://public.govdelivery.com/"]'
      )
    ).not.toBeInTheDocument()
  })

  test('renders all links together with correct hrefs and text', () => {
    const { container } = render(
      <FacilitySocialLinks
        {...baseProps}
        fieldGovdeliveryIdNews="NEWS123"
        fieldGovdeliveryIdEmerg="EMERG456"
        fieldOperatingStatus={{ url: '/status' }}
        fieldFacebook={{ uri: '#', title: 'Facebook' }}
        fieldTwitter={{ uri: '#', title: 'Twitter' }}
        fieldFlickr={{ uri: '#', title: 'Flickr' }}
        fieldInstagram={{ uri: '#', title: 'Instagram' }}
        fieldYoutube={{ uri: '#', title: 'YouTube' }}
      />
    )

    const expectedLinks = [
      [
        'Subscribe to Midwest Region news and announcements',
        'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=NEWS123',
      ],
      [
        'Subscribe to Midwest Region emergency notifications',
        'https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=EMERG456',
      ],
      ['Midwest Region operating status', '/status'],
      ['Facebook', '#'],
      ['Twitter', '#'],
      ['Flickr', '#'],
      ['Instagram', '#'],
      ['YouTube', '#'],
    ]

    for (const [text, href] of expectedLinks) {
      const link = container.querySelector(`va-link[text="${text}"]`)
      expect(link).toBeInTheDocument()
      expect(link?.getAttribute('href')).toBe(href)
    }
  })

  test('applies correct margin classes to paragraph elements wrapping links', () => {
    const { container } = render(
      <FacilitySocialLinks
        {...baseProps}
        fieldGovdeliveryIdNews="NEWS123"
        fieldGovdeliveryIdEmerg="EMERG456"
        fieldOperatingStatus={{ url: '/status' }}
        fieldFacebook={{ uri: '#', title: 'Facebook' }}
        fieldTwitter={{ uri: '#', title: 'Twitter' }}
      />
    )

    // Get all paragraph elements
    const paragraphs = container.querySelectorAll('p')

    // First column (GovDelivery links + operating status) - 3 items
    const firstColumnParagraphs = Array.from(paragraphs).slice(0, 3)

    // Check that first two paragraphs in first column have margin-bottom--2
    expect(firstColumnParagraphs[0]).toHaveClass('vads-u-margin-bottom--2')
    expect(firstColumnParagraphs[1]).toHaveClass('vads-u-margin-bottom--2')

    // Check that last paragraph in first column has margin-bottom--0
    expect(firstColumnParagraphs[2]).toHaveClass('vads-u-margin-bottom--0')
    expect(firstColumnParagraphs[2]).not.toHaveClass('vads-u-margin-bottom--2')

    // Second column (social media links) - 2 items
    const secondColumnParagraphs = Array.from(paragraphs).slice(3, 5)

    // Check that first paragraph in second column has margin-bottom--2
    expect(secondColumnParagraphs[0]).toHaveClass('vads-u-margin-bottom--2')

    // Check that last paragraph in second column has margin-bottom--0
    expect(secondColumnParagraphs[1]).toHaveClass('vads-u-margin-bottom--0')
    expect(secondColumnParagraphs[1]).not.toHaveClass('vads-u-margin-bottom--2')

    // All paragraphs should have margin-top--0
    paragraphs.forEach((paragraph) => {
      expect(paragraph).toHaveClass('vads-u-margin-top--0')
    })
  })
})
